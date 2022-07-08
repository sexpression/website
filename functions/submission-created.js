const sgMail = require('@sendgrid/mail');
const { Directus } = require('@directus/sdk');
const json2html = require('node-json2html');
const directus = new Directus(`https://sexpression.directus.app`);
const email = "website@sexpression.org.uk";
const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

function htmlConstructor(data, template) {
    let html = json2html.render(data, template);
    return html;
}

function emailConstructor(to, from, subject, html) {
    try {
        return {
            to: to,
            from: from,
            subject: subject,
            text: "New Sexpression:UK mail",
            html: html
        };
    } catch (error) {
        console.error(error);
    }
}

async function emailSender(msg) {
    try {
        let response = await sgMail.send(msg);
        console.log({ message: msg, response: response[0].statusCode })
        return {
            statusCode: response.statusCode,
            body: response.body,
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: error.code,
            body: JSON.stringify({ msg: error.message }),
        };
    }
}

exports.handler = async function(event, context, callback) {
    try {
        let payload = JSON.parse(event.body).payload.data;
        let meta = 'total_count';
        let filter = { "template": { "_eq": payload.template } };
        let fields = ['*', 'recipient.*'];
        let form = await directus.items("forms").readByQuery({ meta: meta, filter: filter, fields: fields });
        delete payload.user_agent;
        delete payload.referrer;
        delete payload.ip;
        delete payload.template;

        let template1 = {
            '<>': 'div',
            'html': [
                { '<>': 'p', 'text': '${statement}' },
                {
                    '<>': 'ul',
                    'html': [
                        { '<>': 'li', 'text': '${key}: ${value}' },
                    ]
                }
            ]
        };

        let template2 = {
            '<>': 'div',
            'html': [{
                '<>': 'ul',
                'html': [
                    { '<>': 'li', 'text': '${key}: ${value}' },
                ]
            }]
        };

        let data = [];

        for (let prop in payload) {
            if (Object.prototype.hasOwnProperty.call(payload, prop)) {
                data.push({ 'key': prop, 'value': payload[prop] })
            }
        }

        // EMAIL 1 - SENDER //////////////////////////////////////////////////
        try {
            let copyData = JSON.parse(JSON.stringify(data));
            copyData.unshift({ 'key': 'Statment', 'value': await form.data[0].response });
            let html = htmlConstructor(copyData, template1);
            let msg = emailConstructor(payload["Email"], email, `Thank you ${payload['Full name']}`, html)
            await emailSender(msg);
        } catch (error) {
            console.error(error);
        }

        // EMAIL 2 - MEMBER //////////////////////////////////////////////////
        try {
            for (let x of await form.data[0].recipient) {
                let html = htmlConstructor(data, template2);
                let member = await directus.items("members").readByQuery({ meta: 'total_count', filter: { "id": { "_eq": x.members_id } }, fields: ['*', 'role.*'] });
                let msg = emailConstructor(member.data[0].role.email, email, `New response | ${form.data[0].title}`, html);
                await emailSender(msg);
            }
        } catch (error) {
            console.error(error);
        }

        // EMAIL 3 - BRANCH //////////////////////////////////////////////////
        if (payload["Branch"]) {
            try {
                let branchArr = payload["Branch"].split(",");
                payload["Branch"] = branchArr[1];
                let html = htmlConstructor(data, template2);
                let msg = emailConstructor(branchArr[0], email, `New response | ${form.data[0].title}`, html)
                await emailSender(msg);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log("Branch email skipped");
        }

        return {
            statusCode: 200,
            body: "successful mate",
        };
    } catch (error) {
        console.error(error);
    }
}