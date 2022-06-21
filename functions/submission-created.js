const client = require('@sendgrid/mail');

const {
    SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL,
} = process.env;

exports.handler = async function(event, context, callback) {
    const payload = JSON.parse(event.body).payload.data;
    const referrer = new URL(payload.referrer);

    if (referrer.pathname === "/form/join/") {

        const volunteerEmail = payload.email;
        const volunteerName = payload.fullname;
        let volunteerPronouns = payload.genderpronouns;

        if (volunteerPronouns == null | volunteerPronouns == "") {
            volunteerPronouns = 'They/Them/Their'
        }

        const branchArr = payload.branch.split(",");
        const branchEmail = branchArr[0];
        const branchName = branchArr[1];

        client.setApiKey(SENDGRID_API_KEY);

        const msgToBranch = {
            to: `${branchEmail}`,
            from: SENDGRID_FROM_EMAIL,
            subject: `🎉 New volunteer - ${volunteerName}`,
            text: `${volunteerName} (${volunteerPronouns}) wants to join your branch.`,
        };

        const msgToVolunteer = {
            to: `${volunteerEmail}`,
            from: SENDGRID_FROM_EMAIL,
            subject: `💖 Thank you - Sexpression:${branchName}`,
            text: `Sexpression:${branchName} will reach out to you shortly.`,
        };

        let response1 = await client.send(msgToBranch);
        let response2 = await client.send(msgToVolunteer);

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
    if (referrer.pathname === "/form/session/") {

        // teacher

        const teacherEmail = payload.email;
        const teacherName = payload.fullname;
        let teacherPronouns = payload.genderpronouns;

        if (teacherPronouns == null | teacherPronouns == "") {
            teacherPronouns = 'They/Them/Their'
        }

        const teacherPosition = payload.position;

        // institution

        const institutionName = payload.institutionName;
        const institutionType = payload.institutionType;

        // institution address

        const institutionBuildingStreet = payload.institutionBuildingStreet;
        const institutionTownCity = payload.institutionTownCity;
        const institutionCounty = payload.institutionCounty;
        const institutionCountry = payload.institutionCountry;
        const institutionPostcode = payload.institutionPostcode;

        // session

        const branchArr = payload.branch.split(",");
        const branchEmail = branchArr[0];
        const branchName = branchArr[1];
        const sessionWeek = payload.week;
        const sessionSubjects = payload.subjects;
        const sessionAgeRange = payload.agerange;
        const sessionMessage = payload.message;

        client.setApiKey(SENDGRID_API_KEY);

        const msgToBranch = {
            to: `${branchEmail}`,
            from: SENDGRID_FROM_EMAIL,
            subject: `📌 New session - ${institutionName} (${institutionType})`,
            html: `<div>
                <div>
                    <h1>Teacher</h1>
                    <p>${teacherName} (${teacherPronouns})</p>
                    <p>${teacherEmail}</p>
                    <p>${teacherPosition}</p>
                </div>
                <div>
                    <h1>Institution</h1>
                    <p>${institutionName}</p>
                    <p>${institutionType}</p>
                    <h2>Address</h2>
                    <p>${institutionBuildingStreet}, ${institutionTownCity}</p>
                    <p>${institutionCounty}</p>
                    <p>${institutionCountry}</p>
                    <p>${institutionPostcode}</p>
                </div>
                <div>
                    <h1>Session</h1>
                    <h2>Week of</h2>
                    <p>${sessionWeek}</p>
                    <h2>Subjects</h2>
                    <p>${sessionSubjects}</p>
                    <h2>Age range</h2>
                    <p>${sessionAgeRange}</p>
                </div>
                <div>
                    <h1>Message</h1>
                    <p>${sessionMessage}</p>
                </div>
            </div>`
        };

        const msgToTeacher = {
            to: `${teacherEmail}`,
            from: SENDGRID_FROM_EMAIL,
            subject: `👋 Thank you - Sexpression:${branchName}`,
            text: `Sexpression:${branchName} will reach out to you shortly about your session request.`,
        };

        let response1 = await client.send(msgToBranch);
        let response2 = await client.send(msgToTeacher);

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
}