const fetch = require("node-fetch");
const markdown = require("markdown").markdown;

const domain = "https://sexpression.org.uk";
const path = "/.netlify/functions/opportunities";

const url = new URL(path, domain);

module.exports = async function() {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    jsonResponse.items.forEach(element => {
        element.body = markdown.toHTML(element.body)
    });
    return jsonResponse.items;
};