const { DIRECTUS_URL } = process.env;
const { Directus } = require('@directus/sdk');
const directus = new Directus(`https://${DIRECTUS_URL}`);
const table = 'partners';

exports.handler = async function(event, context) {

    try {
        const data = await directus.items(table).readByQuery({ meta: 'total_count', sort: "name", filter: { "status": { "_eq": "published" } } });

        return {
            statusCode: 200,
            message: "Successful",
            body: JSON.stringify({
                items: data.data,
                total: data.meta.total_count,
            })
        }

    } catch (err) {
        return {
            statusCode: 500,
            message: "Failed",
            body: JSON.stringify({ msg: err.message })
        }
    }
}