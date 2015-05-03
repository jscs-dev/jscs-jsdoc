module.exports = enforceExistence;
module.exports.scopes = ['function'];
module.exports.options = {
    enforceExistence: {allowedValues: [true, 'exceptExports']}
};

/**
 * Validator for jsdoc data existance
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function enforceExistence(node, err) {
    var reportExports = this._options.enforceExistence !== 'exceptExports';

    // if function is not anonymous or in variabledeclarator or in assignmentexpression
    var parentNode = node.parentNode || {};
    var needCheck = node.id ||
        parentNode.type === 'VariableDeclarator' ||
        parentNode.type === 'Property' ||
        parentNode.type === 'AssignmentExpression' && parentNode.operator === '=';

    if (!reportExports && needCheck && parentNode.type === 'AssignmentExpression') {
        var left = parentNode.left;
        if ((left.object && left.object.name) === 'module' &&
            (left.property && left.property.name) === 'exports') {
            needCheck = false;
        }
    }

    // skip unless jsdoc exists and check is needed
    if (node.jsdoc || !needCheck) {
        return;
    }

    // report absence
    err('jsdoc definition required', node.loc.start);
}
