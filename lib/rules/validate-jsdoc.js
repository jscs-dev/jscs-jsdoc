var assert = require('assert');

var jsDocHelpers = require('../jsdoc-helpers');
var validatorsByName = require('./validate-jsdoc/index');

module.exports = function() {};

module.exports.prototype = {

    configure: function (options) {
        assert(typeof options === 'object', 'jsDoc option requires object value');
        this._options = options;
        this._optionsList = Object.keys(options);
    },

    getOptionName: function () {
        return 'jsDoc';
    },

    check: function (file, errors) {
        var validators = this.loadValidators();

        // skip if there is nothing to check
        if (!validators.length) {
            return;
        }

        var jsDocs = jsDocHelpers.parseComments(file.getComments());
        var that = this;

        file.iterateNodesByType([
            'FunctionDeclaration',
            'FunctionExpression'

        ], function (node) {
            node.jsDoc = jsDocs.forNode(node);
            for (var j = 0, k = validators.length; j < k; j += 1) {
                validators[j].call(that, node, addError);
            }

            function addError(text, loc) {
                loc = loc || {};
                loc.line = loc.hasOwnProperty('line') ? loc.line : (node.jsDoc.loc.start.line);
                loc.column = loc.hasOwnProperty('column') ? loc.column : 0; //node.jsDoc[i].indexOf('@');
                errors.add(text, loc.line, loc.column);
            }
        });

    },

    loadValidators: function () {
        var passedOptions = this._optionsList;
        var validators = [];
        if (!passedOptions) {
            return validators;
        }

        Object.keys(validatorsByName).forEach(function (name) {
            var v = validatorsByName[name];

            // skip unused
            if (!v.coveredOptions) {
                return;
            }

            // store used
            for (var i = 0, l = v.coveredOptions.length; i < l; i += 1) {
                if (passedOptions.indexOf(v.coveredOptions[i]) !== -1) {
                    validators.push(v);
                    return;
                }
            }
        }.bind(this));

        return validators;
    }
};
