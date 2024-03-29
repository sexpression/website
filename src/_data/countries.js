const axios = require('axios').default;

module.exports = async function() {
    try {

        let headersList = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)"
        }

        let reqOptions = {
            url: "https://sexpression.directus.app/fields/universities/country",
            method: "GET",
            headers: headersList,
        }

        let response = await axios.request(reqOptions);

        return response.data.data.meta.options.choices;
    } catch (err) {
        console.log(err)
    }
};