const { DIRECTUS_URL } = process.env;
const { Directus } = require('@directus/sdk');
const directus = new Directus(`https://${DIRECTUS_URL}`);

const table = 'universities';
const fields = ['*', 'branches.country', 'university.name'];
const filter = { "status": { "_eq": "published" } };

function queryFormatter(string) {
    string.replace('-', / /g);
    let splitStr = string.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}

function updateFilterStatus(string) {
    filter.branch = { "_eq": queryStatus };
}

function updateFilterCountry(string) {
    let country = {
        "country": {
            "_eq": string
        }
    }
    Object.assign(filter, country);
}

exports.handler = async function(event, context) {

    let queryStatus = event.queryStringParameters.status;
    let queryCountry = event.queryStringParameters.country;

    if (queryStatus) {
        updateFilterStatus(queryFormatter(queryBranch));
    }

    if (queryCountry) {
        updateFilterCountry(queryFormatter(queryCountry))
    }

    console.log(filter);

    try {
        const data = await directus.items(table).readByQuery({ meta: 'total_count', fields: fields, filter: filter });

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