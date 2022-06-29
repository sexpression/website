const moment = require('moment');
const { Directus } = require('@directus/sdk');

const { DIRECTUS_URL } = process.env;
const directus = new Directus(`https://${DIRECTUS_URL}`);

function prettyDate(data) {
    for (let element in data) {
        let stat;
        if (data[element].date_updated) {
            stat = data[element].date_updated;
        } else {
            stat = data[element].date_created;
        }
        let datetime = moment(stat).format("MMMM Do YYYY, h:mma");
        data[element].date_updated = datetime;
    };

    return data;
}

function prettyFile(data) {
    for (let element in data) {
        let mime = data[element].file.type;
        let file = mime.split("/");
        data[element].file.type = file[1].toUpperCase();
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
        response.data = prettyFile(response.data);

        return response.data

    } catch (err) {
        console.log(err)
    }
};