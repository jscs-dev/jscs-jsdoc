module.exports = requireDescriptionCompleteSentence;
module.exports.scopes = ['function'];
module.exports.options = {
    requireDescriptionCompleteSentence: {allowedValues: [true]}
};

var RE_START_WITH_UPPER_CASE = /^[A-Z]/;

/**
 * Checks that a period is next to a word at the end of input.
 */
var RE_END_WITH_PERIOD = /\b[.]($)/;

var RE_END_DESCRIPTION = /\n/g;

/**
 * Requires description to be a complete sentence in a jsdoc comment.
 *
 * A complete sentence is defined by starting with an upper letter
 * and ending with a period.
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function requireDescriptionCompleteSentence(node, err) {
    var doc = node.jsdoc;
    if (!doc || !doc.tags.length || !doc.description || !doc.description.length) {
        return;
    }

    var loc = doc.loc.start;

    if (!RE_START_WITH_UPPER_CASE.test(doc.description)) {
        err('Sentence must start with an upper case letter.', {
            line: loc.line + 1,
            column: loc.column + 3
        });
    }

    if (!RE_END_WITH_PERIOD.test(doc.description)) {
        var lines = doc.description.split(RE_END_DESCRIPTION);
        err('Sentence must end with a period.', {
            line: loc.line + 1 + lines.length,
            column: loc.column + 3 + lines[0].length
        });
    }
}
