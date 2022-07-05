const MarkdownIt = require("markdown-it");
md = new MarkdownIt();
const { Directus } = require('@directus/sdk');
const directus = new Directus(`https://sexpression.directus.app`);


function prettyMarkdown(data) {
    for (let element in data) {
        data[element].body = md.render(data[element].body);
    };

    return data;
}

module.exports = async function() {
    try {
        let table = 'forms';
        let filter = { "status": { "_eq": "published" } };
        let fields = ['*', 'recipient.members_id'];
        let sort = "sort";
        let meta = 'total_count';

        let response = await directus.items(table).readByQuery({ meta: meta, sort: sort, fields: fields, filter: filter });
        response.data = prettyMarkdown(response.data);
        return response.data

    } catch (err) {
        console.log(err)
    }
};