var assert = require('assert');

describe('lib/rules/validate-jsdoc', function () {
    var checker = global.checker({
        plugins: ['.']
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

    describe('additional checks', function () {

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not throw anyway',
                rules: {checkReturnTypes: true},
                code: function() {
                    /**
                     * Cacher object
                     * @constructor
                     * @param {Object} o
                     * @param {Object} [o.storage={}] initial storage for cache
                     * @param {Number} [o.expTime=300] expiration time in seconds. 5 min by default
                     */
                    function Cacher (o) {
                        // doesn't mean
                    }
                }
            }
            /* jshint ignore:end */
        ]);

    });

});
