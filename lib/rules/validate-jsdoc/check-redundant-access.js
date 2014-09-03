module.exports = checkRedundantAccess;

module.exports.options = {
    checkRedundantAccess: {allowedValues: [true]}
};

/**
 * validator for @access
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function checkRedundantAccess(node, err) {
    if (!node.jsDoc) {
        return;
    }

    var access;
    node.jsDoc.data.tags.forEach(function(tag) {
        if (['private', 'protected', 'public', 'access'].indexOf(tag.tag) === -1) {
            return;
        }

        if (access) {
            err('Multiple access definition');
            return;
        }

        if (tag.tag === 'access' && !tag.name) {
            err('Invalid access definition');
        }

        access = tag.tag === 'access' ? tag.name : tag.tag || 'unspecified';
    });
}
