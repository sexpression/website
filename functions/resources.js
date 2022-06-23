const { DIRECTUS_URL } = process.env;
const { Directus } = require('@directus/sdk');
const directus = new Directus(`https://${DIRECTUS_URL}`);

const table = 'resources';
// ?resources=all
// ?tags=all

exports.handler = async function(event, context) {
    try {

        let tagsStatus = event.queryStringParameters.tags;

        if (tagsStatus) {
            const data = await directus.items(table, "fields");
            console.log("tags!");
            console.log("successful!");

            return {
                statusCode: 200,
                message: "Successful",
                body: JSON.stringify({
                    items: data.data,
                    total: data.meta.total_count,
                })
            }
        } else {
            const data = await directus.items(table).readByQuery({ meta: 'total_count', sort: "name" });
            console.log("no tags!");
            console.log("successful!");

            return {
                statusCode: 200,
                message: "Successful",
                body: JSON.stringify({
                    items: data.data,
                    total: data.meta.total_count,
                })
            }
        }

    } catch (err) {
        return {
            statusCode: 500,
            message: "Failed",
            body: JSON.stringify({ msg: err.message })
        }
    }
}