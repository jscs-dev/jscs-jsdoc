var assert = require('assert');

var jsdoc = require('../jsdoc');
var esprimaHelpers = require('../esprima-helpers');
var validators = require('./validate-jsdoc/index');

module.exports = function() {};

module.exports.prototype = {

    // load all rules and init them
    configure: function(options) {
        assert(typeof options === 'object', 'jsDoc option requires object value');

        // rules structured by scopes-tags for jsdoc-tags
        var rulesForTags = this._rulesForTags = {};
        // rules structured by scopes for nodes
        var rulesForNodes = this._rulesForNodes = {};

        this._options = options;
        this._optionsList = Object.keys(options);

        // load validators
        this._validators = validators.load(this._optionsList);
        assert(this._validators.length, 'jsDoc plugin was not configured properly');

        // registering validators
        this._validators.forEach(function(v) {
            // check options
            if (v.options) {
                validators.checkOptions(v, options);
            }
            // index rules by tags and scopes
            (v.scopes || ['']).forEach(function(scope) {
                if (!v.tags) {
                    assert(v.length === 2, 'jsDoc rules: Wrong arity in ' + v._name + ' validator');
                    rulesForNodes[scope] = rulesForNodes[scope] || [];
                    rulesForNodes[scope].push(v);
                    return;
                }
                assert(v.length === 3, 'jsDoc rules: Wrong arity in ' + v._name + ' validator');
                rulesForTags[scope] = rulesForTags[scope] || {};
                v.tags.forEach(function(tag) {
                    var dtag = '@' + tag;
                    rulesForTags[scope][dtag] = rulesForTags[scope][dtag] || [];
                    rulesForTags[scope][dtag].push(v);
                });
            });
        }, this);
    },

    getOptionName: function() {
        return 'jsDoc';
    },

    check: function(file, errors) {
        patchNodesInFile(file);

        var _this = this;
        var scopes = {
            'function': [
                'FunctionDeclaration',
                'FunctionExpression'
            ]
        };

        // classic checker
        if (_this._rulesForNodes.file) {
            // call file checkers
            var validators = _this._rulesForNodes.file;
            if (validators) {
                validators.forEach(function(v) {
                    v.call(_this, file, errors);
                });
            }
        }

        // iterate over scopes
        Object.keys(scopes).forEach(function(scope) {

            // skip unused
            if (!_this._rulesForNodes[scope] && !_this._rulesForTags[scope]) {
                return;
            }

            // traverse ast tree and search scope node types
            file.iterateNodesByType(scopes[scope], function(node) {
                // init
                var commentStart = (node.jsdoc || node).loc.start;
                var commentStartLine = commentStart.line;
                var validators;

                // call node checkers
                validators = _this._rulesForNodes[scope];
                if (validators) {
                    validators.forEach(function(v) {
                        v.call(_this, node, addError);
                    });
                }

                validators = _this._rulesForTags[scope];
                if (!validators || !node.jsdoc) {
                    return;
                }

                // call rule checkers
                node.jsdoc.iterate(function(tag, i) {
                    if (!validators['@' + tag.id]) {
                        return;
                    }
                    // call tag validator
                    commentStart.line = commentStartLine + i;
                    validators['@' + tag.id].forEach(function(v) {
                        v.call(_this, node, tag, fixErrLocation(addError, tag));
                    });
                });

                function addError(text, relLine, relColumn) {
                    var line;
                    var column;
                    if (typeof relLine === 'object') {
                        line = relLine.line;
                        column = relLine.column;
                    } else {
                        line = commentStart.line + (relLine || 0);
                        column = commentStart.column + (relColumn || 0);
                    }
                    errors.add(text, line, column);
                }

                function fixErrLocation (err, tag) {
                    return function(text, line, column) {
                        line = line || tag.line;
                        // probably buggy. multiline comment could resolved to 0
                        column = column || node.jsdoc.lines[tag.line].indexOf(tag.value);
                        err(text, line, column);
                    };
                }
            });

        });
    },

    /**
     * caching scope search
     * @todo move to patchNodesInFile
     * @param {Object} node
     */
    _getReturnStatementsForNode: function(node) {
        if (node.jsdoc.returnStatements) {
            return node.jsdoc.returnStatements;
        }

        var statements = [];
        esprimaHelpers.treeIterator.iterate(node, function(n/*, parentNode, parentCollection*/) {
            if (n && n.type === 'ReturnStatement' && n.argument) {
                if (node === esprimaHelpers.closestScopeNode(n)) {
                    statements.push(n.argument);
                }
            }
        });

        node.jsdoc.returnStatements = statements;
        return statements;
    }
};

/**
 * Extends each node with helper properties
 * @param {Object} file
 */
function patchNodesInFile(file) {
    if (file._jsdocs) {
        return;
    }

    // jsdoc property for nodes
    var fileComments = file.getComments();
    file.iterateNodesByType([
        'FunctionDeclaration', 'FunctionExpression'
    ], function(node) {
        Object.defineProperty(node, 'jsdoc', {
            get: getJsdoc
        });
    });

    function getJsdoc() {
        if (!this.hasOwnProperty('_jsdoc')) {
            var res = findDocCommentBeforeLine(this.loc.start.line);
            this._jsdoc = res ? jsdoc.createDocCommentByCommentNode(res) : null;
        }
        return this._jsdoc;
    }

    function findDocCommentBeforeLine(line) {
        line--; // todo: buggy behaviour, can't jump back over empty lines
        for (var i = 0, l = fileComments.length; i < l; i++) {
            var commentNode = fileComments[i];
            // v.substr(jsdoc.loc.start.column);
            if (commentNode.loc.end.line === line && commentNode.type === 'Block' &&
                commentNode.value.charAt(0) === '*') {
                return commentNode;
            }
        }
        return null;
    }

    // mark object as patched
    file._jsdocs = true;
}
