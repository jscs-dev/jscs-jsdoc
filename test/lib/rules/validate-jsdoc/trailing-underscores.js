describe('rules/validate-jsdoc enforce', function () {
    var cases = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    }).cases;

    describe('leading-underscores', function () {

        cases([
            /* jshint ignore:start */
            {
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
                errors: [{ line: 6, column: 0, message: "Method access doesn't match", rule: "jsDoc" }]
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
                errors: 2
            }
            /* jshint ignore:end */
        ]);

    });

    describe('trailing-underscores', function () {

        cases([
            /* jshint ignore:start */
            {
                it: 'should report enforcing @private on trailing underscores',
                rules: {trailingUnderscoreAccess: 'private'},
                errors: 1,
                code: function () {
                    /**
                     * @protected
                     */
                    function funcName_(p) {
                    }
                }
            }, {
                it: 'should report @private/@protected absent',
                rules: {trailingUnderscoreAccess: true},
                errors: 1,
                code: function () {
                    /**
                     * yolo
                     */
                    function funcName_(p) {

                    }
                }
            }, {
                it: 'should not report @private/@protected absent',
                rules: {trailingUnderscoreAccess: true},
                code: function () {
                    /**
                     * @private
                     */
                    function funcName_(p) {
                    }

                    /**
                     * @protected
                     */
                    function funcName_(p) {
                    }
                }
            }, {
                it: 'should not report @private on trailing underscores',
                rules: {trailingUnderscoreAccess: 'protected'},
                code: function () {
                    /**
                     * @protected
                     */
                    function funcName_(p) {
                    }
                }
            }, {
                it: 'should not report wrong access on leading underscores',
                rules: {trailingUnderscoreAccess: 'protected'},
                code: function () {
                    /**
                     * @protected
                     */
                    function _funcName(p) {
                    }
                }
            }
            /* jshint ignore:end */
        ]);

    });
});
