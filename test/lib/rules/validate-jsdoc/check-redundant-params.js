describe('lib/rules/validate-jsdoc/check-redundant-params', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
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
            }
            /* jshint ignore:end */
        ]);

    });

});
