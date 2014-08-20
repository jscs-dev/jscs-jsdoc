
var jsDocHelpers = require('../../jsdoc-helpers');
var esprimaHelpers = require('../../esprima-helpers');

module.exports = validateReturnsLine;
module.exports.coveredOptions = [
    'checkReturnTypes',
    'requireReturnTypes',
    'checkRedundantReturns',
    'checkTypes',
];

/**
 * validator for @return/@returns
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Number} line
 * @param {Function} err
 */
function validateReturnsLine(node, line, err) {
    var options = this._options;
    if (line.indexOf('@return') !== 0) {
        return;
    }

    // checking validity
    var match = line.match(/^@returns?\s+(?:{(.+?)})?/);
    if (!match) {
        return err('Invalid JsDoc @returns');
    }

    var jsDocType = match[1];

    // checking existance
    if (options.requireReturnTypes && !jsDocType) {
        err('Missing JsDoc @returns type');
    }

    var jsDocParsedType = jsDocHelpers.parse(jsDocType);
    if (options.checkTypes && jsDocParsedType.invalid) {
        return err('Invalid JsDoc type definition');
    }

    if (!options.checkRedundantReturns && !options.checkReturnTypes) {
        return;
    }

    var returnsArgumentStatements = [];
    esprimaHelpers.treeIterator.iterate(node, function(n/*, parentNode, parentCollection*/) {
        if (n && n.type === 'ReturnStatement' && n.argument) {
            if (node === esprimaHelpers.closestScopeNode(n)) {
                returnsArgumentStatements.push(n.argument);
            }
        }
    });

    // checking redundant
    if (options.checkRedundantReturns && !returnsArgumentStatements.length) {
        err('Redundant JsDoc @returns');
    }

    // try to check returns types
    if (options.checkReturnTypes && jsDocParsedType) {
        returnsArgumentStatements.forEach(function (argument) {
            if (!jsDocHelpers.match(jsDocParsedType, argument)) {
                err('Wrong returns value', argument.loc.start);
            }
        });
    }
}
