var doctrineParser = require('doctrine');
var parse = require('comment-parser');

module.exports = {
    parseComments : jsDocParseComments,
    tagValidator : jsDocTagValidator,

    parse : jsDocParseType,
    match : jsDocMatchType
};

function jsDocParseComments (comments) {
    /**
     * metaobject for parsing jsdoc comments string
     */
    return {
        forNode: getJsDocForNode,
        parse: parseJsDoc
    };

    function getJsDocForNode (node) {
        var jsdoc = getJsDocForLine(node.loc.start.line);
        if (jsdoc) {
            var comment = Array(jsdoc.loc.start.column + 1).join(' ') + '/*' + jsdoc.value + '*/';
            jsdoc.data = parseJsDoc(comment);
            jsdoc.lines = comment.split('\n').map(function(v) {
                return v.substr(jsdoc.loc.start.column);
            });
            jsdoc.invalid = !jsdoc.data.hasOwnProperty('line');
            jsdoc.forEachTag = jsDocForEachTag;
        }
        return jsdoc;
    }

    function jsDocForEachTag (fn) {
        if (!this.data.tags || !this.data.tags.length) {
            return;
        }
        this.data.tags.forEach(fn);
    }

    function getJsDocForLine (line) {
        line--; // todo: buggy behaviour, can't jump back over empty lines
        for (var i = 0, l = comments.length; i < l; i++) {
            var commentNode = comments[i];
            if (commentNode.loc.end.line === line && commentNode.type === 'Block' &&
                commentNode.value.charAt(0) === '*') {
                return commentNode;
            }
        }
        return null;
    }

    function parseJsDoc (comment) {
        var parsed = parse(comment, {
            'line_numbers': true,
            'raw_value': true
        })[0] || {};
        parsed.tags = parsed.tags || [];
        return parsed;
    }
}

function jsDocTagValidator (validator) {
    return function(node, err) {
        var _this = this;
        if (!node.jsDoc) {
            return;
        }
        node.jsDoc.forEachTag(function(tag, i) {
            // call line validator
            validator.call(_this, node, tag, fixErrLocation(err, node, i));
        });
    };

    function fixErrLocation (err, node, tagN) {
        return function(text, line, column) {
            var tag = node.jsDoc.data.tags[tagN];
            line = line || tag.line;
            // buggy. multiline comment will resolved to 0
            column = column || node.jsDoc.lines[tag.line].indexOf(tag.value);
            err(text, line, column);
        };
            /*function addError(text, loc) {
                loc = loc || {};
                loc.line = loc.hasOwnProperty('line') ? loc.line : (node.jsDoc.tag.loc.line);
                loc.column = loc.hasOwnProperty('column') ? loc.column : -1; // node.jsDoc.data.tags[i].indexOf('@');
                errors.add(text, loc.line, loc.column);
            }*/
    }
}

/**
 * Parses jsDoc string
 * @param {String} typeString
 * @return {?Array.<SimplifiedType>} - parsed jsdoctype string as array
 */
function jsDocParseType (typeString) {
    var node;

    try {
        node = jsDocSimplifyNode(doctrineParser.parseType(typeString));
    } catch (e) {
        node = [];
        node.invalid = true;
    }

    return node;
}

/**
 * Converts AST jsDoc node to simple object
 * @param {Object} node
 * @returns {!(SimplifiedType[])}
 */
function jsDocSimplifyNode (node) {
    var result;

    switch (node.type) {

    case 'NullableType':
    case 'NonNullableType':
        result = jsDocSimplifyNode (node.expression);
        if (node.type === 'NullableType') {
            result.push({type: 'null'});
        }
        return result;

    case 'NullLiteral':
        result = {type: 'null'};
        break;

    case 'UndefinedLiteral':
        result = {type: 'undefined'};
        break;

    case 'UnionType':
        result = [];
        for (var i = 0, l = node.elements.length; i < l; i += 1) {
            result.push(jsDocSimplifyNode(node.elements[i]));
        }
        break;

    case 'TypeApplication':
        result = {type: node.expression.name, native: true};
        break;

    case 'NameExpression':
        result = {type: node.name};
        break;

    case 'RecordType':
        result = {type: 'Object', native: true};
        break;

    case 'FunctionType':
        result = {type: 'Function', native: true};
        break;

    // unused
    case 'FieldType':
        break;

    default:
        result = {type: 'Object', unknown: true};
        break;

    }

    if (!Array.isArray(result)) {
        result = [result];
    }

    return result;
}

/**
 * Compare parsed jsDocTypes with esprima node
 * @param {SimplifiedType[]} variants - result of jsDocParseType
 * @param {Object} argument - esprima source code node
 */
function jsDocMatchType (variants, argument) {
    var i;
    var l;
    var variant;
    var type;
    var result = null;

    for (i = 0, l = variants.length; i < l; i += 1) {
        variant = variants[i][0] || variants[i];
        if (variant.unknown || !variant.type) {
            result = true;
            break;
        }

        type = variant.type.toLowerCase();

        if (argument.type === 'Literal') {
            if (argument.value === null) {
                result = result || (type === 'null');

            } else if (argument.value === undefined) {
                result = result || (type === 'undefined');

            } else if (typeof argument.value !== 'object') {
                result = result || (type === typeof argument.value);

            } else if (!argument.value.type) {
                result = result || (type === (argument.value instanceof RegExp ? 'regexp' : 'object'));

            } else {
                result = result || (type === argument.value.type);
            }

        } else if (argument.type === 'ObjectExpression') {
            result = result || (type === 'object');

        } else if (argument.type === 'ArrayExpression') {
            result = result || (type === 'array');

        } else if (argument.type === 'NewExpression') {
            result = result || ((type === 'object') || (type === argument.callee.name.toLowerCase()));
        }

        if (result) {
            break;
        }
    }

    // variables, expressions, another behavior
    return result !== false;
}
