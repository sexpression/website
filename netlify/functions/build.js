const { schedule } = require('@netlify/functions');
const axios = require('axios').default;

const { HOOK_REBUILD_TOKEN } = process.env;

const handler = async function(event, context) {
    console.log("Received event:", event)

    let reqOptions = {
        url: `https://api.netlify.com/build_hooks/${HOOK_REBUILD_TOKEN}`,
        method: "POST"
    }

    let response = await axios.request(reqOptions);

    return {
        statusCode: response.status,
    };
};

module.exports.handler = schedule("@daily", handler);