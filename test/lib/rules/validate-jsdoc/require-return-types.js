describe('lib/rules/validate-jsdoc/require-return-types', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({requireReturnTypes: undefined});
            }).to.throws(/accepted value/i);
        });

        it('should report with an object', function() {
            global.expect(function() {
                checker.configure({requireReturnTypes: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('with true', function() {
        checker.rules({requireReturnTypes: true});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report',
                code: function() {
                    function yay(yey) {
                    }
                }
            }, {
                it: 'should report invalid @returns',
                errors: 1,
                code: function() {
                    var x = 1;
                    /**
                     * @return
                     */
                    function funcName() {
                        // dummy
                    }
                }
            }, {
                it: 'should not report valid jsdoc with object type in method',
                code: function() {
                    Cls.prototype = {
                        /**
                         * @return {{bar: number}}
                         */
                        run: function (xxx) {
                            return {};
                        }
                    };
                }
            }
            /* jshint ignore:end */
        ]);

    });
});
