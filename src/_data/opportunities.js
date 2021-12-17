const fetch = require("node-fetch");

const domain = "https://sexpression.org.uk";
const path = "/.netlify/functions/opportunities";

const url = new URL(path, domain);

module.exports = async function () {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    const result = jsonResponse.records;

    // result.forEach(element => {
    //     let dark = element.fields.Description;
    //     dark.split("\n").forEach((line) => {    
    //         console.log(line);
    //     });
    // });

    return result;
};