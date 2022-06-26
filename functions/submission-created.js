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

function messageSender(msg) {
    try {
        let response = await sgMail.send(msg);
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

    console.log(payload);
    // let referrer = new URL(payload.referrer);

    // EMAIL 1 - SENDER //////////////////////////////////////////////////
    try {

        let senderEmail = payload.email;
        let senderName = payload.fullname;
        let senderResponse = payload.response;

        messageContructor(senderEmail, SENDGRID_FROM_EMAIL, `Thank you ${senderName}`, senderResponse)
        messageSender();
        console.log("sender success");
    } catch (error) {
        console.error(error);
    }

    // EMAIL 2 - MEMBER //////////////////////////////////////////////////
    try {
        let form = event.path;
        let one = await directus.items("forms").readByQuery({ meta: 'total_count', filter: { "template": { "_eq": form } } });
        let dog = await one.items.recipient.members_id;
        let two = await directus.items("members").readOne(dog);
        let memberEmail = two.items.email;
        let memberName = two.items.full_name;

        messageContructor(senderEmail, SENDGRID_FROM_EMAIL, `New response | ${form}`, "")
        messageSender();
        console.log("member success");
    } catch (error) {
        console.error(error);
    }

    // EMAIL 3 - BRANCH //////////////////////////////////////////////////
    if (form === "join-a-branch" || "request-a-session") {
        try {
            let branchArr = payload.branch.split(",");
            let branchEmail = branchArr[0];
            let branchName = branchArr[1];

            messageContructor(branchEmail, SENDGRID_FROM_EMAIL, "", "", "")
            messageSender();
            console.log("branch success");
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