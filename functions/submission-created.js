const sgMail = require('@sendgrid/mail');

exports.handler = async event => {
    const payload = JSON.parse(event.body).payload.data;
    const referrer = new URL(payload.referrer);
    if (referrer.pathname === "/contact/join/") {
        try {
            const fullName = payload.fullname;
            const pronouns = payload.pronouns;
            const email = payload.email;
            const branchArr = payload.branch[0].split(",");
            const branchEmail = branchArr[0];
            const branchName = branchArr[1];

            const sender = "sheppardnexus@gmail.com"

            const msg = {
                to: `${branchEmail}`,
                from: sender,
                subject: "You have a new volunteer!",
                text: `${fullName} wants to join your branch.`,
                html: `
                <div>
                    <p><strong><i>${fullName}</i></strong> (${pronouns})</p>
                    <p><a href="mailto:${email}">${email}</a></p>
                </div>
                <div>
                    <p><i>${fullName}</i> wants to join <i>Sexpression:${branchName}</i>. Introduce yourself by sending them an email. Invite them to your social media and make sure they feel welcomed! 🌈</p>
                </div>`,
            };

            console.log(JSON.stringify({ msg: msg }));

            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            let response = await sgMail.send(msg);
            return response;
        } catch (error) {
            console.error(error);

            if (error.response) {
                console.error(error.response.body)
            }
        }
    };
};