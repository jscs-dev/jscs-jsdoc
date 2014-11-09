var assert = require('assert');

describe('rules/validate-jsdoc', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('configure', function () {

        it('should throw on call without params', function () {
            assert.throws(function () {
                checker.configure();
            });
        });

        it('should throw with true', function () {
            assert.throws(function () {
                checker.configure(true);
            });
        });

        it('should throw with empty object', function () {
            assert.throws(function () {
                checker.configure({});
            });
        });

        it('should throw with unknown key', function () {
            assert.throws(function () {
                checker.configure({unknownRule: true});
            });
        });

    });
});
