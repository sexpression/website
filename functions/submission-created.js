const client = require('@sendgrid/mail');

const {
    SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL,
} = process.env;

exports.handler = async function (event, context, callback) {
    const payload = JSON.parse(event.body).payload.data;

    console.log('dog');

    const volunteerEmail = payload.email;
    const volunteerName = payload.fullname;
    const volunteerPronouns = payload.genderpronouns;

    if (volunteerPronouns == null) {
        volunteerPronouns = 'They/Them/Their'
    }

    const branchArr = payload.branch.split(",");
    const branchEmail = branchArr[0];
    const branchName = branchArr[1];

    console.log('cat');

    client.setApiKey(SENDGRID_API_KEY);

    console.log('mouse');

    const msgToBranch = {
        to: `${branchEmail}`,
        from: SENDGRID_FROM_EMAIL,
        subject: "You have a new volunteer!",
        text: `${volunteerName} wants to join your branch.`,
        html: `<div>🌈</div>`,
    };
    console.log('fish');

    // const msgToVolunteer = {
    //     to: `${volunteerEmail}`,
    //     from: SENDGRID_FROM_EMAIL,
    //     subject: `Thanks for reaching out to Sexpression:${branchName}`,
    //     text: `The branch committee memeber of Sexpression:${branchName} will reach out to you shortly.`,
    // };

    try {
        console.log('tiger');
       let response1 = await client.send(msgToBranch);
       console.log('frog');
    //    let response2 = await client.send(msgToVolunteer);
        console.log(response1);
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: response1}),
        };
    } catch (err) {
        return {
            statusCode: err.code,
            body: JSON.stringify({ msg: err.message }),
        };
    }

};