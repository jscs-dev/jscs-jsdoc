module.exports = checkThrows;
module.exports.tags = ['throws', 'exception'];
module.exports.scopes = ['function'];
module.exports.options = {
    checkThrows: {allowedValues: [true]}
};

/**
 * Checking throw types
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {DocTag} tag
 * @param {Function} err
 */
function checkThrows(node, tag, err) {
    // try to check returns types
    if (!tag.type || !tag.type.valid) {
        return;
    }

    var _throws = 0;
    this._iterate(function(_node) {
        if (_node.type === 'ThrowStatement') {
            _throws += 1;
        }
    }, node);

    var throwsStatements = this._getThrowStatementsForNode(node);
    throwsStatements.forEach(function(argument) {
        if (!tag.type.match(argument)) {
            err('Wrong returns value', argument.loc.start);
        }
    });
}
