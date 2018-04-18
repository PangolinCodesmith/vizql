const Sequelize = require('sequelize');
const { singularize } = require('inflection');

//using the .models method, traverses down to the attributes and stores all
//attribute names in an array along with the associated table

const convertSchemas = (schema) => {
    let schemas = [];
    let links = [];
    for (let modelKey in schema.models) {
        const model = schema.models[modelKey];
        let columnNames = [];
        for (let attribute in model.rawAttributes) {
            let dataType = model.rawAttributes[attribute]['type'].constructor.key;
            let relation = model.rawAttributes[attribute]['references'];
            if (relation) {
                if (!schema.models[relation.model]) {
                    links.push({ source: modelKey, target: singularize(relation.model), relationIndex: columnNames.length});
                } else {
                    links.push({ source: modelKey, target: relation.model, relationIndex: columnNames.length})
                }
            }
            columnNames.push({ content: attribute, type: dataType, relation });
        }

        schemas.push({
            name: modelKey,
            columns: columnNames,
        });
    }

    return { schemas, links };
}

module.exports = convertSchemas;