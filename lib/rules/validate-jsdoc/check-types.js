var jsdoc = require('../../jsdoc');

module.exports = validateTypesInTags;
module.exports.scopes = ['file'];
module.exports.options = {
    checkTypes: {allowedValues: [true]}
};

var allowedTags = {
    // common
    typedef: true,
    type: true,
    param: true,
    'return': true,
    returns: true,
    'enum': true,

    // jsdoc
    'var': true,
    prop: true,
    property: true,
    arg: true,
    argument: true,

    // jsduck
    cfg: true,

    // closure
    lends: true,
    extends: true,
    implements: true,
    define: true
};

/**
 * validator for types in tags
 * @param {JSCS.JSFile} file
 * @param {JSCS.Errors} errors
 */
function validateTypesInTags(file, errors) {
    var comments = file.getComments();
    comments.forEach(function(commentNode) {
        if (commentNode.type !== 'Block' || commentNode.value[0] !== '*') {
            return;
        }

        // trying to create DocComment object
        var node = jsdoc.createDocCommentByCommentNode(commentNode);
        if (!node.valid) {
            return;
        }

        node.iterateByType(Object.keys(allowedTags), function(tag) {
            if (!tag.type) {
                // skip untyped params
                return;
            }
            if (!tag.type.valid) {
                // throw an error if not valid
                errors.add('expects valid type instead of ' + tag.type.value, tag.type.loc);
            }
        });
    });
}
