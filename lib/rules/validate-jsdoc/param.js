
var jsDocHelpers = require('../../jsdoc-helpers');

module.exports = jsDocHelpers.tagValidator(validateParamLine);

module.exports.options = {
    checkParamNames: {
        allowedValues: [true]
    },
    requireParamTypes: {
        allowedValues: [true]
    },
    checkRedundantParams: {
        allowedValues: [true]
    },
    checkTypes: {
        allowedValues: [true]
    }
};

/**
 * validator for @param
 * @param {{type: 'FunctionDeclaration'}|{type: 'FunctionExpression'}} node
 * @param {JSDocTag} tag
 * @param {Function} err
 */
function validateParamLine(node, tag, err) {
    node.jsDoc.paramIndex = node.jsDoc.paramIndex || 0;

    var line = tag.value;
    var options = this._options;
    if (line.indexOf('@param') !== 0) {
        return;
    }

    // checking validity
    var match = line.match(/^@param\s+(?:{(.+?)})?\s*(\[)?([a-zA-Z0-9_\.\$]+)/);
    if (!match) {
        return err('Invalid JsDoc @param');
    }

    var jsDocType = match[1];
    var jsDocName = match[3];
    var jsDocOptional = match[2] === '[';

    // checking existance
    if (options.requireParamTypes && !jsDocType) {
        return err('Missing JsDoc @param type');
    }

    var jsDocParsedType = jsDocHelpers.parse(jsDocType);
    if (options.checkTypes && jsDocParsedType.invalid) {
        return err('Invalid JsDoc type definition');
    }

    // skip if there is dot in param name (object's inner param)
    if (jsDocName.indexOf('.') !== -1) {
        return;
    }

    // checking redudant
    var param = node.params[node.jsDoc.paramIndex];
    if (options.checkRedundantParams && !jsDocOptional && !param) {
        return err('Redundant JsDoc @param');
    }

    // checking name
    if (options.checkParamNames && jsDocName !== param.name) {
        return err('Invalid JsDoc @param argument name');
    }

    node.jsDoc.paramIndex++;
}
