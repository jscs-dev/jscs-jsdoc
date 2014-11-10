module.exports = requireReturnTypes;
module.exports.tags = ['return', 'returns'];
module.exports.scopes = ['function'];
module.exports.options = {
    requireReturnTypes: {allowedValues: [true]}
};

/**
 * requiring returns types (?)
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {DocTag} tag
 * @param {Function} err
 */
function requireReturnTypes(node, tag, err) {
    if (!tag.type) {
        err('Missing type in @returns statement');
    }
}
