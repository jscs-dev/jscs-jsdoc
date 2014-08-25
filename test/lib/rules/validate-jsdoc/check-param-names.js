describe('rules/validate-jsdoc @param', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });
    checker.rules({checkParamNames: true});

    describe('common', function () {

        checker.cases([
            /* jshint ignore:start */
            {
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
            }
            /* jshint ignore:end */
        ]);

    });

    describe('param-names', function () {

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

    });

    describe('param-names location', function () {

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
                errors: {line: 3, column: 3}
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
                errors: {line: 3, column: 7}
            }
            /* jshint ignore:end */
        ]);

    });

});
