const fetch = require("node-fetch");
const moment = require('moment');

const domain = "https://sexpression.org.uk";
const path = "/.netlify/functions/resources";

const url = new URL(path, domain);

module.exports = async function () {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    const results = jsonResponse.records;

    results.forEach(function (record, i) {
        let formattedDate = moment().format(record.fields["Last updated"]); 
        // const date = hdate.prettyPrint(record.fields.Las§tUpdated);
        // record.fields.Date = date;
        results[i].fields["Last updated"] = formattedDate;
    });

    return results;
};