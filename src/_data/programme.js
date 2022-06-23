const fetch = require("node-fetch");
const markdown = require("markdown").markdown;
const moment = require('moment');
const domain = "https://sexpression.org.uk";
const path = "/.netlify/functions/programme";
const url = new URL(path, domain);

module.exports = async function() {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    jsonResponse.items.forEach(element => {
        let datetime = moment(element.date_updated).format("MMMM Do YYYY, h:mma");
        element.date_updated = datetime;
        element.body = markdown.toHTML(element.body);
    });

    return jsonResponse.items;
};