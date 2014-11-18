describe('lib/rules/validate-jsdoc/require-hyphen-before-description', function () {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('configured', function() {

        it('with undefined should throws', function() {
            global.expect(function() {
                checker.configure({requireHyphenBeforeDescription: undefined});
            }).to.throws(/accepted value/i);
        });

        it('with undefined should throws', function() {
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
                it: 'should not throw',
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

            }
            /* jshint ignore:end */
        ]);

    });

});
