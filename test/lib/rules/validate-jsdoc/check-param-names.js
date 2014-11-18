describe('lib/rules/validate-jsdoc/check-param-names', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({checkParamNames: undefined});
            }).to.throws(/accepted value/i);
        });

        it('should report with an object', function() {
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
                it: 'should not report',
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

        // out-of-order. issue #33
        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should report out of order',
                code: function () {
                    /**
                     * @param xxx
                     * @param yyy
                     */
                    function funcName(yyy, xxx) {
                    }
                },
                errors: [
                    {message: 'parameters xxx and yyy are out of order', column: 10, line: 2, rule: "jsDoc"}
                ]
            }, {
                it: 'should report out of order many times',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param xxx
                         * @param yyy
                         * @param zzz
                         */
                        run: function(zzz, xxx, yyy) {
                        }
                    };
                },
                errors: [
                    {message: 'parameters xxx and zzz are out of order', column: 14, line: 3, rule: "jsDoc"},
                    {message: 'parameters yyy and xxx are out of order', column: 14, line: 4, rule: "jsDoc"}
                ]
            }, {
                it: 'should report out of order and expected',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param xxx
                         * @param yyy
                         */
                        run: function(zzz, xxx) {
                        }
                    };
                },
                errors: [
                    {message: 'parameter xxx is out of order', column: 14, line: 3, rule: "jsDoc"},
                    {message: 'expected xxx but got yyy', column: 14, line: 4, rule: "jsDoc"}
                ]
            }, {
                it: 'should report out of order and expected v2',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param xxx
                         * @param yyy
                         */
                        run: function(yyy, zzz) {
                        }
                    };
                },
                errors: [
                    {message: 'expected yyy but got xxx', column: 14, line: 3, rule: "jsDoc"},
                    {message: 'parameter yyy is out of order', column: 14, line: 4, rule: "jsDoc"}
                ]
            }, {
                it: 'should not report out of order but expected',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param xxx
                         * @param yyy
                         */
                        run: function(zzz, yyy) {
                        }
                    };
                },
                errors: [
                    {message: 'expected zzz but got xxx', column: 14, line: 3, rule: "jsDoc"}
                ]
            }
            /* jshint ignore:end */
        ]);

    });

});
