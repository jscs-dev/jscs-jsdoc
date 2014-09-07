describe('rules/validate-jsdoc', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('enforce-existence', function () {

        checker.rules({enforceExistence: true});
        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should report jsdoc absence',
                errors: 1,
                code: function () {
                    var x = 1;
                    function funcName(p) {}
                }
            }, {
                it: 'still should report jsdoc absence',
                errors: 1,
                code: function () {
                    function _funcName(p) {}
                }
            }, {
                it: 'should not report jsdoc absence',
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
            }, {
                it: 'should not report jsdoc absence for anonymous functions',
                code: function () {
                    [].forEach(function (v) {
                    });
                }
            }
            /* jshint ignore:end */
        ]);

    });
});
