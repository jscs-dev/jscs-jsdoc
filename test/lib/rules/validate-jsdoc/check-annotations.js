describe('lib/rules/validate-jsdoc/check-annotations', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('with true', function () {
        checker.rules({checkAnnotations: true});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should throw unavailable tag',
                errors: {message: 'unavailable tag ppublic'},
                code: function() {
                    /**
                     * @ppublic
                     */
                }
            }
            /* jshint ignore:end */
        ]);

    });

});
