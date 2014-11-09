describe('rules/validate-jsdoc', function() {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('check-types', function() {

        checker.rules({checkTypes: true});
        checker.cases([
            /* jshint ignore:start */
            {
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
            }
            /* jshint ignore:end */
        ]);

    });

});
