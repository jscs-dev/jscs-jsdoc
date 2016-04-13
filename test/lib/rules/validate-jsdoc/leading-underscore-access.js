describe('lib/rules/validate-jsdoc/leading-underscore-access', function () {
    var checker = global.checker({
        plugins: ['./lib/index']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({leadingUnderscoreAccess: undefined});
            }).to.throws(/accepted value/i);
        });

        it('should report with an object', function() {
            global.expect(function() {
                checker.configure({leadingUnderscoreAccess: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('common', function() {

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report',
                rules: {leadingUnderscoreAccess: true},
                code: function() {
                    function yay(yey) {
                    }
                }
            }, {
                it: 'should report enforcing @private on leading underscores',
                rules: {leadingUnderscoreAccess: 'private'},
                errors: 1,
                code: function () {
                    /**
                     * @protected
                     */
                    function _funcName(p) {
                    }
                }
            }, {
                it: 'should report @private/@protected absent',
                rules: {leadingUnderscoreAccess: true},
                errors: 1,
                code: function () {
                    /**
                     * yolo
                     */
                    function _funcName(p) {

                    }
                }
            }, {
                it: 'should not report @private/@protected absent',
                rules: {leadingUnderscoreAccess: true},
                code: function () {
                    /**
                     * @private
                     */
                    function _funcName(p) {
                    }

                    /**
                     * @protected
                     */
                    function _funcName(p) {
                    }
                }
            }, {
                it: 'should not report @protected on trailing underscores',
                rules: {leadingUnderscoreAccess: 'protected'},
                code: function () {
                    /**
                     * @protected
                     */
                    function _funcName(p) {
                    }
                }
            }, {
                it: 'should report correct line for @private/@protected absent',
                rules: {leadingUnderscoreAccess: true},
                code: function () {
                    /**
                     * @protected
                     */
                    function _funcName(p) {}

                    /**
                     * yolo
                     */
                    function _funcName(p) {}
                },
                errors: [{
                    line: 9,
                    column: 9,
                    message: 'jsDoc: Missing access tag for _funcName',
                    rule: 'jsDoc',
                    filename: 'input',
                    fixed: undefined
                }]
            }, {
                it: 'should skip anonymous',
                rules: {leadingUnderscoreAccess: true},
                code: function () {
                    /**
                     * @access private
                     */
                    (function (p) { return p; })
                }
            }, {
                it: 'should not report @private for object prop',
                rules: {leadingUnderscoreAccess: true},
                code: function () {
                    Cls = {
                        /**
                         * @access private
                         */
                        _privFunc: function (p) {
                        },

                        /**
                         * @access protected
                         */
                        _protFunc: function (p) {
                        },

                        /**
                         * @access public
                         */
                        func: function (p) {
                        }
                    };
                }
            }, {
                it: 'should report non-@protected for object prop',
                rules: {leadingUnderscoreAccess: 'protected'},
                code: function () {
                    Cls = {
                        /**
                         * @access private
                         */
                        _privFunc: function (p) {
                        },

                        /**
                         * @access public
                         */
                        _pubFunc: function (p) {
                        }
                    };
                },
                errors: 2
            }, {
                it: 'should not report in variables',
                rules: {leadingUnderscoreAccess: true},
                code: function () {
                    /**
                     * @access private
                     */
                    var _privFunc = function (p) {};

                    /**
                     * @access protected
                     */
                    var _protFunc = function (p) {};
                }
            }, {
                it: 'should report invalid access in variables',
                rules: {leadingUnderscoreAccess: 'protected'},
                code: function () {
                    /**
                     * @access private
                     */
                    var _privFunc = function (p) {};

                    /**
                     * @access public
                     */
                    var _pubFuncWithUnderscore = function (p) {};
                },
                errors: [{
                    column: 3, line: 2, filename: 'input', rule: 'jsDoc', fixed: undefined,
                    message: 'jsDoc: Method access doesn\'t match'
                }, {
                    column: 3, line: 7, filename: 'input', rule: 'jsDoc', fixed: undefined,
                    message: 'jsDoc: Method access doesn\'t match'
                }]
            }, {
                it: 'should not report standard idendifiers',
                rules: {leadingUnderscoreAccess: 'protected'},
                code: function () {
                    /**
                     * @access private
                     */
                    var super_ = function (p) {};

                    /**
                     * @access public
                     */
                    var __proto__ = function (p) {};
                }
            }, {
                it: 'should not report private functions. jscs-dev/node-jscs#1588',
                rules: {leadingUnderscoreAccess: 'private'},
                code: function () {
                    /**
                     * @access private
                     */
                    function _super(p) {};

                    /**
                     * @private
                     */
                    function _proto(p) {};
                }
            }, {
                it: 'should not report incorrect jsdoc with right tag. jscs-dev/node-jscs#1588',
                rules: {leadingUnderscoreAccess: 'private'},
                code: function() {
                    /**
                    * @private
                    **/
                    function _yay(yey) {
                    }
                }
            }, {
                it: 'should not report overriden methods. #114',
                rules: {leadingUnderscoreAccess: 'private'},
                code: function () {
                    /**
                     * @override
                     */
                    function _funcName(p) {
                    }
                }
            }, {
                it: 'should report overriden with wrong @access value. #114',
                rules: {leadingUnderscoreAccess: 'private'},
                code: function () {
                    /**
                     * @override
                     * @protected
                     */
                    function _funcName(p) {
                    }
                },
                errors: 1
            }
            /* jshint ignore:end */
        ]);

    });

});
