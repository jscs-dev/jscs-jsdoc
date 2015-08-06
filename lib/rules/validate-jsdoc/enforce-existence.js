var assert = require('assert');

module.exports = enforceExistence;
module.exports.scopes = ['function'];
module.exports.options = {
    enforceExistence: true
};

/**
 * @param {Object} options
 */
enforceExistence.configure = function(options) {

    // set default policy
    var policy = this._enforceExistencePolicy = {
        all: true,
        anonymous: false,
        exports: true,
        expressions: true
    };

    // check options are valid
    var o = options.enforceExistence;
    assert(
        o === true || o === false || typeof o === 'string' || (typeof o === 'object' && Array.isArray(o.allExcept)),
        'jsDoc.enforceExistence rule was not configured properly'
    );

    // parse options for policies
    if (o === false) {
        policy.all = false;
    } else if (typeof o === 'string' && o === 'exceptExports') { // backward compatible string option
        policy.exports = false;
    } else if (typeof o === 'object' && Array.isArray(o.allExcept)) {
        if (o.allExcept.indexOf('exports') > -1) {
            policy.exports = false;
        }
        if (o.allExcept.indexOf('expressions') > -1) {
            policy.expressions = false;
        }
    }

};

/**
 * Validator for jsdoc data existence
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function enforceExistence(node, err) {
    var policy = this._enforceExistencePolicy;

    // enforce 'break-out' policies
    var parentNode = node.parentNode || {};

    if (policy.all === false) {
        // don't check anything
        return;
    }
    if (policy.anonymous === false) {
        if (!node.id && ['AssignmentExpression', 'VariableDeclarator', 'Property'].indexOf(parentNode.type) === -1) {
            // don't check anonymous functions
            return;
        }
    }
    if (policy.exports === false) {
        if (parentNode.type === 'AssignmentExpression') {
            var left = parentNode.left;
            if ((left.object && left.object.name) === 'module' &&
                (left.property && left.property.name) === 'exports') {
                // don't check exports functions
                return;
            }
        }
    }
    if (policy.expressions === false) {
        if (['AssignmentExpression', 'VariableDeclarator', 'Property'].indexOf(parentNode.type) > -1) {
            // don't check expression functions
            return;
        }
    }

    // now clear to check for documentation
    if (node.jsdoc) {
        if (!node.jsdoc.valid) {
            err('Invalid jsdoc-block definition', node.jsdoc.loc.start);
        }
        return;
    }

    // report absence
    err('Expect valid jsdoc-block definition', node.loc.start);

}
