var Checker = require('jscs/lib/checker');
var parse = require('comment-parser');
var chai = require('chai');
var expect = chai.expect;

chai.use(require('chai-subset'));

global.parse = parse;
global.fnBody = fnBody;
global.checker = rulesChecker;
global.expect = expect;

/**
 * Parses body of function
 *
 * @param {Function} func
 * @returns {string} body of func
 */
function fnBody(func) {
    var str = func.toString();
    var out = str.slice(
        str.indexOf('{') + 1,
        str.lastIndexOf('}')
    );

    // strip trailing spaces and tabs
    out = out.replace(/^\n*|[ \t]*$/g, '');

    // strip preceding indentation
    var blockIndent = 0;
    out.match(/^([ \t]*)/gm).map(function(v) {
        if (!blockIndent || (v.length > 0 && v.length < blockIndent)) {
            blockIndent = v.length;
        }
    });

    // rebuild block without inner indent
    out = !blockIndent ? out : out.split('\n').map(function(v) {
        return v.substr(blockIndent);
    }).join('\n');

    return out;
}

/**
 * @typedef {{it: string, code: Function, rules: ?Object, errors: ?*, skip: ?boolean}} TestCase
 */

/**
 * Testing helper object
 *
 * @param {Object} opts default options for jscs string checker
 * @returns {{rules: function(Object), configure: function(Object),
 *   cases: function(TestCase[]), check: function(string)}}
 */
function rulesChecker(opts) {
    var checker;

    beforeEach(function() {
        checker = new Checker();
        checker.registerDefaultRules();
        if (opts) {
            checker.configure(opts);
        }
    });

    return {
        /**
         * Set rules for each case (beforeEach wrapper)
         *
         * @param {Object} rules
         */
        rules: function(rules) {
            beforeEach(function() {
                checker.configure({jsDoc: rules});
            });
        },

        /**
         * Set rules immediately
         *
         * @param {Object} rules
         */
        configure: function(rules) {
            checker.configure({jsDoc: rules});
        },

        /**
         * Describe cases (wrapper for mocha it calls)
         *
         * @param {TestCase[]} items
         */
        cases: function(items) {
            items = items || [];
            items.forEach(function(test) {

                (test.skip ? it.skip : it)(test.it, function() {
                    if (test.rules) {
                        checker.configure({ jsDoc: test.rules });
                    }

                    var body = test.code.call ? fnBody(test.code) : test.code;
                    var checked = checker.checkString(body);
                    var errors = checked.getErrorList();
                    if (errors.length && errors[0].rule === 'parseError') {
                        console.error(errors[0]);
                        throw new Error(errors[0].message);
                    }

                    if (!test.hasOwnProperty('errors') || (typeof test.errors === 'number')) {
                        expect(checked.getErrorCount())
                            .to.eq(test.errors || 0);
                    } else if (Array.isArray(test.errors)) {
                        expect(errors)
                            .to.containSubset(test.errors);
                    } else {
                        expect(checked.getErrorCount())
                            .to.not.eq(0);
                        expect(errors[0])
                            .to.deep.similar(test.errors);
                    }
                });

            });
        },

        /**
         * @param {string} str
         * @returns {Object}
         */
        check: function(str) {
            return checker.checkString(str);
        }
    };
}

chai.use(function(chai, utils) {
    utils.addMethod(chai.Assertion.prototype, 'similar', method);

    /**
     * @param {Object} expected
     * @throws {Error}
     */
    function method(expected) {
        var obj = utils.flag(this, 'object');

        Object.keys(obj).forEach(function(k) {
            if (!expected.hasOwnProperty(k)) {
                expected[k] = obj[k];
            }
        });

        new chai.Assertion(obj).to.be.deep.equal(expected);
    }
});
