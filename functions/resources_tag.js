const { DIRECTUS_URL } = process.env;
// const { Directus } = require('@directus/sdk');
// const directus = new Directus(`https://${DIRECTUS_URL}`);

// const table = 'resources';
// const filter = { "status": { "_eq": "published" } };

const fetch = require('node-fetch')


exports.handler = async function(event, context) {
    let response;
    let url = `https://${DIRECTUS_URL}/fields/resources/Tag`;
    console.log(url)
    try {
        response = await fetch(url);
        // handle response
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            body: JSON.stringify({
                error: err.message
            })
        }
    }
    console.log(response)
        // response.meta.options.choice;

    return {
        statusCode: 200,
        body: JSON.stringify({
            items: response
        })
    }
}