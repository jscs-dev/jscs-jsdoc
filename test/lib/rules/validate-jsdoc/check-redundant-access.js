describe('rules/validate-jsdoc', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('check-redundant-access', function () {

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
