var Checker = require('jscs/lib/checker');
var assert = require('assert');

describe('rules/validate-jsdoc @param', function () {

    var checker;
    beforeEach(function () {
        checker = new Checker();
        checker.registerDefaultRules();
        checker.configure({ additionalRules: ['lib/rules/validate-jsdoc.js'] });
    });

    describe('common', function () {

        it('should report invalid jsdoc', function () {
            checker.configure({ jsDoc: { checkParamNames: true } });
            assert(
                checker.checkString(
                    'var x = 1;\n' +
                    '/**\n' +
                    ' * @param\n' +
                    ' */\n' +
                    'function funcName(xxx) {\n' +
                        '\n' +
                    '}'
                ).getErrorCount() === 1
            );
        });

    });

    describe('param-names', function () {

        it('should report error in jsdoc for function', function () {
            checker.configure({ jsDoc: { checkParamNames: true } });
            assert(
                checker.checkString(
                    'var x = 1;\n' +
                    '/**\n' +
                    ' * @param {String} yyy\n' +
                    ' */\n' +
                    'function funcName(xxx) {\n' +
                        '\n' +
                    '}'
                ).getErrorCount() === 1
            );
        });
        it('should report error in jsdoc for method', function () {
            checker.configure({ jsDoc: { checkParamNames: true } });
            assert(
                checker.checkString(
                    'Cls.prototype = {\n' +
                    '    /**\n' +
                    '     * @param {String} yyy\n' +
                    '     */\n' +
                    '    run: function(xxx) {\n' +
                    '        \n' +
                    '    }\n' +
                    '};'
                ).getErrorCount() === 1
            );
        });
        it('should not report valid jsdoc for method', function () {
            checker.configure({ jsDoc: { checkParamNames: true } });
            assert(
                checker.checkString(
                    'var x = 1;\n' +
                    '/**\n' +
                    ' * @param {String} xxx\n' +
                    ' */\n' +
                    'function funcName(xxx) {\n' +
                        '\n' +
                    '}'
                ).isEmpty()
            );
        });
        it('should not report valid jsdoc for function', function () {
            checker.configure({ jsDoc: { checkParamNames: true } });
            assert(
                checker.checkString(
                    'Cls.prototype = {\n' +
                    '    /**\n' +
                    '     * @param {String} xxx\n' +
                    '     */\n' +
                    '    run: function(xxx) {\n' +
                    '        \n' +
                    '    }\n' +
                    '};'
                ).isEmpty()
            );
        });

    });

    describe('redudant-params', function () {

        it('should report redundant jsdoc-param for function', function () {
            checker.configure({ jsDoc: { checkRedundantParams: true } });
            assert(
                checker.checkString(
                    'var x = 1;\n' +
                    '/**\n' +
                    ' * @param {String} yyy\n' +
                    ' */\n' +
                    'function funcName() {\n' +
                        '\n' +
                    '}'
                ).getErrorCount() === 1
            );
        });
        it('should report redundant jsdoc-param for method', function () {
            checker.configure({ jsDoc: { checkRedundantParams: true } });
            assert(
                checker.checkString(
                    'Cls.prototype = {\n' +
                    '    /**\n' +
                    '     * @param {String} yyy\n' +
                    '     */\n' +
                    '    run: function () {\n' +
                    '        \n' +
                    '    }\n' +
                    '};'
                ).getErrorCount() === 1
            );
        });
        it('should not report redundant jsdoc-param for function', function () {
            checker.configure({ jsDoc: { checkRedundantParams: true } });
            assert(
                checker.checkString(
                    '/**\n' +
                    ' * @param {Object} [elem] Nested element\n' +
                    ' * @param {String} [modName1, ..., modNameN] Modifier names\n' +
                    ' */\n' +
                    'function funcName(elem) {\n' +
                        '\n' +
                    '}'
                ).getErrorCount() === 0
            );
        });
        it('should not report valid jsdoc for method', function () {
            checker.configure({ jsDoc: { checkRedundantParams: true } });
            assert(
                checker.checkString(
                    'var x = 1;\n' +
                    '/**\n' +
                    ' * @param {String} xxx\n' +
                    ' */\n' +
                    'function funcName(xxx) {\n' +
                        '\n' +
                    '}'
                ).isEmpty()
            );
        });
        it('should not report valid jsdoc for function', function () {
            checker.configure({ jsDoc: { checkRedundantParams: true } });
            assert(
                checker.checkString(
                    'Cls.prototype = {\n' +
                    '    /**\n' +
                    '     * @param {String} xxx\n' +
                    '     */\n' +
                    '    run: function(xxx) {\n' +
                    '        \n' +
                    '    }\n' +
                    '};'
                ).isEmpty()
            );
        });

    });

    describe('require-param-types', function () {

        it('should report missing jsdoc-param type for function', function () {
            checker.configure({ jsDoc: { requireParamTypes: true } });
            assert(
                checker.checkString(
                    'var x = 1;\n' +
                    '/**\n' +
                    ' * @param xxx\n' +
                    ' */\n' +
                    'function funcName(xxx) {\n' +
                        '\n' +
                    '}'
                ).getErrorCount() === 1
            );
        });
        it('should report missing jsdoc-param type for method', function () {
            checker.configure({ jsDoc: { requireParamTypes: true } });
            assert(
                checker.checkString(
                    'Cls.prototype = {\n' +
                    '    /**\n' +
                    '     * @param yyy\n' +
                    '     */\n' +
                    '    run: function(xxx) {\n' +
                    '        \n' +
                    '    }\n' +
                    '};'
                ).getErrorCount() === 1
            );
        });
        it('should not report valid jsdoc for method', function () {
            checker.configure({ jsDoc: { requireParamTypes: true } });
            assert(
                checker.checkString(
                    'var x = 1;\n' +
                    '/**\n' +
                    ' * @param {String} xxx\n' +
                    ' */\n' +
                    'function funcName(xxx) {\n' +
                        '\n' +
                    '}'
                ).isEmpty()
            );
        });
        it('should not report valid jsdoc for function', function () {
            checker.configure({ jsDoc: { requireParamTypes: true } });
            assert(
                checker.checkString(
                    'Cls.prototype = {\n' +
                    '    /**\n' +
                    '     * @param {String} xxx\n' +
                    '     */\n' +
                    '    run: function(xxx) {\n' +
                    '        \n' +
                    '    }\n' +
                    '};'
                ).isEmpty()
            );
        });
        it('should not report valid jsdoc with object type for method', function () {
            checker.configure({ jsDoc: { requireParamTypes: true } });
            assert(
                checker.checkString(
                    'var x = 1;\n' +
                        '/**\n' +
                        ' * @param {{foo: string}} xxx\n' +
                        ' */\n' +
                        'function funcName(xxx) {\n' +
                        '\n' +
                        '}'
                ).isEmpty()
            );
        });
        it('should not report valid jsdoc with object type for function', function () {
            checker.configure({ jsDoc: { requireParamTypes: true } });
            assert(
                checker.checkString(
                    'Cls.prototype = {\n' +
                        '    /**\n' +
                        '     * @param {{foo: string}} xxx\n' +
                        '     */\n' +
                        '    run: function(xxx) {\n' +
                        '        \n' +
                        '    }\n' +
                        '};'
                ).isEmpty()
            );
        });

    });

});
