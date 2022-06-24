const sgMail = require('@sendgrid/mail');

const {
    SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL,
} = process.env;

exports.handler = async function(event, context, callback) {

    let payload = JSON.parse(event.body).payload.data;
    let referrer = new URL(payload.referrer);
    let senderEmail = payload.email;

    console.log(SENDGRID_API_KEY)
    console.log(SENDGRID_FROM_EMAIL)
    console.log(payload);
    console.log(referrer);

    sgMail.setApiKey(SENDGRID_API_KEY)
    const msg = {
        to: SENDGRID_FROM_EMAIL, // Change to your recipient
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
            msg: msg
        }),
    };
}