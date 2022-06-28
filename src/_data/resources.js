const fetch = require("node-fetch");
const moment = require('moment');

const domain = "https://sexpression.org.uk";
const path = "/.netlify/functions/resources";

const url = new URL(path, domain);

module.exports = async function() {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    jsonResponse.items.forEach(element => {
        let stat;
        if (element.date_updated) {
            stat = element.date_updated;
        } else {
            stat = element.date_created;
        }
        let datetime = moment(stat).format("MMMM Do YYYY, h:mma");
        element.date_updated = datetime;
    });
    return jsonResponse.items;
};