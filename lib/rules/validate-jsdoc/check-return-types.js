module.exports = checkReturnTypes;
module.exports.tags = ['return', 'returns'];
module.exports.scopes = ['function'];
module.exports.options = {
    checkReturnTypes: {allowedValues: [true]}
};

/**
 * checking returns types
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {DocTag} tag
 * @param {Function} err
 */
function checkReturnTypes(node, tag, err) {
   /* var option = this._options.checkReturnTypes;
    if (!node.jsdoc) {
        return;
    }

    console.log(node.jsdoc);

    if (node.jsdoc) {

    }*/
    if (node) { err(); }
    return tag;
}
