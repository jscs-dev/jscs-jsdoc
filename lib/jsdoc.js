var assert = require('assert');
var commentParser = require('comment-parser');
var TypeParser = require('jsdoctypeparser').Parser;
var TypeBuilder = require('jsdoctypeparser').Builder;

// wtf but it needed to stop writing warnings to stdout
// and revert exceptions functionality
TypeBuilder.ENABLE_EXCEPTIONS = true;

module.exports = {
    /**
     * @param {string} commentNode
     * @returns {DocComment}
     */
    createDocCommentByCommentNode: function(commentNode) {
        var loc = commentNode.loc;
        var lines = [Array(loc.start.column + 1).join(' '), '/*', commentNode.value, '*/']
            .join('').split('\n').map(function(v) {
                return v.substr(loc.start.column);
            });
        var value = lines.join('\n');
        return new DocComment(value, loc);
    },

    doc: DocComment,
    tag: DocTag,
    type: DocType,
    location: DocLocation
};

/**
 * jsdoc comment object
 * @param {string} value
 * @param {{start: DocLocation}} loc
 * @constructor
 */
function DocComment(value, loc) {
    // parse comments
    var _parsed = _parseComment(value) || {};

    // fill up fields
    this.loc = loc;
    this.value = value;
    this.lines = value.split('\n');
    this.valid = _parsed.hasOwnProperty('line');

    // doc parsed data
    this.description = _parsed.description || null;
    this.tags = (_parsed.tags || []).map(function(tag) {
        return new DocTag(tag, new DocLocation(tag.line, 3, loc.start));
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
            if (types.indexOf(tag.id) === -1) {
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
 * @param {DocLocation} loc
 * @constructor
 */
function DocTag(tag, loc) {
    this.id = tag.tag;
    this.line = tag.line;
    this.value = tag.value;

    this.description = tag.description;
    this.optional = tag.optional;
    this.default = tag.default;

    this.loc = loc;

    if (tag.name) {
        this.name = {
            loc: this.loc.shift(0, tag.value.indexOf(tag.name)),
            value: tag.name
        };
    }
    if (tag.type) {
        this.type = new DocType(tag.type, this.loc.shift(0, tag.value.indexOf(tag.type)));
    }
}

/**
 * Parses jsdoctype string and provides several methods to work with it
 * @param {string} type
 * @param {DocLocation} loc
 * @constructor
 */
function DocType(type, loc) {
    assert(type, 'type can\'t be empty');
    assert(loc, 'location should be passed');

    this.value = type;
    this.loc = loc;

    var parsed = _parseDocType(type);
    var data = parsed.valid ? _simplifyType(parsed) : [];

    this.optional = parsed.optional;
    this.variable = parsed.variable;
    this.valid = parsed.valid;

    if (parsed.valid && parsed.variable) {
        this.loc.column = this.loc.column + 3;
    }

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
 * DocLocation
 * @constructor
 * @param {Number} line
 * @param {Number} column
 * @param {(Object|DocLocation)} [rel]
 */
function DocLocation(line, column, rel) {
    assert(Number.isFinite(line) && line >= 0, 'line should be greater than zero');
    assert(Number.isFinite(column) && column >= 0, 'column should be greater than zero');
    rel = rel || {};
    this.line = Number(line) + Number(rel.line || 0);
    this.column = Number(column) + Number(rel.column || 0);
}

/**
 * Shift location by line and column
 * @param {Number|Object} line
 * @param {Number} [column]
 * @return {DocLocation}
 */
DocLocation.prototype.shift = function(line, column) {
    if (typeof line === 'object') {
        column = line.column;
        line = line.line;
    }
    return new DocLocation(line, column, this);
};

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
        node = {};
        node.error = e.message;
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

var jsPrimitives = 'String Number Boolean Object Array Date Null Undefined Function Array RegExp'
    .toLowerCase().split(' ');

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
    var primitive;
    var result = null;

    for (i = 0, l = variants.length; i < l; i += 1) {
        variant = variants[i][0] || variants[i];
        if (variant.unknown || !variant.type) {
            result = true;
            break;
        }

        type = variant.type.toLowerCase();
        primitive = jsPrimitives.indexOf(type) !== -1;

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
            result = result || (!primitive);

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
