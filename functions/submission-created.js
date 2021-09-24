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
        subject: `New volunteer - ${volunteerName} 🎉`,
        text: `${volunteerName} (${volunteerPronouns}) wants to join your branch.`,
    };

    const msgToVolunteer = {
        to: `${volunteerEmail}`,
        from: SENDGRID_FROM_EMAIL,
        subject: `Thank you from Sexpression:${branchName} 💖`,
        text: `Sexpression:${branchName} will reach out to you shortly.`,
    };

    let response1 = await client.send(msgToBranch);
    let response2 = await client.send(msgToVolunteer);

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                msg: {
                    branch: response1,
                    volunteer: response2
                }
            }
        ),
    };

}