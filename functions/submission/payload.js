const directusUtil = require('./directus');
const slugify = require('slugify')

function clean(payload) {
    let form = {
        id: payload.id
    }
    delete payload.user_agent;
    delete payload.referrer;
    delete payload.ip;
    delete payload.id;
    return { payload, form }
};

function format(payload) {
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
};

async function newPlusName(payload) {
    let payloadMod = { ...payload };
    let branchItem = false;
    if (payload.Branch) {
        branchItem = await directusUtil.getRecord('branches', payload.Branch);
        payloadMod.Branch = branchItem.name;
    }
    return { payloadMod, branchItem };
};

exports.clean = clean;
exports.format = format;
exports.newPlusName = newPlusName;