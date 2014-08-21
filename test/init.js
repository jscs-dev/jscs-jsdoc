var parse = require('comment-parser');

global.parse = parse;
global.fnBody = fnBody;

function fnBody(func) {
    var str = func.toString();
    var out = str.slice(
        str.indexOf('{') + 1,
        str.lastIndexOf('}')
    );

    // strip trailing spaces and tabs
    out = out.replace(/^\n*|[ \t]*$/g, '');

    // strip preceding indentation
    var blockIndent = 0;
    out.match(/^([ \t]*)/gm).map(function (v) {
        if (!blockIndent || (v.length > 0 && v.length < blockIndent)) {
            blockIndent = v.length;
        }
    });

    // rebuild block without inner indent
    out = !blockIndent ? out : out.split('\n').map(function (v) {
        return v.substr(blockIndent);
    }).join('\n');

    return out;
}
