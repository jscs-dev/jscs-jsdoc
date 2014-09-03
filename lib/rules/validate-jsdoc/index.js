var assert = require('assert');

var validatorsByName = module.exports = {
    param: require('./param'),
    returns: require('./returns'),
    checkRedundantAccess: require('./check-redundant-access'),
    enforceExistence: require('./enforce-existence'),
    leadingUnderscoreAccess: require('./leading-underscore-access')
};

Object.defineProperty(validatorsByName, 'load', {
    value: function loadValidators(passedOptions) {
        var validators = [];

        if (!passedOptions) {
            return validators;
        }

        Object.keys(validatorsByName).forEach(function(name) {
            var v = validatorsByName[name];

            // skip unknown
            var coveredOptions = v.coveredOptions || (v.options && Object.keys(v.options));
            if (!coveredOptions || !coveredOptions.length) {
                return;
            }

            // store used
            for (var i = 0, l = coveredOptions.length; i < l; i += 1) {
                if (passedOptions.indexOf(coveredOptions[i]) !== -1) {
                    v._name = name;
                    validators.push(v);
                    return;
                }
            }
        });

        return validators;
    }
});

Object.defineProperty(validatorsByName, 'checkOptions', {
    value: function checkOptions(validator, options) {
        Object.keys(validator.options).forEach(function(data, option) {
            if (!data.allowedValues) {
                return;
            }

            var values;
            if (typeof data.allowedValues === 'function') {
                values = data.allowedValues();
            }

            if (!Array.isArray(values)) {
                throw new Error('Internal error in jsDoc validator ' + validator._name);

            } else if (values.length > 1) {
                assert(values.indexOf(options[option]) !== -1,
                    'Available values for option jsDoc.' + option + ' are ' + values.map(JSON.stringify).join(', '));

            } else if (values.length) {
                assert(values[0] === options[option],
                    'Only accepted value for jsDoc.' + option + ' is ' + JSON.stringify(values[0]));
            }
        });
    }
});
