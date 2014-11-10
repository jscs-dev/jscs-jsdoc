module.exports = validateCheckParamNames;
module.exports.scopes = ['function'];
module.exports.options = {
    checkRedundantParams: {allowedValues: [true]}
};

/**
 * validator for check-param-names
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function validateCheckParamNames(node, err) {
    if (node.jsdoc) {
        node.jsdoc.iterateByType(['param', 'arg', 'argument'],
            /**
             * tag checker
             * @param {DocType} tag
             * @param {Number} i index
             */
            function(tag, i) {
                // skip if there is dot in param name (object's inner param)
                if (tag.name && tag.name.value.indexOf('.') !== -1) {
                    return;
                }

                var param = node.params[i];
                var _optional = tag.optional || (tag.type && tag.type.optional);

                // checking redundant
                if (!_optional && !param) {
                    return err('redundant param statement');
                }
            });
    }
}
