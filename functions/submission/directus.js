const { Directus } = require('@directus/sdk');
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;
const axios = require('axios').default;
const url = "https://sexpression.directus.app";
const directus = new Directus(url);

async function readRecord(collection, id, filterIdentifier = false, status = false) {
    try {

        console.log("collection:", collection)

        if (filterIdentifier === false) {
            filterIdentifier = "id"
        }

        let query = {};
        let idddy = {}
        
        idddy[filterIdentifier] = { "_eq": id };

        if (!(status === false || status === undefined)) {
            query.filter = {"_and": []};
            query.filter._and.push(idddy);
            query.filter._and.push({"status": { "_eq": status }});
        } else {
            query.filter = idddy;
        }
        
        let response = await directus.items(collection).readByQuery(query);
        console.log("directus.readRecord", "Success")
        return response.data[0];
    } catch (e) {
        console.error("directus.readRecord:",e);
    }
}

async function createRecord(collection, record) {
    try {
        await directus.auth.static(DIRECTUS_TOKEN);
        let chosenCollection = await directus.items(collection);

        let response = await chosenCollection.createOne(record);
        console.log("directus.createRecord", "Success")
        return response.id;
    } catch (e) {
        console.error("directus.createRecor:",e);
    }
}

async function createNotifications(users, collection, id) {
    try {
        let notifications = [];
        users.forEach((v, i) => {
            let item = {
                "recipient": v,
                "subject": "You have a new response",
                "collection": collection,
                "message": `\n<a href=\"${url}/admin/content/${collection}/${id}\">View response.</a>\n`,
                "item": id
            }
            notifications.push(item);
        })

        let headersList = {
            "Authorization": `Bearer ${DIRECTUS_TOKEN}`,
            "Content-Type": "application/json"
        }

        let bodyContent = JSON.stringify(notifications);

        let reqOptions = {
            url: `${url}/notifications`,
            method: "POST",
            headers: headersList,
            data: bodyContent,
        }

        let response = await axios.request(reqOptions);

        console.log("directus.createNotifications", { statusCode: response.status })
    } catch (e) {
        console.error("directus.createNotifications",e);
    }
}

exports.readRecord = readRecord;
exports.createRecord = createRecord;
exports.createNotifications = createNotifications;