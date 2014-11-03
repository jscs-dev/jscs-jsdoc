describe('rules/validate-jsdoc', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('basic checks', function () {

        checker.rules({checkReturnTypes: true});
        checker.cases([
            /* jshint ignore:start */
            {
                it: 'shouldn\'t throw',
                errors: 1,
                code: function () {
                    /**
                     * @return {Foo}
                     */
                    function getFoo() {
                        return new Bar();
                    }
                }
            }
            /* jshint ignore:end */
        ]);

    });
});
