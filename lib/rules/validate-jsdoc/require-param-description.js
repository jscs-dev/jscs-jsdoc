module.exports = validateParamTagDescription;
module.exports.tags = ['param', 'arg', 'argument'];
module.exports.scopes = ['function'];
module.exports.options = {
    requireParamDescription: {allowedValues: [true]}
};

/**
 * Validator for @param
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {DocTag} tag
 * @param {Function} err
 */
function validateParamTagDescription(node, tag, err) {
    // checking existance
    if (tag.description) {
        return;
    }
    var offset = 0;
    if (tag.name && tag.name.value && tag.name.value.length) {
        offset = tag.name.value.length;
    }
    var loc = (tag.name ? tag.name.loc : null) || tag.loc;

    // we create a new one to prevent modifing given location
    var locWithOffset = {
        line: loc.line,
        column: loc.column + offset
    };
    return err('Missing param description', locWithOffset);
}
