const fetch = require("node-fetch");

const { DEPLOY_PRIME_URL } = process.env;

module.exports = async function () {
    const response = await fetch(`${DEPLOY_PRIME_URL}/api/resources`);
    const jsonResponse = await response.json();
    return jsonResponse.records;
};