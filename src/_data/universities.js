const fetch = require("node-fetch");

const domain = "https://sexpression.org.uk";
const path = "/api/universities";

const url = new URL(path, domain);

module.exports = async function () {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    return jsonResponse.records;
};