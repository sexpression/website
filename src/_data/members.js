const { Directus } = require('@directus/sdk');

const { DIRECTUS_URL } = process.env;
const directus = new Directus(`https://${DIRECTUS_URL}`);

module.exports = async function() {
    try {
        let table = 'members';
        let filter = { "status": { "_eq": "published" } };
        let sort = "sort";
        let meta = 'total_count';

        let response = await directus.items(table).readByQuery({ meta: meta, sort: sort, filter: filter });

        return response.data

    } catch (err) {
        console.log(err)
    }
};