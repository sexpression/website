const directusUtil = require('./directus');
const slugify = require('slugify')

function clean(payload) {
    try {
        let form = {
            id: payload.id
        }
        delete payload.user_agent;
        delete payload.referrer;
        delete payload.ip;
        delete payload.id;
        return { payload, form }
    } catch (e) {
        console.error("payload.clean", e);
    }
};

function format(payload) {
    try {
        let newbie = {};

        for (const [key, value] of Object.entries(payload)) {
            let newKey = slugify(key, {
                replacement: '_',
                lower: true,
                strict: true,
            })
            newbie[newKey] = value;
        }

        return newbie;
    } catch (e) {
        console.error("payload.format", e);
    }
};

async function replaceIdWithName(payload, key, value, collection, status) {
    try {
        let payloadMod = { ...payload }; 
        item = await directusUtil.readRecord(collection, value, false, status);
        payloadMod[key] = item.name;
        return { payloadMod };
    } catch (e) {
        console.error("payload.replaceIdWithName", e);
    }
}

exports.clean = clean;
exports.format = format;
exports.replaceIdWithName = replaceIdWithName;