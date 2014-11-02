describe('rules/validate-jsdoc', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('require-return-types', function() {

        checker.rules({requireReturnTypes: true});
        checker.cases([
            /* jshint ignore:start */
            {
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
