const { Directus } = require('@directus/sdk');
const directus = new Directus(`https://sexpression.directus.app`);
const table = 'branches';

module.exports = async function() {

    try {
        let fields = ['*', 'university.country', 'university.name'];
        let filter = { "status": { "_eq": "published" } };
        let sort = "name";
        let meta = "total_count";

        let response = await directus.items(table).readByQuery({ meta: meta, fields: fields, filter: filter, sort: sort });

        return response.data;
    } catch (err) {
        console.log(err);
    }
};