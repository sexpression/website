const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(SENDGRID_API_KEY);
const json2html = require('node-json2html');
const email = "website@sexpression.org.uk";

async function send(data, recipient, message, formTitle, emailStatement) {
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

        let response = await sgMail.send(msg);
        console.log({ message: msg, response: response[0].statusCode })

        return true;
    } catch (e) {
        console.error("email.send",e);
        return false;
    }
}


exports.send = send;