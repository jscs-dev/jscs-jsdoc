describe('rules/validate-jsdoc', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('check-return-types', function () {

        checker.rules({checkReturnTypes: true});
        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should neither throw nor report',
                code: function () {
                    /**
                     * @return {{a: number, b: string}}
                     */
                    function foo() {
                        return {};
                    }
                }
            }, {
                it: 'should report invalid @returns type in function',
                errors: 1,
                code: function() {
                    /**
                     * @returns {Object}
                     */
                    function funcName() {
                        return "";
                    }
                }
            }, {
                it: 'should not report valid resulting type with object type in method',
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
            }, {
                it: 'should not report valid resulting type with object type in function',
                code: function() {
                    /**
                     * @return {Object}
                     */
                    function funcName() {
                        return new Object();
                    }
                }
            }, {
                it: 'should not report comparition jsdoc type to any expression in function',
                code: function() {
                    /**
                     * @return {Object}
                     */
                    function funcName() {
                        return Object.create();
                    }
                    /**
                     * @return {string}
                     */
                    function funcName() {
                        return makeMyDay("zxc");
                    }
                }
            }, {
                it: 'should not report valid resulting array type for function',
                code: function() {
                    /**
                     * @return {Array}
                     */
                    function funcName() {
                        return [1, 2];
                    }
                    /**
                     * @return {Array}
                     */
                    function funcName() {
                        return new Array("zxc");
                    }
                }
            }, {
                it: 'should not report valid resulting regexp type for function',
                code: function() {
                    /**
                     * @return {RegExp}
                     */
                    function funcName() {
                        return /[a-z]+/i;
                    }
                    /**
                     * @return {RegExp}
                     */
                    function funcName() {
                        return new RegExp("[a-z]+", "i");
                    }
                }
            }, {
                it: 'should not report valid resulting array.<String> and Object[] for function',
                code: function() {
                    /**
                     * @return {String[]}
                     */
                    function funcName() {
                        return ["a", "b", "c"];
                    }
                    /**
                     * @return {Object[]}
                     */
                    function funcName() {
                        return [{}, {}];
                    }
                    /**
                     * @return {Array.<Number>}
                     */
                    function funcName() {
                        return [1, 2, 3];
                    }
                }
            }, {
                it: 'should not throw exception on `@returns {null|undefined}` directive. issue #7',
                code: function() {
                    /**
                     * @return {null}
                     */
                    function funcName() {
                        return null;
                    }
                    /**
                     * @return {undefined}
                     */
                    function funcName() {
                        return undefined;
                    }
                    /**
                     * @return {null|undefined}
                     */
                    function funcName(flag) {
                      if (flag) {
                        return null;
                      }
                      return undefined;
                    }
                }
            }, {
                it: 'should report on `@returns {null|undefined}` vs (string|number|regexp). issue #7',
                errors: 3,
                code: function() {
                    /**
                     * @return {null|undefined}
                     */
                    function funcName(flag) {
                      if (flag) {
                        return /qwe/i;
                      } else {
                        return 2;
                      }
                      return "";
                    }
                }
            }, {
                it: 'should report on `@returns {null|undefined}` vs (array|object). issue #7',
                errors: 2,
                code: function() {
                    /**
                     * @return {null|undefined}
                     */
                    function funcName(flag) {
                      if (flag) {
                        return [];
                      }
                      return {q: 1};
                    }
                }
            }, {
                it: 'should not report on `@returns {string|null}` vs (null). issue #8',
                code: function() {
                    /**
                     * @return {string|null}
                     */
                    function funcName(flag) {
                      if (!this.something) {
                        return null;
                      }
                    }
                    /**
                     * @return {?string}
                     */
                    function funcName(flag) {
                      if (!this.something) {
                        return null;
                      }
                    }
                }
            }, {
                it: 'should not report on `@returns {?number}` vs (null|number). issue #8',
                code: function() {
                    /**
                     * @return {number|null}
                     */
                    function funcName(flag) {
                      if (!this.something) {
                        return null;
                      }
                      return 3;
                    }
                    /**
                     * @return {?number}
                     */
                    function funcName(flag) {
                      if (!this.something) {
                        return null;
                      }
                      return 3;
                    }
                }
            }, {
                it: 'should not report on `@returns {foo.Bar}`. issue #16',
                code: function() {
                    module.exports = {
                        /**
                         * @return {foo.Bar}
                         */
                        foo: function () {
                            return new foo.Bar();
                        },
                        /**
                         * @return {foo.Bar.Baz}
                         */
                        bar: function () {
                            return new foo.Bar.Baz();
                        },
                        /**
                         * @return {foo.Bar.Baz|foo.Bar.Baz.Moo}
                         */
                        baz: function (t) {
                            if (t) {
                                return new foo.Bar.Baz.Moo();
                            }
                            return new foo.Bar.Baz();
                        }
                    };
                }
            }
            /* jshint ignore:end */
        ]);

    });

});
