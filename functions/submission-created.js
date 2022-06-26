const sgMail = require('@sendgrid/mail');
const { DIRECTUS_URL } = process.env;
const { Directus } = require('@directus/sdk');
const directus = new Directus(`https://${DIRECTUS_URL}`);
const htmlCreator = require('html-creator');

const {
    SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL,
} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

function messageContructor(to, from, subject, text, html = undefined) {
    try {
        return {
            to: to,
            from: from,
            subject: subject,
            text: text,
            html: html
        };
    } catch (error) {
        console.error(error);
    }
}

async function messageSender(msg) {
    try {
        let response = await sgMail.send(msg);
        console.log(response);
        return {
            statusCode: 200,
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
    let path = event.path.slice(0, -1).substring(event.path.slice(0, -1).lastIndexOf('/') + 1)

    let branchArr = payload.branch.split(",");

    payload.branch = branchArr[1];
    payload['branchEmail'] = branchArr[0];

    delete payload.ip;
    delete payload.user_agent;
    delete payload.referrer;

    let items = [];

    for (let prop in payload) {
        if (Object.prototype.hasOwnProperty.call(payload, prop)) {
            console.log(prop + " : " + payload[prop]);
            items.push({ type: 'p', content: `${prop} : ${payload[prop]}` })
        }
    }

    let htmlObject = new htmlCreator([{
        type: 'body',
        content: [{
            type: 'div',
            content: items
        }],
    }, ]);

    let html = htmlObject.renderHTML();

    // EMAIL 1 - SENDER //////////////////////////////////////////////////
    try {
        let senderEmail = payload.email;
        let senderName = payload.fullname;

        let msg = messageContructor(senderEmail, SENDGRID_FROM_EMAIL, `Thank you ${senderName}`, "senderResponse", html)
        await messageSender(msg);
    } catch (error) {
        console.error(error);
    }

    // EMAIL 2 - MEMBER //////////////////////////////////////////////////
    try {
        let one = await directus.items("forms").readByQuery({ meta: 'total_count', filter: { "template": { "_eq": path } }, fields: ['*', 'recipient.members_id'] });

        for (let x of one.data[0].recipient) {
            let member = await directus.items("members").readByQuery({ meta: 'total_count', filter: { "id": { "_eq": x.members_id } } });
            let msg = messageContructor(member.data[0].email, SENDGRID_FROM_EMAIL, `New response | ${path}`, "this has whole response", html);
            await messageSender(msg);
        }
    } catch (error) {
        console.error(error);
    }

    // EMAIL 3 - BRANCH //////////////////////////////////////////////////
    if (path === "join-a-branch" || "request-a-session") {
        try {

            let msg = messageContructor(payload.branchEmail, SENDGRID_FROM_EMAIL, "You are a branch", "testing", html)
            await messageSender(msg);
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