const { Directus } = require('@directus/sdk');
const directus = new Directus(`https://sexpression.directus.app`);

module.exports = async function() {
    try {
        let table = 'partners';
        let filter = { "status": { "_eq": "published" } };
        let sort = "name";
        let meta = 'total_count';

        let response = await directus.items(table).readByQuery({ meta: meta, sort: sort, filter: filter });

        return response.data

    } catch (err) {
        console.log(err)
    }
};