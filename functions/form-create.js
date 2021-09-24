const client = require('@sendgrid/mail');

const {
    SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL,
} = process.env;

exports.handler = async function (event, context, callback) {
    const payload = JSON.parse(event.body).payload.data;

    const referrer = new URL(payload.referrer);
    if (referrer.pathname === "/contact/join/") {

        const volunteerEmail = payload.email;
        const volunteerName = payload.fullname;
        let volunteerPronouns = payload.genderpronouns;

        console.log(`Pre: ${volunteerPronouns} - ${typeof volunteerPronouns}`);

        if (volunteerPronouns == null | volunteerPronouns == "") {
            volunteerPronouns = 'They/Them/Their'
        }

        console.log(`Post: ${volunteerPronouns} -  ${typeof volunteerPronouns}`);

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
            subject: `Thank you - Sexpression:${branchName} 💖`,
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
}