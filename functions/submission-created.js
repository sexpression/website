const payloadUtil = require('./submission/payload');
const directusUtil = require('./submission/directus');
const emailUtil = require('./submission/email');

exports.handler = async function (event, context, callback) {
    try {
        let { payload, form } = payloadUtil.clean(JSON.parse(event.body).payload.data);

        form = await directusUtil.readRecord("forms", form.id);

        // create a new payload
        let payloadMod;

        // if payload has university or branches - replace id with name
        if (payload.University) {
            payloadMod = await payloadUtil.replaceIdWithName(payload, "University", payload.University, "universities", "archived");
        } else if(payload.Branch) {
            payloadMod = await payloadUtil.replaceIdWithName(payload, "Branch", payload.Branch, "branches");
        }


        payload.branch_email_sent = false;
        if (payloadMod.Branch) {
            console.log("payloadMod", payloadMod);
            payload.branch_email_sent = await emailUtil.send(payloadMod.payloadMod, payloadMod.payloadMod.Branch, "Thank you to a branch", form.title);
        }

        payload.sender_email_sent = false;
        payload.sender_email_sent = await emailUtil.send(payloadMod.payloadMod, payloadMod.payloadMod.Email, "Thank you to a person", form.title, form.response);

        payload = payloadUtil.format(payload);

        let responseId = await directusUtil.createRecord(form.collection, payload);

        form.roles.forEach(async (x, i) => {
            let forms_directus_roles = await directusUtil.readRecord("forms_directus_roles", x);
            let role = await directusUtil.readRecord("directus_roles", forms_directus_roles.directus_roles_id);
            directusUtil.createNotifications(role.users, form.collection, responseId);
        });

        return {
            statusCode: 200,
            body: "DONE"
        }

    } catch (e) {
        console.error("submission", e);
    }
}