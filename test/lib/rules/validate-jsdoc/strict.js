describe('rules/validate-jsdoc enforce', function () {
    var cases = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    }).cases;

    describe('strict', function () {

        cases([
            /* jshint ignore:start */
            {
                it: 'should report confusing multiaccess',
                rules: {strict: true},
                errors: 1,
                code: function () {
                    /**
                     * @protected
                     * @access private
                     */
                    function _funcName(p) {}
                }
            }, {
                it: 'should not report multiaccess if same',
                rules: {strict: true},
                code: function () {
                    /**
                     * @protected
                     * @access protected
                     */
                    function _funcName(p) {}
                }
            }
            /* jshint ignore:end */
        ]);

    });

});
