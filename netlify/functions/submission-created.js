const payloadUtil = require('./submission/payload');
const directusUtil = require('./submission/directus');
const emailUtil = require('./submission/email');

exports.handler = async function (event, context, callback) {
    try {

        // How does Directus work
        // add a user
        // give a user a appropriate role
        // They will be able to access the form content and form responses
        //

        ///////////////////////////////////////////////////////////////////////////////////

        // Open a branch
        // Email person a copy
        // Record added to Directus (email notification)

        // Request a session
        // Email person a copy
        // Email branch a copy
        // Record added to Directus (email notification)

        // Join a branch
        // Email person a copy
        // Email branch a copy
        // Record added to Directus (email notification)

        // Fundraise
        // Email person a copy
        // Record added to Directus (email notification)

        // Media Enquiry
        // Email person a copy
        // Record added to Directus (email notification)

        ///////////////////////////////////////////////////////////////////////////////////

        console.log("Clean form payload")
        let { payload, form } = payloadUtil.clean(JSON.parse(event.body).payload.data)

        console.log(payload);

        console.log("using id of form, find and replace form variable with the form record")
        form = await directusUtil.readRecord("forms", form.id);

        console.log("Replace Branch ID with Branch name")
        payload = await newby("Branch", "Branches", payload)

        console.log("Replace University ID with University name")
        console.log()
        payload = await newby("University", "Universities", payload, "archived")


        console.log("payload", payload)
        console.log("form", form)


        // Set branch email status to false then try send it. If successful then new value will be assigend
        if (typeof (payload["Branch"]) == "string" && payload[prop].length == 36) {
            payload.branch_email_sent = await emailUtil.send(payload, payload.Branch.name`New response ${form.title}`, form.title);


            payload.branch_email_sent = await fetch(
                `${process.env.URL}/.netlify/functions/emails/${form.slug}`,
                {
                    headers: {
                        "netlify-emails-secret": process.env.NETLIFY_EMAILS_SECRET,
                    },
                    method: "POST",
                    body: JSON.stringify({
                        from: "",
                        to: "",
                        subject: "",
                        parameters: {
                            full_name: "",
                            gender_pronouns: "",
                            email: "",
                            position_at_institution: "",
                            institution_name: "",
                            institution_type: "",
                            building_and_street: "",
                            town_or_city: "",
                            county: "",
                            postcode: "",
                            sexpressionuk_branches: "",
                            choose_a_week_for_the_session: "",
                            subjects: "",
                            age_range: "",
                            is_there_anything_youd_like_to_add: ""
                        },
                    }),
                }
            );

        }

        // Set sender email status to false then try send it. If successful then new value will be assigend
        // payload.sender_email_sent = await emailUtil.send(payload, payload.Email, `Your message '${form.title}'`, form.title, form.response);

        // Replace payload with a new formatted structure ready to be added to Directus
        payload = payloadUtil.format(payload);

        let responseId = await directusUtil.createRecord(form.collection, payload);

        // for each of the roles assigned to the form
        // get roles from form
        // get record 
        // create notification for the user, collection, responseid
        // form.roles.forEach(async (x, i) => {
        //     let forms_directus_roles = await directusUtil.readRecord("forms_directus_roles", x);
        //     let role = await directusUtil.readRecord("directus_roles", forms_directus_roles.directus_roles_id);
        //     directusUtil.createNotifications(role.users, form.collection, responseId);
        // });

        return {
            statusCode: 200,
            body: "DONE"
        }

    } catch (e) {
        console.error("submission", e);
    }
}

async function newby(prop, collection, payload, status = false) {
    try {
        if (typeof (payload[prop]) == "string" && payload[prop].length == 36) {
            console.log([{ collection: collection }, { id: payload[prop] }, { filterIdentifier: false }, { status: status }]);
            response = await directusUtil.readRecord(collection, payload[prop], false, status);
            // let response = await payloadUtil.replaceIdWithName(payload, prop, payload[prop], collection, status);
            payload[prop] = { id: response[prop].id, name: response[prop].name }
            return payload
        } else if (typeof (payload[prop]) == "string") {
            console.log(`It is an empty string mark it as other with no id`);
            payload[prop] = { id: "", name: "Other" }
            return payload
        } else if (payload[prop]) {
            console.log(`Not even a string - delete!`);
            delete payload[prop]
            return payload
        }
        console.log(`Not there`);
        return payload;
    } catch (err) {
        console.error(`'newby' function error`, [prop, collection, payload[prop], status])
    }
}