const { Directus } = require('@directus/sdk');
const directus = new Directus(`https://sexpression.directus.app`);
const table = 'universities';

module.exports = async function() {
    try {
        let fields = ['*', 'branches.country', 'university.name'];
        let filter = { "status": { "_eq": "published" }, "country": { "_eq": "Northern Ireland" } };
        let sort = "name";
        let meta = "total_count";

        let response = await directus.items(table).readByQuery({ meta: meta, fields: fields, filter: filter, sort: sort });

        return response.data;
    } catch (err) {
        console.log(err);
    }
};