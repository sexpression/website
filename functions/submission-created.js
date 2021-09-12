const sgMail = require('@sendgrid/mail');

exports.handler = async event => {
    console.log("hello world");
    console.log(process.env.SENDGRID_API_KEY);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const payload = JSON.parse(event.body).payload.data;
    const referrer = new URL(payload.referrer);
    if (referrer.pathname === "/contact/join/") {

        try {
            const volunteerEmail = payload.email;
            const volunteerName = payload.fullname;
            const volunteerPronouns = payload.genderpronouns;

            if (volunteerPronouns == null) {
                volunteerPronouns = 'They/Them/Their'
            }
            const branchArr = payload.branch.split(",");
            const branchEmail = branchArr[0];
            const branchName = branchArr[1];

            const sender = "website@sexpression.org.uk"

            const msgToBranch = {
                to: `${branchEmail}`,
                from: `${sender}`,
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
                from: `${sender}`,
                subject: `Thanks for reaching out to Sexpression:${branchName}`,
                text: `The branch committee memeber of Sexpression:${branchName} will reach out to you shortly.`,
            };

            // let response = await sgMail.send(msg);
            // console.log("Email sent");
            // return response;

            sgMail.send(msgToBranch).then(() => {
                console.log('Branch email sent');
            }).catch((error) => {
                console.error(error);
            })

            sgMail.send(msgToVolunteer).then(() => {
                console.log('Volunteer Email sent');
            }).catch((error) => {
                console.error(error);
            })

            return {
                statusCode: 200,
                body: JSON.stringify({
                  message: 'Emails sent'
                })
              };
            
        } catch (error) {
            console.error(error);

            if (error.response) {
                console.error(error.response.body)
            }
        }
    };
};