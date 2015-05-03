describe('lib/rules/validate-jsdoc/check-throws', function () {
    var checker = global.checker({
        plugins: ['./lib/index']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({checkThrows: undefined});
            }).to.throws(/accepted value/i);
        });

        it('should report with an object', function() {
            global.expect(function() {
                checker.configure({checkThrows: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('with true', function() {
        checker.rules({checkThrows: true});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report method without @throws',
                code: function () {
                    /**
                     * empty jsdoc
                     */
                    function fun () {}
                }
            }, {
                it: 'should not report throwing error',
                code: function () {
                    /**
                     * @throws {Error}
                     */
                    function fun () {
                        throw Error('Yolo');
                    }
                }
            }, {
                it: 'should not report throwing new error',
                code: function () {
                    /**
                     * @throws {Error}
                     */
                    function fun () {
                        throw new Error('Yolo');
                    }
                }
            }, {
                it: 'should not report untyped declaration',
                code: function () {
                    /**
                     * @throws Maybe
                     */
                    function fun () {
                        throw 'For sure';
                    }
                }

            }, {
                it: 'should report method with throw and without @throws',
                errors: 1,
                code: function () {
                    /**
                     * empty jsdoc
                     */
                    function fun () {
                        throw 'Anything';
                    }
                }

            }, {
                it: 'should report wrong throw type',
                errors: 1,
                code: function () {
                    /**
                     * @throws {SomethingElse}
                     */
                    function fun () {
                        throw Error('Yolo');
                    }
                }
            }, {
                it: 'should report wrong throw type for strings',
                errors: 1,
                code: function () {
                    /**
                     * @throws {SomethingElse}
                     */
                    function fun () {
                        throw 'For sure';
                    }
                }
            }, {
                it: 'should report several @throws per method',
                errors: 1,
                code: function () {
                    /**
                     * @throws {Errors}
                     * @throws {SomethingElse}
                     */
                    function fun () {}
                }

            }, {
                it: 'should not report correct throws',
                code: function () {
                    /**
                     * @throws {SomeError|SomethingElse|AnotherOne}
                     */
                    function fun (q) {
                        if (q === 1) {
                            throw SomeError();
                        } else if (q === 2) {
                            throw SomethingElse();
                        } else {
                            throw AnotherOne();
                        }
                    }
                }
            }, {
                it: 'should report incorrect types for @throws',
                errors: 2,
                code: function () {
                    /**
                     * @throws {SomethingElse|AnotherOne}
                     */
                    function fun (q) {
                        throw q ? SomeError() : 'untyped';
                    }
                }
            }
            /* jshint ignore:end */
        ]);

    });

    describe.skip('with abstractShouldThrow', function() {
        checker.rules({checkThrows: 'abstractShouldThrow'});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not report abstract method with throw',
                code: function () {
                    /**
                     * @abstract
                     * @return {number}
                     */
                    function fun () {
                        throw Error('Yolo');
                    }
                }
            }, {
                it: 'should report abstract method without throw',
                errors: 1,
                code: function () {
                    /**
                     * @abstract
                     * @return {number}
                     */
                    function fun () {}
                }
            }
            /* jshint ignore:end */
        ]);

    });
});
