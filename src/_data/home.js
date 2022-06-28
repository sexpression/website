const { Directus } = require('@directus/sdk');

const { DIRECTUS_URL } = process.env;
const directus = new Directus(`https://${DIRECTUS_URL}`);

module.exports = async function() {
    try {
        let table = 'home';

        let response = await directus.items(table).readByQuery();

        return response.data

    } catch (err) {
        console.log(err)
    }
};