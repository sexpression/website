const { DIRECTUS_URL } = process.env;
const { Directus } = require('@directus/sdk');
const directus = new Directus(`https://${DIRECTUS_URL}`);

const table = 'partners';
const filter = { "status": { "_eq": "published" } };

exports.handler = async function(event, context) {

    try {
        const data = await directus.items(table).readByQuery({ meta: 'total_count' });

        console.log("successful!");

        return {
            statusCode: 200,
            message: "All good in the hood",
            body: JSON.stringify({
                items: data.data,
                total: data.meta.total_count,
            })
        }

    } catch (err) {
        console.log(JSON.stringify({ msg: err.message }));
        return {
            statusCode: 500,
            message: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
        }
    }
}