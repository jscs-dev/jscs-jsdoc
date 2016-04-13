describe('lib/rules/validate-jsdoc/check-param-names', function() {
    var checker = global.checker({
        plugins: ['./lib/index']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({checkParamNames: undefined});
            }).to.throws(/accepted value/i);
        });

        it('should report with an object', function() {
            global.expect(function() {
                checker.configure({checkParamNames: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('with true', function() {
        checker.rules({checkParamNames: true});

        checker.cases([
            /* jshint ignore:start */
            // jscs:disable
            {
                it: 'should not report',
                code: function() {
                    function yay(yey) {
                    }

                    /**
                     * @param {number} yay
                     * @param {string} bar this shouldn't throw
                     */
                    function yey(yay) {
                    }
                }
            }, {
                it: 'should report invalid jsdoc',
                code: function () {
                    var x = 1;
                    /**
                     * @param
                     */
                    function funcName(xxx) {
                    }
                },
                errors: 1
            }, {
                it: 'should report error in jsdoc for function',
                code: function () {
                    var x = 1;
                    /**
                     * @param {String} yyy
                     */
                    function funcName(xxx) {
                    }
                },
                errors: 1
            }, {
                it: 'should report error in jsdoc with default param for function (readme, #154)',
                code: function () {
                    /**
                     * @param {String} msg
                     * @param {Number} [line]
                     */
                    function method(message) {
                    }
                },
                errors: 1
            }, {
                it: 'should report error in jsdoc for method',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param {String} yyy
                         */
                        run: function(xxx) {
                        }
                    };
                },
                errors: 1
            }, {
                it: 'should not report valid jsdoc for method',
                code: function () {
                    var x = 1;
                    /**
                     * @param {String} xxx
                     */
                    function funcName(xxx) {
                    }
                }
            }, {
                it: 'should not report valid jsdoc for function',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param {String} xxx
                         */
                        run: function(xxx) {
                        }
                    };
                }
            }
            // jscs:enable
            /* jshint ignore:end */
        ]);

        // locations
        checker.cases([
            /* jshint ignore:start */
            // jscs:disable
            {
                it: 'should report error in jsdoc for function',
                code: function () {
                    var x = 1;
                    /**
                     * @param {String} yyy
                     */
                    function funcName(xxx) {
                    }
                },
                errors: {line: 3, column: 19}
            }, {
                it: 'should report error in jsdoc for method',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param {String} yyy
                         */
                        run: function(xxx) {
                        }
                    };
                },
                errors: {line: 3, column: 23}
            }
            // jscs:enable
            /* jshint ignore:end */
        ]);

        // out-of-order. issue #33
        checker.cases([
            /* jshint ignore:start */
            /* jscs:disable */
            {
                it: 'should report out of order',
                code: function () {
                    /**
                     * @param xxx
                     * @param yyy
                     */
                    function funcName(yyy, xxx) {
                    }
                },
                errors: [
                    {
                        message: 'jsDoc: Parameters xxx and yyy are out of order',
                        column: 10,
                        line: 2,
                        rule: "jsDoc",
                        filename: "input",
                        fixed: undefined
                    }
                ]
            }, {
                it: 'should report out of order many times',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param xxx
                         * @param yyy
                         * @param zzz
                         */
                        run: function(zzz, xxx, yyy) {
                        }
                    };
                },
                errors: [
                    {
                        message: 'jsDoc: Parameters xxx and zzz are out of order',
                        column: 14,
                        line: 3,
                        rule: "jsDoc",
                        filename: "input",
                        fixed: undefined
                    },
                    {
                        message: 'jsDoc: Parameters yyy and xxx are out of order',
                        column: 14,
                        line: 4,
                        rule: "jsDoc",
                        filename: "input",
                        fixed: undefined
                    }
                ]
            }, {
                it: 'should report out of order and expected',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param xxx
                         * @param yyy
                         */
                        run: function(zzz, xxx) {
                        }
                    };
                },
                errors: [
                    {message: 'jsDoc: Parameter xxx is out of order', column: 14, line: 3, rule: "jsDoc", filename: "input", fixed: undefined},
                    {message: 'jsDoc: Expected xxx but got yyy', column: 14, line: 4, rule: "jsDoc", filename: "input", fixed: undefined}
                ]
            }, {
                it: 'should report out of order and expected v2',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param xxx
                         * @param yyy
                         */
                        run: function(yyy, zzz) {
                        }
                    };
                },
                errors: [
                    {message: 'jsDoc: Expected yyy but got xxx', column: 14, line: 3, rule: "jsDoc", filename: "input", fixed: undefined},
                    {message: 'jsDoc: Parameter yyy is out of order', column: 14, line: 4, rule: "jsDoc", filename: "input", fixed: undefined}
                ]
            }, {
                it: 'should not report out of order but expected',
                code: function () {
                    Cls.prototype = {
                        /**
                         * @param xxx
                         * @param yyy
                         */
                        run: function(zzz, yyy) {
                        }
                    };
                },
                errors: [
                    {message: 'jsDoc: Expected zzz but got xxx', column: 14, line: 3, rule: "jsDoc", filename: "input", fixed: undefined}
                ]
            }, {
                it: 'should not report wrong order',
                code: function() {
                    /**
                     * @param {string|Array.<string>} types
                     * @param {function(this: DocComment, DocTag): DocComment} fn
                     */
                    function iterateByTypes(types, fn) {}
                }
            }
            // jscs:enable
            /* jshint ignore:end */
        ]);

        // ticked and chevroned param names
        checker.cases([
            /* jshint ignore:start */
            /* jscs:disable */
            {
                it: 'should not report simple ticked param',
                code: function() {
                    /**
                     * @param {String} `message`
                     */
                    function methodOne(message) {}
                }
            }, {
                it: 'should not report chevroned params',
                code: function() {
                    /**
                     * @param {String} <required>
                     * @param {Object} [optional]
                     */
                    function methodTwo(required, optional) {}
                }
            }, {
                it: 'should not report ticked params',
                code: function() {
                    /**
                     * @param {String} `<required>`
                     * @param {Object} `[optional="abcabc"]`
                     */
                    function methodThree(required, optional) {}
                }
            }
            // jscs:enable
            /* jshint ignore:end */
        ]);

        // dotted param names
        checker.cases([
            /* jshint ignore:start */
            /* jscs:disable */
            {
                it: 'should not report dotted param names',
                code: function() {
                    /**
                     * Declares modifier
                     * @param {Object} mod
                     * @param {String} mod.modName
                     * @param {String|Boolean|Array} [mod.modVal]
                     * @param {Object} props
                     * @param {Object} [staticProps]
                     */
                    function yeah(mod, props, staticProps) {}
                }
            }, {
                it: 'should report inconsistency of separated dotted params',
                code: function() {
                    /**
                     * @param {Object} options
                     * @param {String} definetelyNotOptions.cdir
                     * @param {Boolean} otherOptions.noLog
                     */
                    module.exports.createMiddleware = function(options) { /* ... */ };
                },
                errors: [
                    {
                        column: 19,
                        filename: 'input',
                        line: 3,
                        message: 'jsDoc: Expected `options` but got `definetelyNotOptions`',
                        rule: 'jsDoc',
                        fixed: undefined
                    },
                    {
                        column: 20,
                        filename: 'input',
                        line: 4,
                        message: 'jsDoc: Expected `options` but got `otherOptions`',
                        rule: 'jsDoc',
                        fixed: undefined
                    }
                ]
            }, {
                it: 'should report unjoined params',
                code: function() {
                    /**
                     * @param {String} options.cdir
                     */
                    module.exports.createMiddleware = function() { /* ... */ };
                },
                errors: { "message": "jsDoc: Inconsistent param found" }
            }, {
                it: 'should not report params',
                code: function() {
                    /**
                     * @param {Object} options
                     * @param {String} options.cdir
                     */
                    module.exports.createMiddleware = function() { /* ... */ };
                },
                errors: []
            }, {
                it: 'should not report declared optional params',
                code: function() {
                    /**
                     * Example function
                     * @param {Object} options - some options
                     * @param {number} options.id - some id
                     * @param {Go} [optional] - optional param
                     * @param {Go=} optional2 - another optional param
                     * @param {Array} rest - rest arguments
                     */
                    function hello(options, optional, optional2, rest) {
                    }
                },
                errors: []
            }
            /* jscs: enable */
            /* jshint ignore:end */
        ]);

    });

    describe('with destructurings', function() {
        var checker = global.checker({
            plugins: ['./lib/index']
        });
        checker.rules({checkParamNames: true});

        checker.cases([
            /* jshint ignore:start */
            // jscs:disable
            {
                it: 'should not report missing parameter name for object destructurings',
                code: [
                    '/**',
                    ' * @param {object}',
                    ' */',
                    'function obj({param}) {',
                    '}'
                ].join('\n')
            }, {
                it: 'should not report missing parameter name for object destructurings',
                code: [
                    '/**',
                    ' * @param {object}',
                    ' */',
                    'function obj({param: newName}) {',
                    '}'
                ].join('\n')
            }, {
                it: 'should not fail if a fake parameter name is provided',
                code: [
                    '/**',
                    ' * @param {object} fakeName - description',
                    ' */',
                    'function obj({param}) {',
                    '}'
                ].join('\n')
            }, {
                it: 'should not fail if a fake parameter name and property description is provided',
                code: [
                    '/**',
                    ' * @param {object} fakeName - description',
                    ' * @param {object} fakeName.param - description',
                    ' */',
                    'function obj({param}) {',
                    '}'
                ].join('\n')
            }, {
                it: 'should report different fake parameter name',
                code: [
                    '/**',
                    ' * @param {object} fakeName - description',
                    ' * @param {object} notFakeName.param - description',
                    ' */',
                    'function obj({param}) {',
                    '}'
                ].join('\n'),
                errors: [
                    {
                        column: 19,
                        filename: 'input',
                        line: 3,
                        message: 'jsDoc: Expected `fakeName` but got `notFakeName`',
                        rule: 'jsDoc',
                        fixed: undefined
                    }
                ]
            }, {
                it: 'should not report an error when used next to parameters with properties',
                code: [
                    '/**',
                    ' * @param {object} obj1',
                    ' * @param {string} obj1.property',
                    ' * @param {object}',
                    ' * @param {object} obj2',
                    ' * @param {string} obj2.property',
                    ' */',
                    'function obj(obj1, {param}, obj2) {',
                    '}'
                ].join('\n')
            }, {
                it: 'should not report missing parameter name for array destructurings',
                code: [
                    '/**',
                    ' * @param {array}',
                    ' */',
                    'function arr([param]) {',
                    '}'
                ].join('\n')
            }
            // jscs:enable
            /* jshint ignore:end */
        ]);

    });

});
