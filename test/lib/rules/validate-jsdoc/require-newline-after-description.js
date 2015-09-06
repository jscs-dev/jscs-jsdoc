describe('lib/rules/validate-jsdoc/require-newline-after-description', function () {
    var checker = global.checker({
        plugins: ['.']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({requireNewlineAfterDescription: undefined});
            }).to.throws(/accepted value/i);
        });

        it('should report with an object', function() {
            global.expect(function() {
                checker.configure({requireNewlineAfterDescription: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('with true', function() {
        checker.rules({requireNewlineAfterDescription: true});

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
                it: 'should report newline absence after description',
                code: function () {
                    /**
                     * Some description
                     * @param {number} p description without hyphen
                     */
                    function fun(p) {
                    }
                },
                errors: {
                    line: 2,
                    column: 19
                },
            }, {
                it: 'should not report newline after description',
                code: function () {
                    /**
                     * Some description.
                     * Get me higher and higher!
                     *
                     * @param {number} p description without hyphen
                     */
                    function fun(p) {}
                }
            }
            /* jshint ignore:end */
        ]);

    });

});
