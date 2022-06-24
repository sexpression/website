const client = require('@sendgrid/mail');

const {
    SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL,
} = process.env;

exports.handler = async function(event, context, callback) {

    let payload = JSON.parse(event.body).payload.data;
    let referrer = new URL(payload.referrer);

    let senderEmail = payload.email;

    sgMail.setApiKey(SENDGRID_API_KEY)
    const msg = {
        to: '', // Change to your recipient
        from: senderEmail, // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })

    return {
        statusCode: 200,
        body: JSON.stringify({
            msg: {
                branch: response1,
                volunteer: response2
            }
        }),
    };
}