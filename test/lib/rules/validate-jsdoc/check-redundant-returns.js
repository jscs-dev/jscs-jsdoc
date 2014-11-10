describe('rules/validate-jsdoc', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('check-redundant-returns', function() {
        checker.rules({checkRedundantReturns: true});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not throw',
                code: function() {
                    function yay(yey) {
                    }
                }

            }, {
                it: 'should report redundant @returns for function',
                errors: 3,
                code: function () {
                    /**
                     * @return {string}
                     */
                    function funcName() {
                        // dummy
                    }

                    /**
                     * @returns {String}
                     */
                    function funcName() {
                        var x = function () { return 1; }
                    }

                    /**
                     * @returns {String}
                     */
                    function funcName() {
                        return;
                    }
                }
            }, {
                it: 'should not report redundant @returns for function',
                code: function () {
                    /**
                     * @returns {String}
                     */
                    function funcName() {
                        var x = function () { return 1; }
                        if (true) { return x; }
                    }
                }
            }, {
                it: 'should not report expression return for inner call result',
                code: function () {
                    /**
                     * @function
                     * @return {Promise} a promise
                     */
                    function onEvent () {
                        return this.login().then(function () {
                            // do some else
                        });
                    }
                }
            }
            /* jshint ignore:end */
        ]);

    });
});
