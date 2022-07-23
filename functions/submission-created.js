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

async function sendtoSender(data, formResponse, template1, payloadEmail, payloadFullName) {
    try {
        let copyData = JSON.parse(JSON.stringify(data));
        copyData.unshift({ 'key': 'Statment', 'value': await formResponse });
        let html = htmlConstructor(copyData, template1);
        let msg = emailConstructor(payloadEmail, email, `Thank you ${payloadFullName}`, html);
        console.log(msg)
        await emailSender(msg);
    } catch (error) {
        console.error(error);
    }
}

async function sendtoRoles(form, data, template2) {
    try {
        for (let x of form.roles) {
            let meta = 'total_count';
            let rolefilter = { "id": { "_eq": x.roles_id } };
            let role = await directus.items("roles").readByQuery({ meta: meta, filter: rolefilter });
            let html = htmlConstructor(data, template2);
            let msg = emailConstructor(role.data[0].email, email, `New response | ${form.title}`, html);
            console.log(msg)
            await emailSender(msg);
        }
    } catch (error) {
        console.error(error);
    }
}

async function sendtoBranches(branch, form, data, template2) {
    try {
        let branchArr = branch.split(",");
        branch = branchArr[1];
        let html = htmlConstructor(data, template2);
        let msg = emailConstructor(branchArr[0], email, `New response | ${form.title}`, html)
        console.log(msg)
        await emailSender(msg);
    } catch (error) {
        console.error(error);
    }
}

exports.handler = async function(event, context, callback) {
    try {
        let payload = JSON.parse(event.body).payload.data;
        let meta = 'total_count';
        let filter = { "template": { "_eq": payload.template } };
        let fields = ['*', 'roles.*'];
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

        await sendtoSender(data, form.data[0].roles, template1, payload["Email"], payload['Full name']);

        if (form.data[0].roles.length > 0) {
            await sendtoRoles(form.data[0], data, template2);
        } else {
            console.log("Roles skipped");
        }

        if (payload["Branch"]) {
            await sendtoBranches(payload["Branch"], form.data[0], data, template2);
        } else {
            console.log("Branch skipped");
        }

        return {
            statusCode: 200,
            body: "successful mate",
        };

    } catch (error) {
        console.error(error);
    }
}