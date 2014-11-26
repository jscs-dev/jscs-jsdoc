describe('lib/rules/validate-jsdoc/check-types', function() {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({checkTypes: undefined});
            }).to.throws(/accepted value/i);
        });

        it('should report with an object', function() {
            global.expect(function() {
                checker.configure({checkTypes: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('with true', function() {
        checker.rules({checkTypes: true});

        checker.cases([
            /* jshint ignore:start *//* jscs: disable */
            {
                it: 'should not report',
                code: function() {
                    function yay(yey) {
                    }
                }
            }, {
                it: 'should report invalid typedef',
                errors: 1,
                code: function() {
                    /**
                     * @typedef {something/invalid} name
                     */
                }
            }, {
                it: 'should not report empty valid typedef',
                code: function() {
                    /**
                     * @typedef alphanum
                     */
                }
            }, {
                it: 'should not report valid typedef',
                code: function() {
                    /**
                     * @typedef {(string|number)} alphanum
                     */
                }

            }, {
                it: 'should report invalid property',
                errors: 1,
                code: function() {
                    /**
                     * @typedef alphanum
                     * @property {something/invalid} invalid
                     */
                }
            }, {
                it: 'should not report valid properties',
                code: function() {
                    /**
                     * @typedef {object} user
                     * @property {number} age
                     * @property {string} name
                     */
                }
            }, {
                it: 'should report member',
                code: function() {
                    function ClsName () {
                        /** @member {invalid/type} */
                        this.point = {};
                    }
                }
            }, {
                it: 'should not report member',
                code: function() {
                    function ClsName () {
                        /** @member {Object} */
                        this.point = {};
                    }
                }

            }, {
                it: 'should not report member',
                code: function() {
                    function ClsName () {
                        /** @member {Object} */
                        this.point = {};
                    }
                }

            }, {
                it: 'should not report return',
                code: function() {
                    /**
                     * @return {{a: number, b: string}}
                     */
                    function foo() {
                    }
                }
            }, {
                it: 'should not report empty types in params and returns',
                code: function() {
                    /**
                     * @param q
                     * @param w
                     * @return
                     */
                    ClsName.prototype.point = function (q, w) {
                    }
                }
            }, {
                it: 'should not report valid types in params and returns',
                code: function() {
                    /**
                     * @param {Object} q
                     * @param {Number} w
                     * @return {String}
                     */
                    ClsName.prototype.point = function (q, w) {
                    }
                }
            }, {
                it: 'should report invalid types in params and returns',
                errors: 3,
                code: function() {
                    /**
                     * @param {Obj+ect} q
                     * @param {Num/ber} w
                     * @return {Str~ing}
                     */
                    ClsName.prototype.point = function (q, w) {
                    }
                }
            }, {
                it: 'should not report invalid type for variable args (es6 rest). issue #35',
                code: function() {
                    /**
                     * Returns the sum of all numbers passed to the function.
                     * @param {...number} num - A positive or negative number.
                     */
                    function sum(num) {
                        var i = 0, n = arguments.length, t = 0;
                        for (; i < n; i++) {
                            t += arguments[i];
                        }
                        return t;
                    }
                }
            }
            /* jshint ignore:end *//* jscs: enable */
        ]);

    });

    describe('with strictNativeCase', function() {
        checker.rules({checkTypes: 'strictNativeCase'});

        checker.cases([
            /* jshint ignore:start *//* jscs: disable */
            {
                it: 'should not report strict natives',
                code: function() {
                    /**
                     * @param {number}
                     * @param {string}
                     * @param {boolean}
                     * @param {null}
                     * @param {Array}
                     * @param {Object}
                     * @param {Date}
                     * @param {Function}
                     */
                    function _f () {}
                }
            }, {
                it: 'should not report joined strict natives',
                code: function() {
                    /**
                     * @param {number|string|boolean|null|Array|Object|Date}
                     */
                    function _f () {}
                }
            }, {
                it: 'should not report strict natives declared as function arguments',
                code: function() {
                    /**
                     * @param {function(number, Array)}
                     */
                    function _f () {}
                }
            }, {
                it: 'should report strict natives',
                errors: 6,
                code: function() {
                    /**
                     * @param {Number}
                     * @param {String}
                     * @param {Boolean}
                     * @param {array}
                     * @param {object}
                     * @param {date}
                     */
                    function _f () {}
                }
            }, {
                it: 'should report joined wrong cased strict natives',
                errors: 7,
                code: function() {
                    /**
                     * @param {Number|String|Boolean|Null}
                     * @param {array|object|date}
                     */
                    function _f () {}
                }
            }, {
                it: 'should report joined strict wrong cased natives',
                code: function() {
                    /**
                     * @param {Number|String|Boolean|Null|array|object|date|regexp|function}
                     */
                    function _f () {}
                },
                errors: 9
            }
            /* jshint ignore:end *//* jscs: enable */
        ]);

    });

});
