describe('lib/rules/validate-jsdoc/check-redundant-access', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('configured', function() {

        it('with undefined should throws', function() {
            global.expect(function() {
                checker.configure({checkRedundantAccess: undefined});
            }).to.throws(/accepted value/i);
        });

        it('with undefined should throws', function() {
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
                it: 'should not throw',
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

});
