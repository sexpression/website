const fetch = require("node-fetch");

const domain = "https://sexpression.org.uk";
const path = "/.netlify/functions/branches?country=wales";

// Wales wales
// England england
// Scotland scotland
// Nothern Ireland nothern-ireland

const url = new URL(path, domain);

module.exports = async function() {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    return jsonResponse.items;
};