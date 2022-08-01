const sgMail = require('@sendgrid/mail');
const { Directus } = require('@directus/sdk');
const json2html = require('node-json2html');
const { SENDGRID_API_KEY, DIRECTUS_TOKEN } = process.env;
const slugify = require('slugify')
const email = "website@sexpression.org.uk";
const branchTemplate = {
    '<>': 'div',
    'html': [{
        '<>': 'ul',
        'html': [
            { '<>': 'li', 'text': '${key}: ${value}' },
        ]
    }]
};
const confirmationTemplate = {
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
const slugifyPreferences = {
    replacement: '_',
    lower: true,
    strict: true,
}

sgMail.setApiKey(SENDGRID_API_KEY);
const directus = new Directus(`https://sexpression.directus.app`);

exports.handler = async function (event, context, callback) {
    try {
        let { payload, form_id, branch_id } = cleanPayload(JSON.parse(event.body).payload.data);
        let cleanData = dataCleaner(payload);
        let form = await directusGetRecord('forms', form_id);
        let branch = await directusGetRecord('branches', branch_id);

        // send them email
        let emailStatus = false;
        if (form) {
        emailStatus = await prepareEmail(cleanData, confirmationTemplate, cleanData.email, "Thank you", form.title);
        } else {
            console.log("Sender email skipped");
        }

        // send branch email
        let branchStatus = false;
        if (branch) {
            branchStatus = await prepareEmail(cleanData, branchTemplate, branch.email, "New response", form.title, branch);
        } else {
            console.log("Branch email skipped");
        }

        // add to responese collection
        await directus.auth.static(DIRECTUS_TOKEN);
        cleanData.email_sent = emailStatus;
        cleanData.branch_email_sent = branchStatus;
        cleanData.branch= branch_id;

        console.log(cleanData);
        let id = await directusPostRecord(slugify(form.title, slugifyPreferences), cleanData);

        // create a notification with collection name, record id and directus_user id
        // it can support sending multiple notifications
        // and boilerplate text which includes a link to the new response record

        // [{
        //     "collection": "{{ collection }}",
        //     "recipient": "{{ directus-user-id }}",
        //     "message": `Hi there! There is a new Join a Branch response: https://sexpression.directus.app/admin/content/${ collection | slugify }/${ record-id }`
        // },
        // {
        //     "collection": "articles",
        //     "recipient": "410b5772-e63f-4ae6-9ea2-39c3a31bd6ca",
        //     "message": "Hi there! You should check out these articles"
        // }]


        return {
            statusCode: 200,
            body: "successful mate",
        };

    } catch (error) {
        console.error(error);
    }
}

function cleanPayload(payload) {
    const form_id = payload.id;
    let branch_id = false;
    if (payload.Branch) {
        branch_id = payload.Branch;
    }
    delete payload.user_agent;
    delete payload.referrer;
    delete payload.ip;
    delete payload.id;
    return { payload, form_id, branch_id }
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

async function prepareEmail(data, template, recipient, message, form_title, branch = false) {
    try {
        if(data.branch) {
            data.branch = branch.name;
        }

        let newData = [];

        for (let prop in data) {
            if (Object.prototype.hasOwnProperty.call(data, prop)) {
                newData.push({ 'key': prop, 'value': data[prop] })
            }
        }

        let html = json2html.render(newData, template);

        let msg = {
            to: recipient,
            from: email,
            subject: `${message} | ${form_title}`,
            text: "New Sexpression:UK mail",
            html: html
        };
        // await sendEmail(msg);
        console.log(msg);
        return true;
    } catch (error) {
        console.error(error);
        return false;
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

// DIRECTUS
async function directusGetRecord(collection, id) {
    let response = await directus.items(collection).readByQuery({ filter: { "id": { "_eq": id } } });
    return response.data[0];
}

async function directusPostRecord(collection, record) {
    let chosenCollection = await directus.items(collection);

    let response = await chosenCollection.createOne(record);

    return response.id;
}