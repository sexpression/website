const Airtable = require('airtable');
const {AIRTABLE_BASE_ID, AIRTABLE_API_KEY} = process.env;
const base = new Airtable({apiKey: `${AIRTABLE_API_KEY}`}).base(`${AIRTABLE_BASE_ID}`);

const baseName = "Branches";
const baseView = "Wales";

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