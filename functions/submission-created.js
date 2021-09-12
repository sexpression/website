const sgMail = require('@sendgrid/mail');
console.log("hello world");
console.log(SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async event => {
    const payload = JSON.parse(event.body).payload.data;
    const referrer = new URL(payload.referrer);
    if (referrer.pathname === "/contact/join/") {
        const branchArr = payload.branch[0].split(",");
        try {
            const volunteerEmail = payload.email;
            const volunteerName = payload.fullname;
            const volunteerPronouns = payload.pronouns;

            if (volunteerPronouns == null) {
                volunteerPronouns = 'They/Them/Their'
            }

            const branchEmail = branchArr[0];
            const branchName = branchArr[1];

            const sender = "website@sexpression.org.uk"

            const msg = {
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

            console.log(JSON.stringify({ msg: msg }));

            let response = await sgMail.send(msg);
            console.log("Email sent");
            return response;
        } catch (error) {
            console.error(error);

            if (error.response) {
                console.error(error.response.body)
            }
        }
    };
};