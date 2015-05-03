module.exports = requireHyphenBeforeDescription;
module.exports.tags = ['param', 'arg', 'argument'];
module.exports.scopes = ['function'];
module.exports.options = {
    requireHyphenBeforeDescription: {allowedValues: [true]}
};

/**
 * Checking returns types
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {DocTag} tag
 * @param {Function} err
 */
function requireHyphenBeforeDescription(node, tag, err) {
    if (!tag.description) {
        return;
    }

    if (tag.description.substring(0, 2) !== '- ') {
        err('Missing hyphen before description', tag.loc);
    }
}
