describe('lib/rules/validate-jsdoc/require-param-description', function () {
    var checker = global.checker({
        plugins: ['./lib/index']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({requireParamDescription: undefined});
            }).to.throws(/accepted value/i);
        });

        it('should report with an object', function() {
            global.expect(function() {
                checker.configure({requireParamDescription: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('with true', function() {
        checker.rules({requireParamDescription: true});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report',
                code: function() {
                    function yay(yey) {
                    }
                }
            }, {
                it: 'should report missing jsdoc-param description for function',
                errors: 1,
                code: function () {
                    var x = 1;
                    /**
                     * @param xxx
                     */
                    function funcName(xxx) {
                        // dummy
                    }
                }
            }, {
                it: 'should report missing jsdoc-param description for method',
                errors: 1,
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param yyy
                         */
                        run: function(xxx) {
                            // dummy
                        }
                    };
                }
            }, {
                it: 'should not report invalid jsdoc for method',
                code: function () {
                    var x = 1;
                    /**
                     * @param {String} xxx description
                     */
                    function funcName(xxx) {
                        // dummy
                    }
                }
            }, {
                it: 'should not report invalid jsdoc for function',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param {String} xxx description
                         */
                        run: function(xxx) {
                            // dummy
                        }
                    };
                }
            }, {
                it: 'should not report invalid jsdoc with object type for method',
                code: function () {
                    var x = 1;
                    /**
                     * @param {{foo: string}} xxx description
                     */
                    function funcName(xxx) {
                        // dummy
                    }
                }
            }, {
                it: 'should not report invalid jsdoc with object type for function',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param {{foo: string}} xxx description
                         */
                        run: function(xxx) {
                            // dummy
                        }
                    };
                }
            }, {
                it: 'should not report invalid jsdoc with no param type for method',
                code: function () {
                    var x = 1;
                    /**
                     * @param xxx description
                     */
                    function funcName(xxx) {
                        // dummy
                    }
                }
            }, {
                it: 'should not report invalid jsdoc with no param type for function',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param xxx description
                         */
                        run: function(xxx) {
                            // dummy
                        }
                    };
                }
            }, {
                it: 'should report with right location',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param xxx
                         */
                        run: function(xxx) {
                            // dummy
                        }
                    };
                },
                errors: {column: 17, line: 3}
            }
            /* jshint ignore:end */
        ]);

    });

});
