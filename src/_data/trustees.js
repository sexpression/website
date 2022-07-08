const { Directus } = require('@directus/sdk');
const directus = new Directus(`https://sexpression.directus.app`);

module.exports = async function() {
    try {
        let table = 'members';
        let filter = {
            "_and": [{
                    "status": {
                        "_eq": "published"
                    }
                },
                {
                    "role": {
                        "status": {
                            "_eq": "published"
                        }
                    }
                },
                {
                    "role": {
                        "teams": {
                            "_eq": "Trustees"
                        }
                    }
                }
            ]
        };
        let fields = ['*', 'role.*', 'branch.*'];
        let sort = "sort";
        let meta = 'total_count';

        let response = await directus.items(table).readByQuery({ meta: meta, sort: sort, filter: filter, fields: fields });

        return response.data

    } catch (err) {
        console.log(err);
    }
};