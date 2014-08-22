
module.exports = validateTrailingUnderscores;
module.exports.coveredOptions = [
    'strict',
    'leadingUnderscoreAccess',
    'trailingUnderscoreAccess'
];

/**
 * validator for jsdoc data existance
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function validateTrailingUnderscores(node, err) {
    var options = this._options;
    var __strict = options.strict;
    if (!node.jsDoc) {
        return;
    }

    // underscores
    var leading = options.leadingUnderscoreAccess;
    var trailing = options.trailingUnderscoreAccess;

    var name;
    switch (node.parentNode.type) {
    case 'VariableDeclarator':
        name = node.parentNode.id.name;
        break;
    case 'Property':
        name = node.parentNode.key.name;
        break;
    default: // try to use func name itself (if not anonymous)
        name = (node.id||{}).name;
        break;
    }

    // skip if anonymous or something
    if (!name) {
        return;
    }

    // skip names without underscores at begin/end
    var nameHasLeading = name[0] === '_';
    var nameHasTrailing = name.substr(-1) === '_';
    if (!nameHasLeading && !nameHasTrailing) {
        return;
    }

    if (leading || trailing || __strict) {
        var access;
        node.jsDoc.data.tags.forEach(function (tag) {
            if (['private', 'protected', 'public', 'access'].indexOf(tag.tag) !== -1) {
                if (tag.tag === 'access' && !tag.name && __strict) {
                    err('Invalid access definition');
                }

                var newAccess = tag.tag === 'access' ? tag.name : tag.tag || 'public';
                if (newAccess) {
                    if (access && newAccess !== access && __strict) {
                        err('Multiple access definition');
                    }
                    access = newAccess;
                }
            }
        });

        if ((leading && nameHasLeading && (!access || [true, access].indexOf(leading) === -1)) ||
            (trailing && nameHasTrailing && (!access || [true, access].indexOf(trailing) === -1))) {
            err('Method access doesn\'t match');
        }
    }
}
