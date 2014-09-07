var assert = require('assert');

var jsDocHelpers = require('../jsdoc-helpers');
var validators = require('./validate-jsdoc/index');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        assert(typeof options === 'object', 'jsDoc option requires object value');

        this._options = options;
        this._optionsList = Object.keys(options);
        this._validators = validators.load(this._optionsList);

        assert(this._validators.length, 'jsDoc was not configured properly');

        this._validators.forEach(function(v) {
            if (v.configure) {
                v.configure.call(this, options);
            }
            if (v.options) {
                validators.checkOptions(v, options);
            }
        }.bind(this));
    },

    getOptionName: function() {
        return 'jsDoc';
    },

    check: function(file, errors) {
        var activeValidators = this._validators;

        // skip if there is no validators
        if (!activeValidators.length) {
            return;
        }

        var jsDocs = jsDocHelpers.parseComments(file.getComments());
        var _this = this;

        file.iterateNodesByType([
            'FunctionDeclaration',
            'FunctionExpression'

        ], function(node) {
            node.jsDoc = jsDocs.forNode(node);
            var commentStart = (node.jsDoc || node).loc.start;

            for (var j = 0, k = activeValidators.length; j < k; j += 1) {
                activeValidators[j].call(_this, node, addError);
            }

            function addError(text, relLine, relColumn) {
                var line;
                var column;
                if (typeof relLine === 'object' && arguments.length < 3) {
                    line = relLine.line;
                    column = relLine.column;
                } else {
                    line = commentStart.line + (relLine || 0);
                    column = commentStart.column + (relColumn || 0);
                }
                errors.add(text, line, column);
            }
        });

    }
};
