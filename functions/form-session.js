const client = require('@sendgrid/mail');

const {
    SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL,
} = process.env;

exports.handler = async function (event, context, callback) {
    const payload = JSON.parse(event.body).payload.data;
    const referrer = new URL(payload.referrer);
    if (referrer.pathname === "/contact/session/") {

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
            text: `${institutionName} (${institutionType} is requesting a session for ${sessionWeek}. ${sessionSubjects}. ${sessionAgeRange}. ${sessionMessage}`,
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