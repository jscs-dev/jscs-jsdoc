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

    // outOfOrder
    var paramsByName = {};
    node.params.forEach(function(param) {
        paramsByName[param.name] = param;
    });
    var paramTagsByName = {};
    node.jsdoc.iterateByType(['param', 'arg', 'argument'], function(tag) {
        if (tag.name && tag.name.value) {
            paramTagsByName[tag.name.value] = tag;
        }
    });
    var outOfOrder = {};
    var skipped = 0;

    node.jsdoc.iterateByType(['param', 'arg', 'argument'],
        /**
         * tag checker
         * @param {DocType} tag
         * @param {number} i index
         */
        function(tag, i) {
            // checking validity
            if (!tag.name) {
                return err('missing param name', tag.loc);
            }

            var param = node.params[i - skipped];
            if (!param) {
                // skip if no param
                return;
            }

            if (tag.name.value.indexOf('.') !== -1) {
                skipped++;
                return;
            }

            // checking name
            var msg;
            if (tag.name.value !== param.name && !outOfOrder[tag.name.value]) {
                if (paramsByName[tag.name.value] && paramTagsByName[param.name]) {
                    outOfOrder[tag.name.value] = outOfOrder[param.name] = true;
                    msg = 'parameters ' + tag.name.value + ' and ' + param.name + ' are out of order';
                } else if (paramsByName[tag.name.value]) {
                    outOfOrder[tag.name.value] = true;
                    msg = 'parameter ' + tag.name.value + ' is out of order';
                } else {
                    msg = 'expected ' + param.name + ' but got ' + tag.name.value;
                }

                return err(msg, tag.name.loc || node.jsdoc.loc.start);
            }
        });
}
