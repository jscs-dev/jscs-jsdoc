describe('lib/rules/validate-jsdoc/check-redundant-returns', function () {
    var checker = global.checker({
        plugins: ['./lib/index']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({checkRedundantReturns: undefined});
            }).to.throws(/accepted value/i);
        });

        it('should report with an object', function() {
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
                it: 'should not report',
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
            }, {
                it: 'should not report for abstract methods',
                code: function () {
                    /**
                     * @abstract
                     * @return {number}
                     */
                    function onEvent () {}
                }
            }
            /* jshint ignore:end */
        ]);

    });
});
