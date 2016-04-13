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
                    line: 1,
                    column: 0
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
                    line: 1,
                    column: 0
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
                    line: 1,
                    column: 0
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
                    line: 1,
                    column: 0
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
                    line: 1,
                    column: 0
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
                     */
                    function fun(p) {}
                },
                errors: 0
            }, {
                it: 'should report final non-word characters without dot',
                code: function () {
                    /**
                     * Some `description`
                     */
                    function fun(p) {}
                },
                errors: 1
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
                    line: 1,
                    column: 0
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
            }, {
                it: 'should not report inlined tags #180',
                code: function () {
                    /**
                     * Heading.
                     *
                     * This method uses the algorithm defined here:
                     * {@link http://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm}
                     */
                    function fun(p) {}
                }
            }, {
                it: 'should not report strings like "e.g." #145',
                code: function () {
                    /**
                     * Checks if token is part of an @-word (e.g. `@import`, `@include`).
                     */
                    function fun(p) {}
                }
            }, {
                it: 'should not report sentences ending with dots inside quotes',
                code: function () {
                    /**
                     * He said: "mickey."
                     */
                    function fun(p) {}
                }
            }, {
                it: 'should not report sentences ending with dots inside quotes',
                code: function () {
                    /**
                     * She said "Mickey." but he asked her to shut up.
                     */
                    function fun(p) {}
                }
            }, {
                it: 'should not report sentences with periods inside quotes',
                code: function () {
                    /**
                     * "r2. d2".
                     */
                    function fun(p) {}
                }
            }, {
                it: 'should not report correct sentences formatted as lists',
                code: function () {
                    /**
                     * Foo
                     * `bar`.
                     *
                     * Baz:
                     *
                     * - qux
                     * - Zot
                     * - Qux
                     * - zot
                     */
                    function quux() {}
                }
            }, {
                it: 'should not report sentences with html tags inside',
                code: function () {
                    /**
                     * A foo is assigned the boolean value <p>true</p>.
                     */
                    function fun(p) {}
                }
            }, {
                it: 'should not report sentences that are html code',
                code: function () {
                  /**
                   * The html code here
                   * <body>
                   *  <p> Hello world!</p>
                   * </body>
                   * Should always be there.
                   * And the first letter of this line is in
                   * uppercase.
                   */
                  function fun(p) {}
                }
            }
            /* jshint ignore:end */
        ]);

    });

});
