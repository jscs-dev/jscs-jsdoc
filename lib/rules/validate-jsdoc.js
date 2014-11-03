var assert = require('assert');

var jsDocHelpers = require('../jsdoc-helpers');
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
        assert(this._validators.length, 'jsDoc was not configured properly');

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
                    rulesForTags[scope][tag] = rulesForTags[scope][tag] || [];
                    rulesForTags[scope][tag].push(v);
                });
            });
        }, this);
    },

    getOptionName: function() {
        return 'jsDoc';
    },

    check: function(file, errors) {
        var jsDocs = jsDocHelpers.parseComments(file.getComments());
        var _this = this;

        var scopes = {
            'function': [
                'FunctionDeclaration',
                'FunctionExpression'
            ]
        };

        Object.keys(scopes).forEach(function(scope) {
            // skip unused scopes
            if (!_this._rulesForNodes[scope] && !_this._rulesForTags[scope]) {
                return;
            }

            // traverse ast tree and search scope node types
            file.iterateNodesByType(scopes[scope], function(node) {
                // init
                node.jsDoc = node.jsDoc || jsDocs.forNode(node);
                var commentStart = (node.jsDoc || node).loc.start;
                var commentStartLine = commentStart.line;
                var validators;

                // call node checkers
                validators = _this._rulesForNodes[scope];
                if (validators) {
                    for (var j = 0, k = validators.length; j < k; j += 1) {
                        validators[j].call(_this, node, addError);
                    }
                }

                validators = _this._rulesForTags[scope];
                if (!node.jsDoc || !validators) {
                    return;
                }

                // call rule checkers
                node.jsDoc.forEachTag(function(tag, i) {
                    if (!validators[tag.tag]) {
                        return;
                    }
                    // call tag validator
                    commentStart.line = commentStartLine + i;
                    validators[tag.tag].forEach(function(v) {
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
                        column = column || node.jsDoc.lines[tag.line].indexOf(tag.value);
                        err(text, line, column);
                    };
                }
            });

        });

    },

    /**
     * caching scope search
     */
    _getReturnStatementsForNode: function(node) {
        if (node.jsDoc.returnStatements) {
            return node.jsDoc.returnStatements;
        }

        var statements = [];
        esprimaHelpers.treeIterator.iterate(node, function(n/*, parentNode, parentCollection*/) {
            if (n && n.type === 'ReturnStatement' && n.argument) {
                if (node === esprimaHelpers.closestScopeNode(n)) {
                    statements.push(n.argument);
                }
            }
        });

        node.jsDoc.returnStatements = statements;
        return statements;
    }
};
