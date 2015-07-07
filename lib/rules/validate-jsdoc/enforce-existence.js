var assert = require('assert');

module.exports = enforceExistence;
module.exports.scopes = ['function'];
module.exports.options = {
    enforceExistence: true
};

// default policy
var enforceFor;

/**
 * @param {Object} options
 */
enforceExistence.configure = function(options) {

    // set default policy
    enforceFor = {
        all: true,
        anonymous: false,
        exports: true,
        expressions: true
    };

    // check options are valid
    var o = options.enforceExistence;
    assert(
        o === true || o === false || typeof o === 'string' || (typeof o === 'object' && o.allExcept instanceof Array),
        'jsDoc.enforceExistence rule was not configured properly'
    );

    // parse options for policies
    if (o === false) {
        enforceFor.all = false;
    } else if (typeof o === 'string' && o === 'exceptExports') { // backward compatible string option
        enforceFor.exports = false;
    } else if (typeof o === 'object' && o.allExcept instanceof Array) {
        if (o.allExcept.indexOf('exports') > -1) {
            enforceFor.exports = false;
        }
        if (o.allExcept.indexOf('expressions') > -1) {
            enforceFor.expressions = false;
        }
    }

};

/**
 * Validator for jsdoc data existance
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function enforceExistence(node, err) {

    // enforce 'break-out' policies
    var parentNode = node.parentNode || {};

    if (enforceFor.all === false) {
        // don't check anything
        return;
    }
    if (enforceFor.anonymous === false) {
        if (!node.id && ['AssignmentExpression', 'VariableDeclarator', 'Property'].indexOf(parentNode.type) === -1) {
            // don't check anonymous functions
            return;
        }
    }
    if (enforceFor.exports === false) {
        if (parentNode.type === 'AssignmentExpression') {
            var left = parentNode.left;
            if ((left.object && left.object.name) === 'module' &&
                (left.property && left.property.name) === 'exports') {
                // don't check exports functions
                return;
            }
        }
    }
    if (enforceFor.expressions === false) {
        if (['AssignmentExpression', 'VariableDeclarator', 'Property'].indexOf(parentNode.type) > -1) {
            // don't check expression functions
            return;
        }
    }

    // now clear to check for documentation
    if (node.jsdoc) {
        return;
    }

    // report absence
    err('jsdoc definition required', node.loc.start);

}