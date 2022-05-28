const { schedule } = require('@netlify/functions');
const { HOOK_REBUILD_TOKEN } = process.env;

const handler = async function(event, context) {
    console.log("Received event:", event)
    fetch(`https://api.netlify.com/build_hooks/${HOOK_REBUILD_TOKEN}`, {
        method: 'POST'
    });

    return {
        statusCode: 200,
    };
};