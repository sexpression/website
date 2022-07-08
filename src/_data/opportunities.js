const MarkdownIt = require("markdown-it");
md = new MarkdownIt();
const moment = require('moment');
const { Directus } = require('@directus/sdk');
const directus = new Directus(`https://sexpression.directus.app`);

function prettyMarkdown(data) {
    for (let element in data) {
        data[element].body = md.render(data[element].body);
    };

    return data;
}

function prettyDeadline(data) {
    for (let element in data) {
        let stat = element.deadline;
        let deadline = moment(stat).format("MMMM Do YYYY, h:mma");
        data[element].deadline = deadline;
    };

    return data;
}

module.exports = async function() {
    try {
        let table = 'opportunities';
        let filter = { "status": { "_eq": "published" } };
        let sort = "title";
        let meta = 'total_count';

        let response = await directus.items(table).readByQuery({ meta: meta, sort: sort, filter: filter });
        response.data = prettyDeadline(response.data)
        response.data = prettyMarkdown(response.data);
        return response.data

    } catch (err) {
        console.log(err)
    }
};