module.exports = enforceExistence;

module.exports.options = {
    enforceExistence: {allowedValues: [true]}
};

/**
 * validator for jsdoc data existance
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function enforceExistence(node, err) {
    if (!node.jsDoc) {
        err('jsdoc definition required', node.loc.start);
    }
}
