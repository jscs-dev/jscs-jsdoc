describe('lib/rules/validate-jsdoc/disallow-newline-after-description', function () {
    var checker = global.checker({
        plugins: ['.']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({disallowNewlineAfterDescription: undefined});
            }).to.throws(/accepted value/i);
        });

        it('should report with an object', function() {
            global.expect(function() {
                checker.configure({disallowNewlineAfterDescription: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('with true', function() {
        checker.rules({disallowNewlineAfterDescription: true});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report common cases',
                code: function() {
                    function fun(p) {
                    }

                    /**
                     * Description
                     */
                    function fun(p) {
                    }

                    /**
                     * @param p
                     */
                    function fun(p) {
                    }
                }
            }, {
                it: 'should node report newline absence after description',
                code: function () {
                    /**
                     * Some description
                     * @param {number} p description without hyphen
                     */
                    function fun(p) {
                    }
                },
            }, {
                it: 'should report newline after description',
                code: function () {
                    /**
                     * Some description.
                     * Get me higher and higher!
                     *
                     * @param {number} p description without hyphen
                     */
                    function fun(p) {}
                },
                errors: {
                    line: 4,
                    column: 3
                },
            }
            /* jshint ignore:end */
        ]);

    });

});
