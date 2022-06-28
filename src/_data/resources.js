const moment = require('moment');
const { Directus } = require('@directus/sdk');

const { DIRECTUS_URL } = process.env;
const directus = new Directus(`https://${DIRECTUS_URL}`);

function prettyDate(data) {
    for (let element in data) {
        let stat;
        if (element.date_updated) {
            stat = element.date_updated;
        } else {
            stat = element.date_created;
        }
        let datetime = moment(stat).format("MMMM Do YYYY, h:mma");
        data[element].date_updated = datetime;
    };

    return data;
}

module.exports = async function() {
    try {
        let table = 'resources';
        let fields = ['file.type', 'file.id', '*'];
        let filter = { "status": { "_eq": "published" } };
        let sort = "name";
        let meta = 'total_count';

        let response = await directus.items(table).readByQuery({ meta: meta, sort: sort, filter: filter, fields: fields });
        response.data = prettyDate(response.data);

        return response.data

    } catch (err) {
        console.log(err)
    }
};