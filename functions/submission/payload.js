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
        console.error("payload.clean",e);
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
        console.error("payload.format",e);
    }
};

async function newPlusName(payload) {
    try {
        let payloadMod = { ...payload };
        let branchItem = false;
        if (payload.Branch) {
            branchItem = await directusUtil.readRecord('branches', payload.Branch);
            payloadMod.Branch = branchItem.name;
        }
        return { payloadMod, branchItem };
    } catch (e) {
        console.error("payload.newPlusName",e);
    }
};

exports.clean = clean;
exports.format = format;
exports.newPlusName = newPlusName;