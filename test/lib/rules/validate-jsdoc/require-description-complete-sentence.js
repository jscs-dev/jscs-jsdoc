describe('lib/rules/validate-jsdoc/require-description-complete-sentence', function () {
    var checker = global.checker({
        plugins: ['.']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({requireDescriptionCompleteSentence: undefined});
            }).to.throws(/accepted value/i);
        });

        it('should report with an object', function() {
            global.expect(function() {
                checker.configure({requireDescriptionCompleteSentence: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('with true', function() {
        checker.rules({requireDescriptionCompleteSentence: true});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report common cases',
                code: function() {
                    function fun(p) {
                    }

                    /**
                     * @param p
                     */
                    function fun(p) {
                    }
                }
            }, {
                it: 'should report missing period at end of description',
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
                    column: 18
                }
            }, {
                it: 'should report missing upper case letter followed by period',
                code: function () {
                    /**
                     * Some description. hola.
                     * @param {number} p description without hyphen
                     */
                    function fun(p) {
                    }
                },
                errors: {
                    line: 2,
                    column: 21
                }
            }, {
                it: 'should report missing period at end of multi line description',
                code: function () {
                    /**
                     * Some description
                     * that takes up multiple lines
                     * @param {number} p description without hyphen
                     */
                    function fun(p) {
                    }
                },
                errors: {
                    line: 3,
                    column: 30
                }
            }, {
                it: 'should report missing period if upper case letter follows',
                code: function () {
                    /**
                     * Some description
                     * That takes up multiple lines.
                     * @param {number} p description without hyphen
                     */
                    function fun(p) {
                    }
                },
                errors: {
                    line: 3,
                    column: 3
                }
            }, {
                it: 'should report missing upper case at beginning of description',
                code: function () {
                    /**
                     * some description.
                     * @param {number} p description without hyphen
                     */
                    function fun(p) {
                    }
                },
                errors: {
                    line: 2,
                    column: 3
                },
            }, {
                it: 'should not report missing period or missing upper case letter',
                code: function () {
                    /**
                     * Some description.
                     *
                     * @param {number} p description without hyphen
                     */
                    function fun(p) {}
                }
            }, {
                it: 'should report trailing white-space',
                code: function () {
                    /**
                     * Some description .
                     *
                     * @param {number} p description without hyphen
                     */
                    function fun(p) {}
                },
                errors: 1
            }, {
                it: 'should not report final non-word characters',
                code: function () {
                    /**
                     * Some `description`.
                     *
                     * @param {number} p description without hyphen
                     */
                    function fun(p) {}
                },
                errors: 0
            }, {
                it: 'should report missing period at end of first line',
                code: function () {
                    /**
                     * Some description
                     *
                     * More description.
                     * @param {number} p description without hyphen
                     */
                    function fun(p) {
                    }
                },
                errors: {
                    line: 2,
                    column: 18
                }
            }, {
                it: 'should not report missing period',
                code: function () {
                    /**
                     * Some description
                     * which is continued on the next line.
                     * @param {number} p description without hyphen
                     */
                    function fun(p) {}
                }
            }
            /* jshint ignore:end */
        ]);

    });

});
