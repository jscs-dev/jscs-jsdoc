describe('lib/rules/validate-jsdoc/enforce-existence', function () {
    var checker = global.checker({
        plugins: ['./lib/index']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({enforceExistence: undefined});
            }).to.throws(/jsDoc.enforceExistence rule was not configured properly/i);
        });

        it('should report with an object', function() {
            global.expect(function() {
                checker.configure({enforceExistence: {allExcept: 'something invalid'}});
            }).to.throws(/jsDoc.enforceExistence rule was not configured properly/i);
        });

    });

    describe('with false', function() {
        checker.rules({enforceExistence: false});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report jsdocs existence for function',
                code: function () {
                    function funcName(p) {
                    }
                }
            }
            /* jshint ignore:end */
        ]);
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
            }, {
                it: 'should report jsdocs existence for module.exports anonymous function',
                code: function () {
                    module.exports = function () {
                    };
                },
                errors: 1
            }
            /* jshint ignore:end */
        ]);

    });

    describe('with exceptExports', function() {
        checker.rules({enforceExistence: 'exceptExports'});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report jsdocs existence for module.exports anonymous function',
                code: function () {
                    module.exports = function () {
                    };
                }
            }
            /* jshint ignore:end */
        ]);
    });

    describe('with allExcept exports', function() {
        checker.rules({enforceExistence: {allExcept: ['exports']}});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report jsdocs existence for export functions',
                errors: 0,
                code: function () {
                    module.exports = function () {
                    };
                }
            }
            /* jshint ignore:end */
        ]);
    });

    describe('with allExcept expressions', function() {
        checker.rules({enforceExistence: {allExcept: ['expressions']}});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report jsdocs existence for expression functions',
                code: function () {
                    var x = function () {
                    };
                }
            }
            /* jshint ignore:end */
        ]);
    });

    describe('with allExcept exports and expressions', function() {
        checker.rules({enforceExistence: {allExcept: ['exports', 'expressions']}});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report jsdocs existence for expression functions',
                code: function () {
                    var x = function () {
                    };
                }
            }, {
                it: 'should not report jsdocs existence for export',
                code: function () {
                    module.exports = function () {
                    };
                }
            }
            /* jshint ignore:end */
        ]);
    });

	describe('with allExcept paramless-procedures', function() {
		checker.rules({enforceExistence: {allExcept: ['paramless-procedures']}});

		checker.cases([
			/* jshint ignore:start */
			{
				it: 'should not report jsdocs absence for function expressions without parameters',
				code: function () {
					var functionalExpression = function () {
					};
				}
			}, {
				it: 'should not report jsdocs absence for function declarations without parameters',
				code: function () {
					function func() {
					}
				}
			}, {
				it: 'should not report jsdocs absence for function expressions with undefined returns',
				code: function () {
					var functionalExpression = function () {
						return;
					};
					var functionalExpressionNoReturn = function () {
                        /** @returns {number}*/
                        var nestedHasReturn = function () {
                            return 1;
                        };
					};
				}
			}, {
				it: 'should report jsdocs absence for function expressions with defined returns',
				code: function () {
					var functionalExpression = function () {
						return false;
					};
                    var functionalExpressionNoReturn = function () {
                        var nestedHasReturn = function () {
                            return 1;
                        };
                    };
				},
				errors: 2
			}, {
				it: 'should not report jsdocs absence for function declarations with undefined returns',
				code: function () {
					function func() {
						return;
					}
					function noReturn() {
						/** @returns {number}*/
						function nestedHasReturn() {
							return 1;
						}
					}
				}
			}, {
				it: 'should report jsdocs absence for function declarations with defined returns',
				code: function () {
					function func() {
						return false;
					}
                    function noReturn() {
                        function nestedHasReturn() {
                            return 1;
                        }
                    }
				},
				errors: 2
			}
			/* jshint ignore:end */
		]);
	});
});
