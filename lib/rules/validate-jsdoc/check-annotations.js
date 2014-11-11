var assert = require('assert');

var availablePresets = require('../../tags');
var jsdoc = require('../../jsdoc');

module.exports = validateAnnotations;
module.exports.scopes = ['file'];
module.exports.options = {
    checkAnnotations: true
};

var tags;

validateAnnotations.configure = function(options) {
    var o = options.checkAnnotations;

    assert(o === true || typeof o === 'string' || typeof o === 'object',
        'jsDoc.checkAnnotation rule was not configured properly');

    if (typeof o === 'string') {
        o = {preset: o};
    }

    tags = {};

    if (o === true) {
        Object.keys(availablePresets).forEach(function(preset) {
            var presetTags = availablePresets[preset];
            Object.keys(presetTags).forEach(function(tag) {
                tags[tag] = tags[tag] || presetTags[tag];
            });
        });

    } else if (typeof o === 'object') {
        if (o.preset) {
            assert(typeof o.preset === 'string', 'jsDoc.checkAnnotation.preset should be preset name');
            assert(availablePresets[o.preset], 'Unknown tag preset ' + o.preset);
            Object.keys(availablePresets[o.preset]).forEach(function(tag) {
                tags[tag] = tags[tag] || availablePresets[o.preset][tag];
            });
        }
        if (o.extra) {
            Object.keys(o.extra).forEach(function(tag) {
                tags[tag] = o.extra[tag];
            });
        }
    }
};

/**
 * validator for annotations
 * @param {JSCS.JSFile} file
 * @param {JSCS.Errors} errors
 */
function validateAnnotations(file, errors) {
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

        node.iterate(function(tag) {
            if (!tags.hasOwnProperty[tag.id]) {
                errors.add('unavailable tag ' + tag.id, tag.loc);
            }
            else if (tags[tag.id] && (!tag.name || !tag.type)) {
                errors.add('incomplete tag ' + tag.id + ' data', tag.loc);
            }
        });
    });
}
