describe('rules/validate-jsdoc enforce', function () {
    var cases = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    }).cases;

    describe('enforce-existance', function () {

        cases([
            /* jshint ignore:start */
            {
                it: 'should report jsdoc absence',
                rules: { enforce: true },
                errors: 1,
                code: function () {
                    var x = 1;
                    function funcName(p) {}
                }
            }, {
                it: 'still should report jsdoc absence',
                rules: { enforce: {} },
                errors: 1,
                code: function () {
                    function _funcName(p) {}
                }
            }, {
                it: 'should not report jsdoc absence',
                rules: { enforce: true },
                code: function () {
                    /**
                     * yolo
                     */
                    function funcName(p) {
                    }

                    /**
                     * @param {Object} p
                     */
                    function funcName(p) {
                    }
                }
            }
            /* jshint ignore:end */
        ]);

    });
});
