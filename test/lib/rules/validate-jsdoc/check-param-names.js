describe('lib/rules/validate-jsdoc/check-param-names', function() {
    var checker = global.checker({
        plugins: ['./lib/index']
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
            // jscs:disable
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
            // jscs:enable
            /* jshint ignore:end */
        ]);

        // locations
        checker.cases([
            /* jshint ignore:start */
            // jscs:disable
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
            // jscs:enable
            /* jshint ignore:end */
        ]);

        // out-of-order. issue #33
        checker.cases([
            /* jshint ignore:start */
            /* jscs:disable */
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
                    {
                        message: 'parameters xxx and yyy are out of order',
                        column: 10,
                        line: 2,
                        rule: "jsDoc",
                        filename: "input"
                    }
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
                    {
                        message: 'parameters xxx and zzz are out of order',
                        column: 14,
                        line: 3,
                        rule: "jsDoc",
                        filename: "input"
                    },
                    {
                        message: 'parameters yyy and xxx are out of order',
                        column: 14,
                        line: 4,
                        rule: "jsDoc",
                        filename: "input"
                    }
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
                    {message: 'parameter xxx is out of order', column: 14, line: 3, rule: "jsDoc", filename: "input"},
                    {message: 'expected xxx but got yyy', column: 14, line: 4, rule: "jsDoc", filename: "input"}
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
                    {message: 'expected yyy but got xxx', column: 14, line: 3, rule: "jsDoc", filename: "input"},
                    {message: 'parameter yyy is out of order', column: 14, line: 4, rule: "jsDoc", filename: "input"}
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
                    {message: 'expected zzz but got xxx', column: 14, line: 3, rule: "jsDoc", filename: "input"}
                ]

            }, {
                it: 'should not report simple ticked param',
                code: function() {
                    /**
                     * @param {String} `message`
                     */
                    function methodOne(message) {}
                }
            }, {
                it: 'should not report chevroned params',
                code: function() {
                    /**
                     * @param {String} <required>
                     * @param {Object} [optional]
                     */
                    function methodTwo(required, optional) {}
                }
            }, {
                it: 'should not report ticked params',
                code: function() {
                    /**
                     * @param {String} `<required>`
                     * @param {Object} `[optional="abcabc"]`
                     */
                    function methodThree(required, optional) {}
                }
            }, {
                it: 'should not report dotted param names',
                code: function() {
                    /**
                     * Declares modifier
                     * @param {Object} mod
                     * @param {String} mod.modName
                     * @param {String|Boolean|Array} [mod.modVal]
                     * @param {Object} props
                     * @param {Object} [staticProps]
                     * @returns {Function}
                     */
                    function yeah(mod, props, staticProps) {}
                }
            }
            /* jscs: enable */
            /* jshint ignore:end */
        ]);

    });

});
