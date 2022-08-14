const payloadUtil = require('./submission/payload');
const directusUtil = require('./submission/directus');
const emailUtil = require('./submission/email');

const url = "https://sexpression.directus.app";

exports.handler = async function (event, context, callback) {

    try {
        let { payload, form } = payloadUtil.clean(JSON.parse(event.body).payload.data);

        form = await directusUtil.getRecord("forms", form.id);

        let { payloadMod, branchItem } = await payloadUtil.newPlusName(payload);

        let branchStatus = false;
        if (branchItem) {
            branchStatus = await emailUtil.build(payloadMod, branchItem.email, "Thank you to a branch", form.title);
            branchStatus ? payload.branch_email_sent = true : payload.branch_email_sent = false;
        }

        payload.email_sent = await emailUtil.build(payloadMod, payload.Email, "Thank you to a person", form.title, form.response);

        payload = payloadUtil.format(payload);

        let responseId = await directusUtil.postRecord(form.collection, payload);

        console.log(form);

        let notifications = form.roles.forEach(async (x, i) => {

            let notifications = [];
            let roleId = await directusUtil.getRecord("forms_directus_roles", x);
            let roles = await directusUtil.getRecord("directus_roles", roleId.directus_roles_id);

            await roles.users.forEach((v, i) => {
                notifications.push({
                    "recipient": v,
                    "subject": "You have a new response",
                    "collection": form.collection,
                    "message": `\n<a href=\"${url}/admin/content/${form.collection}/${responseId}\">Click here to view.</a>\n`,
                    "item": responseId
                })
            })

            return notifications;

        });

        console.log("notifications", notifications);

        let data = JSON.stringify({ notifications });

        console.log(data);

        // console.log(directusUtil.postNotification(url, data));

        return {
            statusCode: 200,
            body: "DONE"
        }

    } catch (error) {
        console.error(error);
    }
}