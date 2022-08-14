const payloadUtil = require('./submission/payload');
const directusUtil = require('./submission/directus');
const emailUtil = require('./submission/email');

const url = "https://sexpression.directus.app";

exports.handler = async function (event, context, callback) {
    try {
        let { payload, form } = payloadUtil.clean(JSON.parse(event.body).payload.data);

        form = await directusUtil.readRecord("forms", form.id);

        let { payloadMod, branchItem } = await payloadUtil.newPlusName(payload);

        let branchStatus = false;
        if (branchItem) {
            branchStatus = await emailUtil.send(payloadMod, branchItem.email, "Thank you to a branch", form.title);
            branchStatus ? payload.branch_email_sent = true : payload.branch_email_sent = false;
        }

        payload.sender_email_sent = await emailUtil.send(payloadMod, payload.Email, "Thank you to a person", form.title, form.response);

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
        console.error("submission",e);
    }
}