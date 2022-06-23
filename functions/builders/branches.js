const { DIRECTUS_URL } = process.env;
const { Directus } = require('@directus/sdk');
const directus = new Directus(`https://${DIRECTUS_URL}`);
const table = 'branches';
const { builder } = require("@netlify/functions")

async function handler(event, context) {
    try {
        let fields = ['*', 'branches.country', 'university.name'];
        let filter = { "status": { "_eq": "published" } };

        function queryFormatterCaps(string) {
            string.replace('-', / /g);
            let splitStr = string.toLowerCase().split(' ');
            for (let i = 0; i < splitStr.length; i++) {
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
            }
            return splitStr.join(' ');
        }

        function queryFormatterNoCaps(string) {
            string.replace('-', / /g);
            let splitStr = string.toLowerCase().split(' ');
            for (let i = 0; i < splitStr.length; i++) {
                splitStr[i] = splitStr[i].charAt(0) + splitStr[i].substring(1);
            }
            return splitStr.join(' ');
        }

        function updateFilterStatus(string) {
            filter.status = { "_eq": string };
        }

        function updateFilterCountry(string) {
            let country = {
                "university": {
                    "country": {
                        "_eq": string
                    }
                }
            }
            Object.assign(filter, country);
        }

        let queryStatus = event.queryStringParameters.status;
        let queryCountry = event.queryStringParameters.country;

        if (queryStatus) {
            updateFilterStatus(queryFormatterNoCaps(queryStatus));
        }

        if (queryCountry) {
            updateFilterCountry(queryFormatterCaps(queryCountry))
        }

        let data = await directus.items(table).readByQuery({ meta: 'total_count', fields: fields, filter: filter, sort: "name" });

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

exports.handler = builder(handler);