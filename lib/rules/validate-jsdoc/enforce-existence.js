module.exports = enforceExistence;
module.exports.scopes = ['function'];
module.exports.options = {
    enforceExistence: {allowedValues: [true]}
};

/**
 * validator for jsdoc data existance
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function enforceExistence(node, err) {
    // if function is not anonymous or in variabledeclarator or in assignmentexpression
    var parentNode = node.parentNode || {};
    var needCheck = node.id ||
        parentNode.type === 'VariableDeclarator' ||
        parentNode.type === 'Property' ||
        parentNode.type === 'AssignmentExpression' && parentNode.operator === '=';

    // and report unless jsdoc exists
    if (needCheck && !node.jsdoc) {
        err('jsdoc definition required', node.loc.start);
    }
}
