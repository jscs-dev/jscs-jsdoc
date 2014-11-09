
var esprimaHelpers = require('../../esprima-helpers');

module.exports = validateReturnsTag;
module.exports.tags = ['return', 'returns'];
module.exports.scopes = ['function'];
module.exports.options = {
    checkReturnTypes: {
        allowedValues: [true]
    },
    requireReturnTypes: {
        allowedValues: [true]
    },
    checkRedundantReturns: {
        allowedValues: [true]
    }
};

/**
 * validator for @return/@returns
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {DocTag} tag
 * @param {Function} err
 */
function validateReturnsTag(node, tag, err) {
    var options = this._options;

    // checking validity
    if (!tag.type) {
        return err('Invalid @returns statement');
    }

    // checking existance
    if (options.requireReturnTypes && !tag.type) {
        err('Missing type in @returns statement');
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
        err('Redundant @returns statements');
    }

    // try to check returns types
    if (options.checkReturnTypes && tag.type.valid) {
        returnsArgumentStatements.forEach(function(argument) {
            if (!tag.type.match(argument)) {
                err('Wrong returns value', argument.loc.start);
            }
        });
    }
}
