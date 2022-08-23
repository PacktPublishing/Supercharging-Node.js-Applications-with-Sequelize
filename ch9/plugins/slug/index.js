const slug = require("github-slugger").slug;

class SlugPlugin {
    use(model, options) {
        const DEFAULTS = {
            column: 'slug',
            source: ['name'],
            transaction: null,
        };

        options = {...DEFAULTS, ...options};

        // concat the fields for the slug
        function generateSlug(instance, fields) {
            return slug(fields.map((field) => instance[field]).join(' '));
        }

        async function findSlug(slug) {
            return await model.findOne({
                where: {
                    [options.column]: slug
                },
                transaction: options.transaction || null,
            });
        }

        // do not use in a production environment
        async function incrementSuffix(slugVal) {
            let found = false;
            let cnt = 1;
            let suffix = "";

            while (!found) {
                suffix = `${slugVal}-${cnt}`;
                found = await findSlug(suffix);
                cnt++;
            }

            return suffix;
        }

        async function onSaveOrUpdate(instance) {
            const changed = options.source.some(function (field) {
                return instance.changed(field);
            });

            if (!changed) {
                return instance;
            }

            let curVal = instance[options.column];
            let newVal = generateSlug(instance, options.source);

            if (curVal !== null && curVal == newVal) {
                return instance;
            }

            let slugExist = await findSlug(newVal);

            if (!slugExist) {
                instance[options.column] = newVal;
                return instance;
            }

            newVal = await incrementSuffix(newVal);
            instance[options.column] = newVal;

            return instance;
        }

        // use the lifecycle events for invoking the onSaveOrUpdate event
        model.addHook('beforeCreate', onSaveOrUpdate);
        model.addHook('beforeUpdate', onSaveOrUpdate);
    }
}

const instance = new SlugPlugin();

module.exports = instance;
module.exports.SlugPlugin = instance;
