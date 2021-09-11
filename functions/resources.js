// const { AIRTABLE_BASE_ID, AIRTABLE_API_KEY } = process.env;
// const airtableConfig = {
//     endpointUrl: 'https://api.airtable.com',
//     apiKey: `${AIRTABLE_API_KEY}`
// };
// const Airtable = require('airtable');
// const fetch = require('node-fetch');
// const fs = require('fs');
// Airtable.configure(airtableConfig);
// const base = Airtable.base(`${AIRTABLE_BASE_ID}`);
// const resourceBase = base('Resources');
// exports.handler = async function (event, context) {
//     if (Object.keys(event.queryStringParameters).length !== 0) {
//         // const query = event.queryStringParameters;
//         // const key = Object.keys(query)
//         // const stringy = `{${decodeURIComponent(key[0])}} = '${decodeURIComponent(query[key[0]])}'`;
//         // const requestConfig = {
//         //     view: "all resources",
//         //     filterByFormula: stringy,
//         //     sort: [{ field: "name", direction: "asc" }]
//         // };
//         // const response = await resourceBase.select(requestConfig).firstPage();

//         // response.forEach(async element => {
//         //     const url = element.fields.resource[0].url;
//         //     const image = await fetch(url);
//         //     fs.writeFile(`${encodeURIComponent(element.fields.name)}.jpg`, image, function (err) {
//         //         if (err) return console.log(err);
//         //         console.log(`${encodeURIComponent(element.fields.name)}.jpg`);
//         //       });
//         // });

//         // return {
//         //     statusCode: 200,
//         //     headers: { 'Content-Type': 'application/json' },
//         //     body: JSON.stringify({ response })
//         // };

//     } else {
//         // all or one
//         const path = event.path.replace(/\/$/, "");
//         const pathArray = path.split('/');
//         const lastPathItem = pathArray[pathArray.length - 1];
//         const lowerCaseLastPathItem = lastPathItem.toLowerCase();

//         // all
//         if (lowerCaseLastPathItem === "Resources") {
//             const requestConfig = {
//                 view: "All resources",
//                 filterByFormula: "NOT({Live} = '')",
//                 sort: [{ field: "Name", direction: "asc" }]
//             };
//             const records = await resourceBase.select(requestConfig).firstPage();
//             return {
//                 statusCode: 200,
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ records })
//             };
//             // one
//         } else {
//             const records = await resourceBase.find(lastPathItem);

//             return {
//                 statusCode: 200,
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ records })
//             };
//         };
//     };
// };

// now we need to axios all these urls and get the file
// once all files got, but them in a folder, zip it and return it.

// trigger a post request when download is clicked
// trigger a post request when multiple or all are selected for download

// /api/getResources                                            all - this is only used on site build
// /api/getResources/rec0HzfANnN9FjiLA                          single - record download ✅
// /api/getResources?id=rec0HzfANnN9FjiLA                       single - record download ✅
// /api/getResources?id=rec0HzfANnN9FjiLA&id=rec0HzfANnN9FjiLA  multiple - record download ✅
// /api/getResources?type=dictionary                            all of type - record download ✅


const Airtable = require('airtable');
const {AIRTABLE_BASE_ID, AIRTABLE_API_KEY} = process.env;
const base = new Airtable({apiKey: `${AIRTABLE_API_KEY}`}).base(`${AIRTABLE_BASE_ID}`);

const baseName = "Resources";
const baseView = "All resources";

exports.handler = function (event, context, callback) {
    try {
        base(baseName).select({
            view: baseView,
            filterByFormula: "NOT({Live} = '')",
            sort: [{field: "Name", direction: "asc"}]
        }).firstPage(function(err, records) {
            if (err) { console.error(err); return; }

            callback(null, {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ records })
            });
        });
    } catch (err) {
        console.log(err) // output to netlify function log
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
        }
    }
}