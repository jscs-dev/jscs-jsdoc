var commentParser = require('comment-parser');
var TypeParser = require('jsdoctypeparser').Parser;
var TypeBuilder = require('jsdoctypeparser').Builder;

module.exports = {
    /**
     * @param {string} comment
     * @returns {DocComment}
     */
    createDocComment: function(comment) {
        return new DocComment(comment);
    },

    doc: DocComment,
    tag: DocTag,
    type: DocType
};

/**
 * jsdoc comment object
 * @param {object} commentNode
 * @constructor
 */
function DocComment(commentNode) {
    // var comment = Array(jsdoc.loc.start.column + 1).join(' ') + '/*' + jsdoc.value + '*/';
    // parse comments
    var _parsed = _parseComment(commentNode.value) || {};

    // fill up fields
    this.loc = commentNode.loc;
    this.value = commentNode.value;
    this.lines = commentNode.lines || commentNode.value.split('\n');
    this.valid = _parsed.hasOwnProperty('line');

    // doc parsed data
    this.description = _parsed.description || null;
    this.tags = (_parsed.tags || []).map(function(tag) {
        return new DocTag(tag);
    });

    /**
     * @param {function} fn
     * @chainable
     */
    this.iterate = function forEachTag(fn) {
        this.tags.forEach(fn);
        return this;
    };

    /**
     * @param {string|array} types
     * @param {function} fn
     * @chainable
     */
    this.iterateByType = function iterateByTypes(types, fn) {
        var k = 0;
        types = Array.isArray(types) ? types : [types];
        this.tags.forEach(function(tag) {
            if (types.indexOf(tag.name) !== -1) {
                return;
            }
            fn.call(this, tag, k++);
        }, this);
        return this;
    };
}

/**
 * Simple jsdoc tag object
 * @param {Object} tag
 * @constructor
 */
function DocTag(tag) {
    this.id = tag.tag;
    this.line = tag.line;
    this.value = tag.value;

    this.description = tag.description;
    this.optional = tag.optional;
    this.default = tag.default;

    if (tag.name) {
        this.name = tag.name;
    }
    if (tag.type) {
        this.type = new DocType(tag.type);
    }
}

/**
 * Parses jsdoctype string and provides several methods to work with it
 * @param {string} type
 * @constructor
 */
function DocType(type) {
    this.value = type;

    var parsed = _parseDocType(type);
    this.optional = parsed.optional;
    this.valid = parsed.valid;

    var data = _simplifyType(parsed);

    /**
     * match type
     * @param {EsprimaNode} node
     * @returns {boolean}
     */
    this.match = function(node) {
        return jsDocMatchType(data, node);
    };
}

/**
 * Comment parsing helper
 * @param {String} comment
 * @returns {Object}
 * @private
 */
function _parseComment(comment) {
    var parsed = commentParser(comment, {
        'line_numbers': true,
        'raw_value': true
    })[0];
    return parsed;
}

/**
 * @param {String} typeString
 * @return {?Array.<SimplifiedType>} - parsed jsdoctype string as array
 */
function _parseDocType(typeString) {
    var parser = new TypeParser();
    var node;
    try {
        node = parser.parse(typeString);
        node.valid = true;
    } catch (e) {
        console.error(e.stack);
        node = [];
        node.valid = false;
    }
    return node;
}

/**
 * Converts AST jsDoc node to simple object
 * @param {Object} node
 * @returns {!(SimplifiedType[])}
 * @link https://github.com/Kuniwak/jsdoctypeparser
 */
function _simplifyType(node) {
    var res = [];

    switch (true) {
    case node instanceof TypeBuilder.TypeUnion:
        // optional: boolean,
        // nullable: boolean,
        // variable: boolean,
        // nonNullable: boolean,
        // all: boolean,
        // unknown: boolean,
        // types: Array.<TypeName|GenericType|FunctionType|RecordType>
        res = node.types.map(_simplifyType);
        if (node.nullable) {
            res.push({type: 'null'});
        }
        break;

    case node instanceof TypeBuilder.TypeName:
        // name: string
        res = {type: node.name};
        break;

    case node instanceof TypeBuilder.GenericType:
        // genericTypeName: string,
        // parameterTypeUnions: Array.<TypeUnion>
        res = {type: node.genericTypeName.type};
        // node.parameterTypeUnions.map(_simplifyType);
        break;

    case node instanceof TypeBuilder.FunctionType:
        // parameterTypeUnions: Array.<TypeUnion>,
        // returnTypeUnion: TypeUnion|null,
        // isConstructor: boolean,
        // contextTypeUnion: TypeUnion|null
        res = {type: 'function'};
        // node.parameterTypeUnions.map(_simplifyType);
        // if (node.returnTypeUnion) {
        //     _simplifyType(node.returnTypeUnion);
        // }
        // if (node.contextTypeUnion) {
        //     _simplifyType(node.contextTypeUnion);
        // }
        break;

    case node instanceof TypeBuilder.RecordType:
        // entries: Array.<RecordEntry>
        res = {type: 'object'}; // node.entries.map(_simplifyType);
        break;

    case node instanceof TypeBuilder.RecordType.Entry:
        // name: string,
        // typeUnion: TypeUnion
        res = _simplifyType(node.typeUnion);
        break;

    case node instanceof TypeBuilder.ModuleName:
        res = {type: node.name, module: true};
        break;

    default:
        throw new Error('DocType: Unsupported doc node');
    }

    return res;
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
            result = result || (type === 'object' || type === 'class');

        } else if (argument.type === 'ArrayExpression') {
            result = result || (type === 'array');

        } else if (argument.type === 'NewExpression' && type === 'object') {
            result = result || true;

        } else if (argument.type === 'NewExpression') {
            var c = argument.callee;
            var exam = c.name;
            if (!exam && c.type === 'MemberExpression') {
                var cur = c;
                exam = [];
                while (cur.object) {
                    exam.unshift(cur.property.name);
                    cur = cur.object;
                }
                exam.unshift(cur.name);
                exam = exam.join('.');
            }
            exam = exam.toLowerCase();
            result = result || (type === exam);
        }

        if (result) {
            break;
        }
    }

    // variables, expressions, another behavior
    return result !== false;
}
