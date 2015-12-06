module.exports = validateCheckParamNames;
module.exports.scopes = ['function'];
module.exports.options = {
    checkRedundantParams: {allowedValues: [true]}
};

/**
 * Validator for check-param-names
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function validateCheckParamNames(node, err) {
    if (!node.jsdoc || !node.jsdoc.valid) {
        return;
    }

    var skipped = 0;

    node.jsdoc.iterateByType(['param', 'arg', 'argument'],
        /**
         * Tag checker
         *
         * @param {DocType} tag
         * @param {number} i index
         */
        function(tag, i) {
            // skip if there is dot in param name (object's inner param)
            if (tag.name && tag.name.value.indexOf('.') !== -1) {
                skipped++;
                return;
            }
console.log(tag.type);
            var _optional = tag.optional || tag.type.type === '' || tag.type.type === 'VARIADIC';
            if (_optional) {
                skipped++;
                return;
            }

            var param = node.params[i - skipped];

            // checking redundant
            if (!param) {
                return err('Found redundant ' +
                    (tag.name ? 'param "' + tag.name.value + '"' : 'unnamed param') +
                    ' statement', tag.loc);
            }
        });
}
