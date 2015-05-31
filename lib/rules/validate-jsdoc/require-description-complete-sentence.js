module.exports = requireDescriptionCompleteSentence;
module.exports.scopes = ['function'];
module.exports.options = {
    requireDescriptionCompleteSentence: {allowedValues: [true]}
};

var RE_START_WITH_UPPER_CASE = /^[A-Z]/;

/**
 * Checks that a period is next to a word at the end of input.
 *
 * The sentence ending with a new line is also valid.
 */
var RE_END_WITH_PERIOD = /\w[.](\n|$)/;

var RE_END_DESCRIPTION = /\n/g;

var RE_LAST_WORD = /\w(?!.*\w)/;

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

        // Find the location last word in the description.
        var line = -1;
        var column = -1;
        for (var i = lines.length -1; i >= 0; i--) {
            if (RE_LAST_WORD.test[lines[i]]) {
                line = i;
                column = RE_LAST_WORD.search(lines[i]);
                break;
            }
        }
        err('Sentence must end with a period.', {
            line: loc.line + 1 + line,
            column: loc.column + 3 + column
        });
    }
}
