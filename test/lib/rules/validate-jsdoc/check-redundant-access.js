describe('lib/rules/validate-jsdoc/check-redundant-access', function () {
    var checker = global.checker({
        plugins: ['./lib/index']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({checkRedundantAccess: undefined});
            }).to.throws(/accepted value/i);
        });

        it('should report with an object', function() {
            global.expect(function() {
                checker.configure({checkRedundantAccess: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('with true', function() {
        checker.rules({checkRedundantAccess: true});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report',
                code: function() {
                    function yay(yey) {
                    }
                }
            }, {
                it: 'should report confusing multiaccess',
                errors: 1,
                code: function () {
                    /**
                     * @protected
                     * @access private
                     */
                    function _funcName(p) {}
                }
            }, {
                it: 'should report multiaccess even if same',
                errors: 1,
                code: function () {
                    /**
                     * @protected
                     * @access protected
                     */
                    function _funcName(p) {}
                }
            }, {
                it: 'should not report old styled access',
                code: function () {
                    /**
                     * @protected
                     */
                    function _funcName(p) {}
                }
            }, {
                it: 'should not report valid jsdoc',
                code: function () {
                    /**
                     * @access protected
                     */
                    function _funcName(p) {}
                }
            }
            /* jshint ignore:end */
        ]);

    });

    describe('with enforceLeadingUnderscore ', function() {
        checker.rules({checkRedundantAccess: 'enforceLeadingUnderscore'});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report valid jsdoc',
                code: function () {
                    /**
                     * @access protected
                     */
                    function _funcName(p) {}
                },
                errors: []
            }, {
                it: 'should not force publics',
                code: function () {
                    /**
                     * @access public
                     */
                    function funcName(p) {}
                },
                errors: []
            }, {
                it: 'should report missing leading underscore',
                code: function () {
                    /**
                     * @access protected
                     */
                    function funcName(p) {}
                },
                errors: [{
                    line: 4, column: 9, filename: 'input', rule: 'jsDoc', fixed: undefined,
                    message: 'jsDoc: Missing leading underscore for funcName'
                }]
            }, {
                it: 'should not force unknown access',
                code: function () {
                    /**
                     * No access
                     */
                    function funcName(p) {}
                },
                errors: []
            }
            /* jshint ignore:end */
        ]);

    });

    describe('with enforceTrailingUnderscore', function() {
        checker.rules({checkRedundantAccess: 'enforceTrailingUnderscore'});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report valid jsdoc',
                code: function () {
                    /**
                     * @access protected
                     */
                    function funcName_(p) {}
                },
                errors: []
            }, {
                it: 'should not force publics',
                code: function () {
                    /**
                     * @access public
                     */
                    function funcName(p) {}
                },
                errors: []
            }, {
                it: 'should report missing leading underscore',
                code: function () {
                    /**
                     * @access protected
                     */
                    function funcName(p) {}
                },
                errors: [{
                    line: 4, column: 9, filename: 'input', rule: 'jsDoc', fixed: undefined,
                    message: 'jsDoc: Missing trailing underscore for funcName'
                }]
            }
            /* jshint ignore:end */
        ]);

    });

});
