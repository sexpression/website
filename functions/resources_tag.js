const Airtable = require('airtable');
const { AIRTABLE_BASE_ID, AIRTABLE_API_KEY } = process.env;
const base = new Airtable({ apiKey: `${AIRTABLE_API_KEY}` }).base(`${AIRTABLE_BASE_ID}`);

const baseName = "Resources";
const baseView = "All resources";
const baseField = "Tag";

exports.handler = function (event, context, callback) {
    try {
        base(baseName).select({
            view: baseView,
            fields: [baseField],
            sort: [{ field: baseField, direction: "asc" }]
        }).firstPage(function (err, records) {
            if (err) { console.error(err); return; }

            const obj = { records: [] };
            let last = "test";
            records.forEach(function (record) {
                let tag = record.fields.Tag;
                if (tag != last) {
                    let newbie = { name: tag };
                    last = tag;
                    obj.records.push(newbie);
                }
            });

            callback(null, {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
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