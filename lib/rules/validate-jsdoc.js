var assert = require('assert');

var jsDocHelpers = require('../jsdoc-helpers');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        assert(typeof options === 'object', 'jsDoc option requires object value');
        this._options = options;
        this._optionsList = Object.keys(options);
    },

    getOptionName: function() {
        return 'jsDoc';
    },

    check: function(file, errors) {
        var lineValidators = this.loadLineValidators();

        // skip if there is nothing to check
        if (!lineValidators.length) {
            return;
        }

        var jsDocs = jsDocHelpers.parseComments(file.getComments());

        file.iterateNodesByType([
            'FunctionDeclaration',
            'FunctionExpression'
        ], function(node) {
            var jsDoc = jsDocs.node(node);
            if (!jsDoc) {
                return;
            }

            node.jsDoc = jsDoc.value.split('\n');
            node.jsDoc = node.jsDoc || {};
            node.jsDoc.paramIndex = 0;

            function addError (text, locStart) {
                locStart = locStart || {};
                errors.add(
                    text,
                    locStart.line || (jsDoc.loc.start.line + i),
                    locStart.column || (node.jsDoc[i].indexOf('@'))
                );
            }

            for (var i = 0, l = node.jsDoc.length; i < l; i++) {
                var line = node.jsDoc[i].trim();
                if (line.charAt(0) !== '*') {
                    continue;
                }

                line = line.substr(1).trim();

                for (var j = 0, k = lineValidators.length; j < k; j++) {
                    lineValidators[j](node, line, addError);
                }
            }
        });

    },

    loadLineValidators: function() {
        var passedOptions = this._optionsList;
        var validators = [];
        if (!passedOptions) {
            return validators;
        }

        var availableValidators = [
            'param',
            'returns'
        ];
        availableValidators.forEach(function (name) {
            var v = require('./validate-jsdoc/' + name);
            if (!v.coveredOptions) {
                return;
            }
            for (var i = 0, l = v.coveredOptions.length; i < l; i += 1) {
                if (passedOptions.indexOf(v.coveredOptions[i]) !== -1) {
                    validators.push(v.bind(this));
                    return;
                }
            }
        }.bind(this));

        return validators;
    }
};
