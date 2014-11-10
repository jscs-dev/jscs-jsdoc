describe('lib/rules/validate-jsdoc/enforce-existence', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('configured', function() {

        it('with undefined should throws', function() {
            global.expect(function() {
                checker.configure({enforceExistence: undefined});
            }).to.throws(/accepted value/i);
        });

        it('with undefined should throws', function() {
            global.expect(function() {
                checker.configure({enforceExistence: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('with true', function() {
        checker.rules({enforceExistence: true});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should report jsdoc absence',
                errors: 1,
                code: function () {
                    var x = 1;
                    function funcName(p) {}
                }
            }, {
                it: 'still should report jsdoc absence',
                errors: 1,
                code: function () {
                    function _funcName(p) {}
                }
            }, {
                it: 'should not report jsdoc absence',
                code: function () {
                    /**
                     * yolo
                     */
                    function funcName(p) {
                    }

                    /**
                     * @param {Object} p
                     */
                    function funcName(p) {
                    }
                }
            }, {
                it: 'should report jsdoc absence for function expressions',
                errors: 1,
                code: function () {
                    var myFunc = function (v) {
                    };
                }
            }, {
                it: 'should not report jsdoc absence for anonymous functions',
                code: function () {
                    [].forEach(function (v) {
                    });
                }
            }, {
                it: 'should report nested jsdoc absence',
                errors: 4,
                code: function () {
                    var MyNamespace = MyNamespace || {};

                    MyNamespace.Test = function () {
                    };

                    MyNamespace.Test.Sub = {
                        yellow: function () {
                        }
                    };

                    (function () {
                        MyNamespace.Test.prototype.foo = function() {
                            function bar() {
                            }
                        };
                    })();
                }
            }, {
                it: 'shouldn\'t report nested jsdocs existence',
                code: function () {
                    var MyNamespace = MyNamespace || {};

                    /**
                     * Test
                     */
                    MyNamespace.Test = function () {
                    };

                    MyNamespace.Test.Sub = {
                        /**
                         * yellow submarine
                         */
                        yellow: function () {
                        }
                    };

                    (function () {
                        /**
                         * Test.foo
                         */
                        MyNamespace.Test.prototype.foo = function() {
                            /**
                             * bar
                             */
                            function bar() {
                            }
                        };
                    })();
                }
            }
            /* jshint ignore:end */
        ]);

    });
});
