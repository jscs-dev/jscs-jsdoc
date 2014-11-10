describe('lib/rules/validate-jsdoc/check-param-names', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('configured', function() {

        it('with undefined should throws', function() {
            global.expect(function() {
                checker.configure({checkParamNames: undefined});
            }).to.throws(/accepted value/i);
        });

        it('with undefined should throws', function() {
            global.expect(function() {
                checker.configure({checkParamNames: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('with true', function() {
        checker.rules({checkParamNames: true});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not throw',
                code: function() {
                    function yay(yey) {
                    }

                    /**
                     * @param {number} yay
                     * @param {string} bar this shouldn't throw
                     */
                    function yey(yay) {
                    }
                }

            }, {
                it: 'should report invalid jsdoc',
                code: function () {
                    var x = 1;
                    /**
                     * @param
                     */
                    function funcName(xxx) {
                    }
                },
                errors: 1
            }, {
                it: 'should report error in jsdoc for function',
                code: function () {
                    var x = 1;
                    /**
                     * @param {String} yyy
                     */
                    function funcName(xxx) {
                    }
                },
                errors: 1
            }, {
                it: 'should report error in jsdoc for method',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param {String} yyy
                         */
                        run: function(xxx) {
                        }
                    };
                },
                errors: 1
            }, {
                it: 'should not report valid jsdoc for method',
                code: function () {
                    var x = 1;
                    /**
                     * @param {String} xxx
                     */
                    function funcName(xxx) {
                    }
                }
            }, {
                it: 'should not report valid jsdoc for function',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param {String} xxx
                         */
                        run: function(xxx) {
                        }
                    };
                }
            }
            /* jshint ignore:end */
        ]);

        // locations
        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should report error in jsdoc for function',
                code: function () {
                    var x = 1;
                    /**
                     * @param {String} yyy
                     */
                    function funcName(xxx) {
                    }
                },
                errors: {line: 3, column: 19}
            }, {
                it: 'should report error in jsdoc for method',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param {String} yyy
                         */
                        run: function(xxx) {
                        }
                    };
                },
                errors: {line: 3, column: 23}
            }
            /* jshint ignore:end */
        ]);

    });

});
