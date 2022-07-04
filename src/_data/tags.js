const { Directus } = require('@directus/sdk');
const slugify = require('slugify');
const directus = new Directus(`https://sexpression.directus.app`);

function sluggy(data) {
    for (let element in data) {
        let slug = slugify(data[element].name, { lower: true });
        data[element].slug = slug;
    }

    return data;
}

module.exports = async function() {
    try {
        let table = 'tags';
        let filter = { "status": { "_eq": "published" } };
        let sort = "sort";
        let meta = 'total_count';

        let response = await directus.items(table).readByQuery({ meta: meta, sort: sort, filter: filter });

        response.data = sluggy(response.data);

        return response.data

    } catch (err) {
        console.log(err)
    }
};