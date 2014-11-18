describe('lib/rules/validate-jsdoc/require-param-types', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({requireParamTypes: undefined});
            }).to.throws(/accepted value/i);
        });

        it('should report with an object', function() {
            global.expect(function() {
                checker.configure({requireParamTypes: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('with true', function() {
        checker.rules({requireParamTypes: true});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report',
                code: function() {
                    function yay(yey) {
                    }
                }
            }, {
                it: 'should report missing jsdoc-param type for function',
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
                it: 'should report missing jsdoc-param type for method',
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
                it: 'should not report valid jsdoc with object type for method',
                code: function () {
                    var x = 1;
                    /**
                     * @param {{foo: string}} xxx
                     */
                    function funcName(xxx) {
                        // dummy
                    }
                }
            }, {
                it: 'should not report valid jsdoc with object type for function',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param {{foo: string}} xxx
                         */
                        run: function(xxx) {
                            // dummy
                        }
                    };
                }
            }
            /* jshint ignore:end */
        ]);

    });

});
