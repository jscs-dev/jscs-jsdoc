describe('lib/rules/validate-jsdoc/require-hyphen-before-description', function () {
    var checker = global.checker({
        plugins: ['.']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({requireHyphenBeforeDescription: undefined});
            }).to.throws(/accepted value/i);
        });

        it('should report with an object', function() {
            global.expect(function() {
                checker.configure({requireHyphenBeforeDescription: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('with true', function() {
        checker.rules({requireHyphenBeforeDescription: true});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report',
                code: function() {
                    function yay(yey) {
                    }

                    /**
                     * @param {number} yay
                     */
                    function yey(yay) {
                    }
                }
            }, {
                it: 'should report invalid description (without a hyphen)',
                code: function () {
                    /**
                     * @param {number} yay description without hyphen
                     */
                    function yey(yay) {
                    }
                },
                errors: 1
            }, {
                it: 'should not report valid description (with hyphen)',
                code: function () {
                    /**
                     * @param {number} yay - description without hyphen
                     */
                    function yey(yay) {
                    }
                }
            }, {
                it: 'should not report if description started with newline',
                code: function () {
                    /**
                     * @param {number} yay
                     * Description without hyphen.
                     */
                    function yey(yay) {
                    }
                }
            }, {
                it: 'should report if description has newline inside',
                errors: 1,
                code: function () {
                    /**
                     * @param {number} yay Started on the original line
                     *   without hyphen should be reported.
                     */
                    function yey(yay) {
                    }
                }
            }, {
                it: 'should not report if description has newline inside (with hyphen)',
                code: function () {
                    /**
                     * @param {number} yay - Started on the original line
                     *   without hyphen should be reported.
                     */
                    function yey(yay) {
                    }
                }
            }
            /* jshint ignore:end */
        ]);

    });

});
