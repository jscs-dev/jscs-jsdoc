describe('rules/validate-jsdoc', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('check-types', function () {

        checker.rules({checkTypes: true});
        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should neither throw nor report',
                skip: 1,
                code: function () {
                    /**
                     * @return {{a: number, b: string}}
                     */
                    function foo() {
                        return {};
                    }
                }
            }
            /* jshint ignore:end */
        ]);

    });

});
