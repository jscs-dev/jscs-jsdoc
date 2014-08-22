
//var jsDocHelpers = require('../../jsdoc-helpers');

module.exports = validateEnforce;
module.exports.coveredOptions = [
    'strict',
    'enforce',
    'leadingUnderscoreAccess',
    'trailingUnderscoreAccess'
];

/**
 * validator for jsdoc data existance
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function validateEnforce(node, err) {
    var options = this._options;

    if (!node.jsDoc && options) {
        err('jsdoc definition required', node.loc.start);
    }
}
