const { AIRTABLE_BASE_ID, AIRTABLE_API_KEY } = process.env;
const airtableConfig = {
    endpointUrl: 'https://api.airtable.com',
    apiKey: `${AIRTABLE_API_KEY}`
};
const Airtable = require('airtable');
Airtable.configure(airtableConfig);
const base = Airtable.base(`${AIRTABLE_BASE_ID}`);
const downloadsBase = base('Downloads');

exports.handler = async function (event, context) {
    const data = JSON.parse(event.body);
    const response = await downloadsBase.create([data]);
    const jsonResponse = JSON.stringify({ 
        airtable_id: response[0].id,
        id: response[0].fields.id,
        created: response[0].fields.date 
    })
    return {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json' },
        body: jsonResponse
    };
};