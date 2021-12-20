const fetch = require("node-fetch");
const hdate = require('human-date');

const domain = "https://sexpression.org.uk";
const path = "/.netlify/functions/opportunities";

const url = new URL(path, domain);

module.exports = async function () {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    const results = jsonResponse.records;

    results.forEach(function (record, i) {
        console.log(record);
        const date = hdate.prettyPrint(record.fields.Deadline);
        record.fields.Date = date;
        results[i] = record;
        // dark.split("\n").forEach((line) => {    
        //     console.log(line);
        // });
    });

    return results;
};