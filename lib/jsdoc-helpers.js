var doctrineParser = require('doctrine');

module.exports = {
    parseComments : jsDocParseComments,

    parse : jsDocParseType,
    match : jsDocMatchType
};

function jsDocParseComments (comments) {

    /**
     * metaobject for parsing jsdoc comments string
     */
    return {
        node: getJsDocForNode,
        line: getJsDocForLine
    };

    function getJsDocForNode (node) {
        return getJsDocForLine(node.loc.start.line);
    }

    function getJsDocForLine (line) {
        line--;
        for (var i = 0, l = comments.length; i < l; i++) {
            var comment = comments[i];
            if (comment.loc.end.line === line && comment.type === 'Block' && comment.value.charAt(0) === '*') {
                return comment;
            }
        }
        return null;
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
    var i, l, variant, type, result = null;

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
