var Checker = require('jscs/lib/checker');
var assert = require('assert');

describe('rules/validate-jsdoc', function () {

    var checker;
    beforeEach(function () {
        checker = new Checker();
        checker.registerDefaultRules();
        checker.configure({ additionalRules: ['lib/rules/validate-jsdoc.js'] });
    });

    describe('require-return-types', function () {

        it('should report invalid @returns jsdoc', function () {
            checker.configure({ jsDoc: { requireReturnTypes: true } });
            assert(
                checker.checkString(
                    'var x = 1;\n' +
                    '/**\n' +
                    ' * @return' +
                    ' */\n' +
                    'function funcName() {\n' +
                        '\n' +
                    '}'
                ).getErrorCount() === 1
            );
        });

        it('should not report valid jsdoc with object type in method', function () {
            checker.configure({ jsDoc: { requireReturnTypes: true } });
            assert(
                checker.checkString(
                    'Cls.prototype = {\n' +
                        '    /**\n' +
                        '     * @return {{bar: number}}\n' +
                        '     */\n' +
                        '    run: function (xxx) {\n' +
                        '        return {};\n' +
                        '    }\n' +
                        '};'
                ).isEmpty()
            );
        });

    });

    describe('redudant-returns', function () {

        it('should report redundant @returns for function', function () {
            checker.configure({ jsDoc: { checkRedundantReturns: true } });
            assert(
                checker.checkString(
                    '/**\n' +
                    ' * @return {string}' +
                    ' */\n' +
                    'function funcName() {\n' +
                        '\n' +
                    '}\n' +

                    '/**\n' +
                    ' * @returns {String}' +
                    ' */\n' +
                    'function funcName() {\n' +
                        'var x = function () { return 1; }\n' +
                    '}\n' +

                    '/**\n' +
                    ' * @returns {String}' +
                    ' */\n' +
                    'function funcName() {\n' +
                        'return;\n' +
                    '}'
                ).getErrorCount() === 3
            );
        });

        it('should not report redundant @returns for function', function () {
            checker.configure({ jsDoc: { checkRedundantReturns: true } });
            assert(
                checker.checkString(
                    '/**\n' +
                    ' * @returns {String}' +
                    ' */\n' +
                    'function funcName() {\n' +
                        'var x = function () { return 1; }\n' +
                        'if (true) { return x; }\n' +
                    '}'
                ).isEmpty()
            );
        });

    });

    describe('check-return-types', function () {

        it('should report invalid @returns type in function', function () {
            checker.configure({ jsDoc: { checkReturnTypes: true } });
            assert(
                checker.checkString(
                    '/**\n' +
                    ' * @returns {Object}\n' +
                    ' */\n' +
                    'function funcName() {\n' +
                        'return "";\n' +
                    '}'
                ).getErrorCount() === 1
            );
        });

        it('should not report valid resulting type with object type in method', function () {
            checker.configure({ jsDoc: { checkReturnTypes: true } });
            assert(
                checker.checkString(
                    'Cls.prototype = {\n' +
                    '    /**\n' +
                    '     * @return {{bar: number}}\n' +
                    '     */\n' +
                    '    run: function (xxx) {\n' +
                    '        return {};\n' +
                    '    }\n' +
                    '};\n'
                ).isEmpty()
            );
        });
        it('should not report valid resulting type with object type in function', function () {
            checker.configure({ jsDoc: { checkReturnTypes: true } });
            assert(
                checker.checkString(
                    '/**\n' +
                    ' * @return {Object}\n' +
                    ' */\n' +
                    'function funcName() {\n' +
                        'return new Object();\n' +
                    '}'
                ).isEmpty()
            );
        });

        it('should not report comparition jsdoc type to any expression in function', function () {
            checker.configure({ jsDoc: { checkReturnTypes: true } });
            assert(
                checker.checkString(
                    '/**\n' +
                    ' * @return {Object}\n' +
                    ' */\n' +
                    'function funcName() {\n' +
                        'return Object.create();\n' +
                    '}\n' +
                    '/**\n' +
                    ' * @return {string}\n' +
                    ' */\n' +
                    'function funcName() {\n' +
                        'return makeMyDay("zxc");\n' +
                    '}'
                ).isEmpty()
            );
        });

        it('should not report valid resulting array type for function', function () {
            checker.configure({ jsDoc: { checkReturnTypes: true } });
            assert(
                checker.checkString(
                    '/**\n' +
                    ' * @return {Array}\n' +
                    ' */\n' +
                    'function funcName() {\n' +
                        'return [1, 2];\n' +
                    '}\n' +
                    '/**\n' +
                    ' * @return {Array}\n' +
                    ' */\n' +
                    'function funcName() {\n' +
                        'return new Array("zxc");\n' +
                    '}'
                ).isEmpty()
            );
        });

        it('should not report valid resulting regexp type for function', function () {
            checker.configure({ jsDoc: { checkReturnTypes: true } });
            assert(
                checker.checkString(
                    '/**\n' +
                    ' * @return {RegExp}\n' +
                    ' */\n' +
                    'function funcName() {\n' +
                        'return /[a-z]+/i;\n' +
                    '}\n' +
                    '/**\n' +
                    ' * @return {RegExp}\n' +
                    ' */\n' +
                    'function funcName() {\n' +
                        'return new RegExp("[a-z]+", "i");\n' +
                    '}'
                ).isEmpty()
            );
        });

    });

    describe('combined', function () {

        it('should not report valid resulting array.<String> and Object[] for function', function () {
            checker.configure({ jsDoc: { requireReturnTypes: true, checkReturnTypes: true } });
            assert(
                checker.checkString(
                    '/**\n' +
                    ' * @return {String[]}\n' +
                    ' */\n' +
                    'function funcName() {\n' +
                        'return ["a", "b", "c"];\n' +
                    '}\n' +
                    '/**\n' +
                    ' * @return {Object[]}\n' +
                    ' */\n' +
                    'function funcName() {\n' +
                        'return [{}, {}];\n' +
                    '}\n' +
                    '/**\n' +
                    ' * @return {Array.<Number>}\n' +
                    ' */\n' +
                    'function funcName() {\n' +
                        'return [1, 2, 3];\n' +
                    '}'
                ).isEmpty()
            );
        });

    });

    describe('bugfixes', function () {

        it('should not throw exception on `@returns {null|undefined}` directive. issue #7', function () {

            checker.configure({ jsDoc: { requireReturnTypes: true, checkReturnTypes: true } });
            assert(
                checker.checkString(
                    '/**\n' +
                    ' * @return {null}\n' +
                    ' */\n' +
                    'function funcName() {\n' +
                        'return null;\n' +
                    '}\n' +
                    '/**\n' +
                    ' * @return {undefined}\n' +
                    ' */\n' +
                    'function funcName() {\n' +
                        'return undefined;\n' +
                    '}\n' +
                    '/**\n' +
                    ' * @return {null|undefined}\n' +
                    ' */\n' +
                    'function funcName(flag) {\n' +
                    '  if (flag) {\n' +
                    '    return null;\n' +
                    '  }\n' +
                    '  return undefined;\n' +
                    '}\n'
                ).isEmpty()
            );

        });

        it('should report on `@returns {null|undefined}` vs (string|number|regexp). issue #7', function () {
            checker.configure({ jsDoc: { requireReturnTypes: true, checkReturnTypes: true } });
            assert(
                checker.checkString(
                    '/**\n' +
                    ' * @return {null|undefined}\n' +
                    ' */\n' +
                    'function funcName(flag) {\n' +
                    '  if (flag) {\n' +
                    '    return /qwe/i;\n' +
                    '  } else {\n' +
                    '    return 2;\n' +
                    '  }\n' +
                    '  return "";\n' +
                    '}\n'
                ).getErrorCount() === 3
            );
        });

        it('should report on `@returns {null|undefined}` vs (array|object). issue #7', function () {
            checker.configure({ jsDoc: { requireReturnTypes: true, checkReturnTypes: true } });
            assert(
                checker.checkString(
                    '/**\n' +
                    ' * @return {null|undefined}\n' +
                    ' */\n' +
                    'function funcName(flag) {\n' +
                    '  if (flag) {\n' +
                    '    return [];\n' +
                    '  }\n' +
                    '  return {q: 1};\n' +
                    '}\n'
                ).getErrorCount() === 2
            );
        });

        it('should not report on `@returns {string|null}` vs (null). issue #8', function () {
            checker.configure({ jsDoc: { requireReturnTypes: true, checkReturnTypes: true } });
            assert(
                checker.checkString(
                    '/**\n' +
                    ' * @return {string|null}\n' +
                    ' */\n' +
                    'function funcName(flag) {\n' +
                    '  if (!this.something) {\n' +
                    '    return null;\n' +
                    '  }\n' +
                    '}\n' +
                    '/**\n' +
                    ' * @return {?string}\n' +
                    ' */\n' +
                    'function funcName(flag) {\n' +
                    '  if (!this.something) {\n' +
                    '    return null;\n' +
                    '  }\n' +
                    '}\n'
                ).isEmpty()
            );
        });

        it('should not report on `@returns {?number}` vs (null|number). issue #8', function () {
            checker.configure({ jsDoc: { requireReturnTypes: true, checkReturnTypes: true } });
            assert(
                checker.checkString(
                    '/**\n' +
                    ' * @return {number|null}\n' +
                    ' */\n' +
                    'function funcName(flag) {\n' +
                    '  if (!this.something) {\n' +
                    '    return null;\n' +
                    '  }\n' +
                    '  return 3;\n' +
                    '}\n' +
                    '/**\n' +
                    ' * @return {?number}\n' +
                    ' */\n' +
                    'function funcName(flag) {\n' +
                    '  if (!this.something) {\n' +
                    '    return null;\n' +
                    '  }\n' +
                    '  return 3;\n' +
                    '}\n'
                ).isEmpty()
            );
        });

    });

});
