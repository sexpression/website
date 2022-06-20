const { DIRECTUS_URL } = process.env;
const { Directus } = require('@directus/sdk');
const directus = new Directus(`https://${DIRECTUS_URL}`);

const table = 'resources';
// ?resources=all
// ?tags=all

exports.handler = async function(event, context) {
    try {

        let tagsStatus = event.queryStringParameters.tags;

        console.log("here!");
        console.log(tagsStatus);

        if (tagsStatus) {
            const data = await directus.items(table, "fields");
            console.log("tags!");
            console.log("successful!");

            return {
                statusCode: 200,
                message: "All good in the hood",
                body: JSON.stringify({
                    items: data.data,
                    total: data.meta.total_count,
                })
            }
        } else {
            const data = await directus.items(table).readByQuery({ meta: 'total_count' });
            console.log("no tags!");
            console.log("successful!");

            return {
                statusCode: 200,
                message: "All good in the hood",
                body: JSON.stringify({
                    items: data.data,
                    total: data.meta.total_count,
                })
            }
        }

    } catch (err) {
        console.log(JSON.stringify({ msg: err.message }));
        return {
            statusCode: 500,
            message: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
        }
    }
}