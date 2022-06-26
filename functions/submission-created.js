const sgMail = require('@sendgrid/mail');
const { DIRECTUS_URL } = process.env;
const { Directus } = require('@directus/sdk');
const directus = new Directus(`https://${DIRECTUS_URL}`);
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

    console.log(payload);
    // let referrer = new URL(payload.referrer);

    // EMAIL 1 - SENDER //////////////////////////////////////////////////
    try {
        let senderEmail = payload.email;
        let senderName = payload.fullname;
        let senderResponse = payload.response;

        let msg = messageContructor(senderEmail, SENDGRID_FROM_EMAIL, `Thank you ${senderName}`, "senderResponse")
        await messageSender(msg);
    } catch (error) {
        console.error(error);
    }

    // EMAIL 2 - MEMBER //////////////////////////////////////////////////
    try {
        let one = await directus.items("forms").readByQuery({ meta: 'total_count', filter: { "template": { "_eq": path } }, fields: ['*', 'recipient.members_id'] });

        for (let x of one.data[0].recipient) {
            let member = await directus.items("members").readByQuery({ meta: 'total_count', filter: { "id": { "_eq": x.members_id } } });
            let msg = messageContructor(member.data[0].email, SENDGRID_FROM_EMAIL, `New response | ${path}`, "this has whole response");
            await messageSender(msg);
        }
    } catch (error) {
        console.error(error);
    }

    // EMAIL 3 - BRANCH //////////////////////////////////////////////////
    if (path === "join-a-branch" || "request-a-session") {
        try {

            let branchArr = payload.branch.split(",");
            let branchEmail = branchArr[0];
            let branchName = branchArr[1];

            let msg = messageContructor(branchEmail, SENDGRID_FROM_EMAIL, "You are a branch", "testing")
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