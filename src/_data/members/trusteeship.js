const fetch = require("node-fetch");

module.exports = async function () {
    const response = await fetch("https://sex2.tjsheppard.dev/api/members-trusteeship");
    const jsonResponse = await response.json();
    return jsonResponse.records;
};