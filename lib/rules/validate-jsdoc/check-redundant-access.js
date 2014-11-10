module.exports = checkRedundantAccess;
module.exports.scopes = ['function'];

module.exports.options = {
    checkRedundantAccess: {allowedValues: [true]}
};

/**
 * validator for @access
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function checkRedundantAccess(node, err) {
    if (!node.jsdoc) {
        return;
    }

    var access;
    node.jsdoc.iterate(function(tag) {
        if (['private', 'protected', 'public', 'access'].indexOf(tag.id) === -1) {
            return;
        }

        if (access) {
            err('Multiple access definition', tag.loc);
            return;
        }

        if (tag.id === 'access' && !tag.name) {
            err('Invalid access definition', tag.loc);
        }

        access = tag.id === 'access' ? tag.name : tag.id || 'unspecified';
    });
}
