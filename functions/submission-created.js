const sgMail = require('@sendgrid/mail');
const { DIRECTUS_URL } = process.env;
const { Directus } = require('@directus/sdk');
const directus = new Directus(`https://${DIRECTUS_URL}`);
const json2html = require('node-json2html');

const {
    SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL,
} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

function htmlConstructor(data, template) {
    let html = json2html.render(data, template);
    // console.log(html)
    return html;
}

function emailConstructor(to, from, subject, html) {
    try {
        return {
            to: to,
            from: from,
            subject: subject,
            text: "This is a test",
            html: html
        };
    } catch (error) {
        console.error(error);
    }
}

async function emailSender(msg) {
    try {
        let response = await sgMail.send(msg);
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
    let payload = JSON.parse(event.body).payload.data;
    console.log(payload)
    let path = event.path.slice(0, -1).substring(event.path.slice(0, -1).lastIndexOf('/') + 1);
    console.log(path);
    let form = await directus.items("forms").readByQuery({ meta: 'total_count', filter: { "template": { "_eq": path } }, fields: ['*', 'recipient.members_id'] });

    console.log(form);

    let branchArr = payload["Branch"].split(",");

    payload["Branch"] = branchArr[1];

    delete payload.user_agent;
    delete payload.referrer;
    delete payload.ip;

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
        copyData.unshift({ 'key': 'statment', 'value': await form.data[0].response });
        let html = htmlConstructor(copyData, template1);
        let msg = emailConstructor(payload["Email"], SENDGRID_FROM_EMAIL, `Thank you ${payload['Full name']}`, html)
        console.log(msg);
        // await emailSender(msg);
    } catch (error) {
        console.error(error);
    }

    // EMAIL 2 - MEMBER //////////////////////////////////////////////////
    try {
        for (let x of await form.data[0].recipient) {
            let html = htmlConstructor(data, template2);
            let member = await directus.items("members").readByQuery({ meta: 'total_count', filter: { "id": { "_eq": x.members_id } } });
            let msg = emailConstructor(member.data[0].email, SENDGRID_FROM_EMAIL, `New response | ${path}`, html);
            console.log(msg);
            // await emailSender(msg);
        }
    } catch (error) {
        console.error(error);
    }

    // EMAIL 3 - BRANCH //////////////////////////////////////////////////
    if (path === "join-a-branch" || "request-a-session") {
        try {
            let html = htmlConstructor(data, template2);
            let msg = emailConstructor(branchArr[0], SENDGRID_FROM_EMAIL, `New response | ${path}`, html)
            console.log(msg);
            // await emailSender(msg);
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log("branch skipped");
    }

    return {
        statusCode: 200,
        body: "successful mate",
    };
}