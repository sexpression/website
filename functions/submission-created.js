const client = require('@sendgrid/mail');

const {
    SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL,
} = process.env;

exports.handler = async function (event, context, callback) {
    const payload = JSON.parse(event.body).payload.data;

    const volunteerEmail = payload.email;
    const volunteerName = payload.fullname;
    const volunteerPronouns = payload.genderpronouns;

    if (volunteerPronouns == null) {
        volunteerPronouns = 'They/Them/Their'
    }

    const branchArr = payload.branch.split(",");
    const branchEmail = branchArr[0];
    const branchName = branchArr[1];

    client.setApiKey(SENDGRID_API_KEY);

    const msgToBranch = {
        to: `${branchEmail}`,
        from: SENDGRID_FROM_EMAIL,
        subject: "You have a new volunteer!",
        text: `${volunteerName} wants to join your branch.`,
        html: `
        <div>
            <p><strong><i>${volunteerName}</i></strong> (${volunteerPronouns})</p>
            <p><a href="mailto:${volunteerEmail}">${volunteerEmail}</a></p>
        </div>
        <div>
            <p><i>${volunteerName}</i> wants to join <i>Sexpression:${branchName}</i>. Introduce yourself by sending them an email. Invite them to your social media and make sure they feel welcomed! 🌈</p>
        </div>`,
    };

    const msgToVolunteer = {
        to: `${volunteerEmail}`,
        from: SENDGRID_FROM_EMAIL,
        subject: `Thanks for reaching out to Sexpression:${branchName}`,
        text: `The branch committee memeber of Sexpression:${branchName} will reach out to you shortly.`,
    };

    try {
        await client.send(msgToBranch);
        await client.send(msgToVolunteer);
        return {
            statusCode: 200,
            body: 'Messages sent',
        };
    } catch (err) {
        return {
            statusCode: err.code,
            body: JSON.stringify({ msg: err.message }),
        };
    }

};