const fetch = require("node-fetch");

const { URL } = process.env;

module.exports = async function () {
    const response = await fetch(`${URL}/api/branches-northern_ireland`);
    const jsonResponse = await response.json();
    return jsonResponse.records;
};