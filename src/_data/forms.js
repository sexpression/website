const { Directus } = require('@directus/sdk');

const { DIRECTUS_URL } = process.env;
const directus = new Directus(`https://${DIRECTUS_URL}`);

module.exports = async function() {
    try {
        let table = 'forms';
        let filter = { "status": { "_eq": "published" } };
        let fields = ['*', 'recipient.members_id'];
        let sort = "title";
        let meta = 'total_count';

        let response = await directus.items(table).readByQuery({ meta: meta, sort: sort, fields: fields, filter: filter });

        return response.data

    } catch (err) {
        console.log(err)
    }
};