const { Directus } = require('@directus/sdk');
const directus = new Directus(`https://sexpression.directus.app`);

module.exports = async function() {
    try {
        let table = 'home';
        let response = await directus.items(table).readByQuery();

        return response.data

    } catch (err) {
        console.log(err)
    }
};