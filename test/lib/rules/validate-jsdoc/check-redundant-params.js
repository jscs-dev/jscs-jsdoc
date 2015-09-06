describe('lib/rules/validate-jsdoc/check-redundant-params', function () {
    var checker = global.checker({
        plugins: ['.']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({checkRedundantParams: undefined});
            }).to.throws(/accepted value/i);
        });

        it('should report with an object', function() {
            global.expect(function() {
                checker.configure({checkRedundantParams: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('with this', function() {
        checker.rules({checkRedundantParams: true});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report',
                code: function() {
                    function yay(yey) {
                    }
                }
            }, {
                it: 'should report redundant jsdoc-param for function',
                errors: 1,
                code: function () {
                    var x = 1;
                    /**
                     * @param {String} yyy
                     */
                    function funcName() {
                        // dummy
                    }
                }
            }, {
                it: 'should report redundant jsdoc-param for method',
                errors: 1,
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param {String} yyy
                         */
                        run: function () {
                            // dummy
                        }
                    };
                }
            }, {
                it: 'should not report redundant jsdoc-param for function',
                code: function () {
                    /**
                     * @param {Object} [elem] Nested element
                     * @param {String} [modName1, ..., modNameN] Modifier names
                     */
                    function funcName(elem) {
                        // dummy
                    }
                }
            }, {
                it: 'should not report valid jsdoc for method',
                code: function () {
                    var x = 1;
                    /**
                     * @param {String} xxx
                     */
                    function funcName(xxx) {
                        // dummy
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
                            // dummy
                        }
                    };
                }

            }, {
                it: 'should not report redundant params',
                code: function () {
                    /**
                     * Test
                     *
                     * @param {String} mystr
                     * @return {String}
                     */
                    exports.testStr = function(mystr) {
                        'use strict';
                        return mystr;
                    };
                }
            }, {
                it: 'should not report redundant params with variable params',
                code: function () {
                    /**
                     * Issue #62
                     * @param {function} callback function to call after the delay
                     * @param {number} delay delay in ms
                     * @param {...*} args arbitrary arguments for the callback function
                     */
                    function setTimeout(callback, delay) {}
                }
            }, {
                // issue #79
                it: 'should not report different names',
                code: function() {
                    /**
                     * Example function
                     * @param {Object} options - some options
                     * @param {number} options.id - some id
                     * @param {Array} rest - rest arguments
                     */
                    function hello(options, rest) {
                        return (options.filename) ? true : false;
                    }
                },
                errors: []
            }, {
                // issue #79
                it: 'should report with right location',
                code: function() {
                    /**
                     * @param {Object} options - some options
                     * @param {Array} rest - rest arguments
                     */
                    function hello(options) {
                    }
                },
                errors: [{
                    column: 3, line: 3, filename: 'input', rule: 'jsDoc', fixed: undefined,
                    message: 'Found redundant param "rest" statement'
                }]
            }, {
                it: 'should not report optional params',
                code: function() {
                    /**
                     * Example function
                     * @param {Object} options - some options
                     * @param {number} options.id - some id
                     * @param {Go} [optional] - optional param
                     * @param {Go=} optional2 - another optional param
                     * @param {Array} rest - rest arguments
                     */
                    function hello(options, rest) {
                    }
                },
                errors: []
            }, {
                it: 'should not report declared optional params',
                code: function() {
                    /**
                     * Example function
                     * @param {Object} options - some options
                     * @param {number} options.id - some id
                     * @param {Go} [optional] - optional param
                     * @param {Go=} optional2 - another optional param
                     * @param {Array} rest - rest arguments
                     */
                    function hello(options, optional, optional2, rest) {
                    }
                },
                errors: []
            }
            /* jshint ignore:end */
        ]);

    });

});
