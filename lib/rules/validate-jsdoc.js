var assert = require('assert');

var jsDocHelpers = require('../jsdoc-helpers');
var validators = require('./validate-jsdoc/index');

module.exports = function() {};

module.exports.prototype = {

    configure: function (options) {
        assert(typeof options === 'object', 'jsDoc option requires object value');

        this._options = options;
        this._optionsList = Object.keys(options);
        this._validators = validators.load(this._optionsList);

        assert(this._validators.length, 'jsDoc was not configured properly');

        this._validators.forEach(function (v) {
            if (v.configure) {
                v.configure.call(this, options);
            }
            if (v.options) {
                validators.checkOptions(v, options);
            }
        }.bind(this));
    },

    getOptionName: function () {
        return 'jsDoc';
    },

    check: function (file, errors) {
        var activeValidators = this._validators;

        // skip if there is no validators
        if (!activeValidators.length) {
            return;
        }

        var jsDocs = jsDocHelpers.parseComments(file.getComments());
        var that = this;

        file.iterateNodesByType([
            'FunctionDeclaration',
            'FunctionExpression'

        ], function (node) {
            node.jsDoc = jsDocs.forNode(node);
            for (var j = 0, k = activeValidators.length; j < k; j += 1) {
                activeValidators[j].call(that, node, addError);
            }

            function addError(text, loc) {
                loc = loc || {};
                loc.line = loc.hasOwnProperty('line') ? loc.line : (node.jsDoc.loc.start.line);
                loc.column = loc.hasOwnProperty('column') ? loc.column : 0; //node.jsDoc[i].indexOf('@');
                errors.add(text, loc.line, loc.column);
            }
        });

    }
};
