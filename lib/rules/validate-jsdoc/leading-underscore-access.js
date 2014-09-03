module.exports = validateLeadingUnderscoresAccess;

module.exports.options = {
    leadingUnderscoreAccess: {
        allowedValues: [true, 'private', 'protected']
    }
};

/**
 * validator for jsdoc data existance
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function validateLeadingUnderscoresAccess(node, err) {
    var option = this._options.leadingUnderscoreAccess;
    if (!node.jsDoc) {
        return;
    }

    // fetch name from variable, property or function
    var name;
    switch (node.parentNode.type) {
    case 'VariableDeclarator':
        name = node.parentNode.id.name;
        break;
    case 'Property':
        name = node.parentNode.key.name;
        break;
    default: // try to use func name itself (if not anonymous)
        name = (node.id || {}).name;
        break;
    }

    // skip anonymous and names without underscores at begin
    if (!name || name[0] !== '_') {
        return;
    }

    var access;
    node.jsDoc.data.tags.forEach(function(tag) {
        if (!access && ['private', 'protected', 'public', 'access'].indexOf(tag.tag) !== -1) {
            access = (tag.tag === 'access' ? tag.name : tag.tag);
        }
    });

    if (!access || [true, access].indexOf(option) === -1) {
        err('Method access doesn\'t match');
    }
}
