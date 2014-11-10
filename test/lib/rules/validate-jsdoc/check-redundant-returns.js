describe('lib/rules/validate-jsdoc/check-redundant-returns', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('configured', function() {

        it('with undefined should throws', function() {
            global.expect(function() {
                checker.configure({checkRedundantReturns: undefined});
            }).to.throws(/accepted value/i);
        });

        it('with undefined should throws', function() {
            global.expect(function() {
                checker.configure({checkRedundantReturns: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('with true', function() {
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
