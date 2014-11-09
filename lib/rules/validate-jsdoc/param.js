
module.exports = validateParamTag;
module.exports.tags = ['param'];
module.exports.scopes = ['function'];
module.exports.options = {
    checkParamNames: {allowedValues: [true]},
    requireParamTypes: {allowedValues: [true]},
    checkRedundantParams: {allowedValues: [true]}
};

/**
 * validator for @param
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {DocTag} tag
 * @param {Function} err
 */
function validateParamTag(node, tag, err) {
    node.jsdoc.paramIndex = node.jsdoc.paramIndex || 0;
    var options = this._options;

    // checking validity
    if (!tag.type || !tag.name) {
        return err('Invalid JsDoc @param');
    }

    var jsDocOptional = tag.optional || tag.type.optional;

    // checking existance
    if (options.requireParamTypes && !tag.type) {
        return err('Missing JsDoc @param type');
    }

    // skip if there is dot in param name (object's inner param)
    if (tag.name.indexOf('.') !== -1) {
        return;
    }

    // checking redundant
    var param = node.params[node.jsdoc.paramIndex];
    if (options.checkRedundantParams && !jsDocOptional && !param) {
        return err('Redundant JsDoc @param');
    }

    // checking name
    if (options.checkParamNames && tag.name !== param.name) {
        return err('Invalid JsDoc @param argument name');
    }

    node.jsdoc.paramIndex++;
}
