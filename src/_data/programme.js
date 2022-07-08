const MarkdownIt = require("markdown-it");
md = new MarkdownIt();
const moment = require('moment');
const { Directus } = require('@directus/sdk');
const slugify = require('slugify');
const directus = new Directus(`https://sexpression.directus.app`);

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

function sluggy(data) {
    for (let element in data) {
        let slug = slugify(data[element].title, { lower: true });
        data[element].slug = slug;
    }

    return data;
}

function prettyMarkdown(data) {
    for (let element in data) {
        data[element].body = md.render(data[element].body);
    };

    return data;
}

module.exports = async function() {
    try {
        let table = 'programme';
        let filter = { "status": { "_eq": "published" } };
        let sort = "sort";
        let meta = 'total_count';

        let response = await directus.items(table).readByQuery({ meta: meta, sort: sort, filter: filter });

        response.data = prettyDate(response.data)
        response.data = sluggy(response.data);
        response.data = prettyMarkdown(response.data)

        return response.data
    } catch (err) {
        console.log(err)
    }
};