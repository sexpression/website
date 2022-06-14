const fetch = require("node-fetch");

const domain = "https://sexpression.org.uk";
const path = "/.netlify/functions/branches?country=scotland";

const url = new URL(path, domain);

module.exports = async function() {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    return jsonResponse.items;
};