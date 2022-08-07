const sgMail = require('@sendgrid/mail');
const { Directus } = require('@directus/sdk');
const json2html = require('node-json2html');
const { SENDGRID_API_KEY, DIRECTUS_TOKEN } = process.env;
const slugify = require('slugify')
const email = "website@sexpression.org.uk";
const axios = require('axios').default;
const url = "https://sexpression.directus.app";

sgMail.setApiKey(SENDGRID_API_KEY);
const directus = new Directus(url);

exports.handler = async function (event, context, callback) {
    try {
        let { payload, form } = cleanPayload(JSON.parse(event.body).payload.data);
        console.log(form.id);
        form = await getForm(form.id);

        let { payloadMod, branchItem } = await giyy(payload);

        let branchStatus = false;
        if (branchItem) {
            branchStatus = await prepareEmail(payloadMod, branchItem.email, "Thank you to a branch", form.title);
            branchStatus ? payload.branch_email_sent = true : payload.branch_email_sent = false;
        }

        payload.email_sent = await prepareEmail(payloadMod, payload.Email, "Thank you to a person", form.title, form.response);

        payload = dataCleaner(payload);

        let responseId = await directusPostRecord(form.collection, payload);

        console.log(form);

        let notifications = [];

        form.roles.forEach(async (x, i) => {
            console.log("forms_directus_roles_id", x);

            // get role id
            let roleId = await directusGetRecord("forms_directus_roles", x);

            console.log("cat");
            console.log(roleId);
            // get role using role id
            let roles = await directusGetRecord("directus_roles", roleId);

            console.log(roles.users);

                roles.users.forEach((v, i) => {
                notifications.push({
                    "recipient": v,
                    "subject": "You have a new response",
                    "collection": form.collection,
                    "message": `\n<a href=\"${url}/admin/content/${form.collection}/${responseId}\">Click here to view.</a>\n`,
                    "item": responseId
                })
            })

        });

        let data = JSON.stringify({ notifications });

        console.log(data);

        try {
            let response = await axios.post(`${url}/notifications`, data);
            console.log(response);
            return {
                statusCode: 200,
                body: "Complete!",
            };
        } catch(e) {
            console.log(e)
        }

    } catch (error) {
        console.error(error);
    }
}


async function giyy(payload) {
    let payloadMod = { ...payload };
    let branchItem = false;
    if (payload.Branch) {
        branchItem = await directusGetRecord('branches', payload.Branch);
        payloadMod.Branch = branchItem.name;
    }
    return { payloadMod, branchItem };
}

async function branchManager(payload, text, form) {

    let branch = false;

    if (payload.Branch) {
        branchOb = await directusGetRecord('branches', payload.Branch);
        console.log({ "payload": payload, "branchOb.email": branchOb.email, "text": text, "form": form, "branchOb": branchOb })
        branchStatus = await prepareEmail(payload, branchOb.email, text, form.title, branchOb);
    }

    return { branch };
}

function notification() {
    try {


        return "done"
    } catch (e) {
        // Deal with the fact the chain failed
        console.log(e)
        return "fail"
    }
}

function cleanPayload(payload) {
    let form = {
        id: payload.id
    }
    delete payload.user_agent;
    delete payload.referrer;
    delete payload.ip;
    delete payload.id;
    return { payload, form }
}

function dataCleaner(payload) {
    let newbie = {};

    for (const [key, value] of Object.entries(payload)) {
        let newKey = slugify(key, {
            replacement: '_',
            lower: true,
            strict: true,
        })
        newbie[newKey] = value;
    }

    return newbie;
}

async function prepareEmail(data, recipient, message, formTitle, emailStatement) {
    try {

        let data1 = { ...data }

        let newData = {
            fields: []
        }

        if (emailStatement) {
            newData.statement = emailStatement;
        }

        for (let prop in data1) {
            if (Object.prototype.hasOwnProperty.call(data1, prop)) {
                newData.fields.push({ 'key': prop, 'value': data1[prop] })
            }
        }

        json2html.component.add('field', { '<>': 'li', 'text': '${key}: ${value}' });

        let template = [
            { '<>': 'h1', 'text': '${statement}' },
            {
                '<>': 'ul', 'html': [
                    { '[]': 'field', '{}': function () { return (this.fields); } }
                ]
            }
        ];

        let html = json2html.render(newData, template);

        let msg = {
            to: recipient,
            from: email,
            subject: `${message} | ${formTitle}`,
            text: "New Sexpression:UK mail",
            html: html
        };
        // await sendEmail(msg);
        console.log(msg);
        return true;
    } catch (error) {
        console.error(error);
    }
}

async function sendEmail(msg) {
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

async function directusGetRecord(collection, id, gummy = false) {
    if (gummy === false) {
        gummy = "id"
    }

    query = {}
    query.filter = {};
    query.filter[gummy] = { "_eq": id };

    let response = await directus.items(collection).readByQuery(query);
    return response.data[0];
}

async function getForm(form_id) {
    try {
        let form = await directusGetRecord('forms', form_id);
        return form;
    } catch (fail) {
        console.error("no form", fail)
    }
}

async function directusPostRecord(collection, record) {
    await directus.auth.static(DIRECTUS_TOKEN);
    let chosenCollection = await directus.items(collection);

    let response = await chosenCollection.createOne(record);

    return response.id;
}