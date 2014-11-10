module.exports = validateCheckParamNames;
module.exports.scopes = ['function'];
module.exports.options = {
    checkParamNames: {allowedValues: [true]}
};

/**
 * validator for check-param-names
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function validateCheckParamNames(node, err) {
    if (!node.jsdoc) {
        return;
    }

    node.jsdoc.iterateByType(['param', 'arg', 'argument'],
        /**
         * tag checker
         * @param {DocType} tag
         * @param {Number} i index
         */
        function(tag, i) {
            var param = node.params[i];

            // checking validity
            if (!tag.name) {
                return err('missing param name', tag.loc);
            }

            // checking name
            if (tag.name.value !== param.name) {
                return err('expected ' + param.name + ' but got ' + tag.name.value,
                    tag.name.loc || node.jsdoc.loc.start);
            }
        });
}
