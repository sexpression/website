const fetch = require("node-fetch");
const { DEPLOY_PRIME_URL, NETLIFY } = process.env;
const builder = "branches";

module.exports = async function() {
    const url = `https://dev.sexpression.org.uk/api/${builder}`
    if (NETLIFY) {
        console.log('here')
        url = `${DEPLOY_PRIME_URL}/api/${builder}`;
        console.log('here')
    }
    const response = await fetch(url);
    const jsonResponse = await response.json();
    return jsonResponse.items;
};