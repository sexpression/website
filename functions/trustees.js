const { Directus } = require('@directus/sdk');
const directus = new Directus('https://zq5bmezp.directus.app');

const table = 'trustees';
// const fields = ['*', 'university.country', 'university.name'];

exports.handler = async function(event, context) {
    try {
        const data = await directus.items(table).readByQuery({ meta: 'total_count' });

        //fields('university.name')

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