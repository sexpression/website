const { Directus } = require('@directus/sdk');
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;
const axios = require('axios').default;
const url = "https://sexpression.directus.app";
const directus = new Directus(url);

async function getRecord(collection, id, gummy = false) {
    if (gummy === false) {
        gummy = "id"
    }

    query = {}
    query.filter = {};
    query.filter[gummy] = { "_eq": id };

    let response = await directus.items(collection).readByQuery(query);
    return response.data[0];
}

async function postRecord(collection, record) {
    await directus.auth.static(DIRECTUS_TOKEN);
    let chosenCollection = await directus.items(collection);

    let response = await chosenCollection.createOne(record);

    return response.id;
}

async function postNotification(url, data) {
    try {
        let response = await axios.post(`${url}/notifications`, data);
        console.log(response);
        return {
            statusCode: 200,
            body: "Complete!",
        };
    } catch(e) {
        console.log(e)
    }
}


exports.getRecord = getRecord;
exports.postRecord = postRecord;
exports.postNotification = postNotification;