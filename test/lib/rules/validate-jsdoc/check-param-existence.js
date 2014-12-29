describe('lib/rules/validate-jsdoc/check-param-existence', function() {
    var checker = global.checker({
        plugins: ['./lib/index']
    });

    describe('not configured', function() {

        it('should report with undefined', function() {
            global.expect(function() {
                checker.configure({checkParamExistence: undefined});
            }).to.throws(/accepted value/i);
        });

        it('should report with an object', function() {
            global.expect(function() {
                checker.configure({checkParamExistence: {}});
            }).to.throws(/accepted value/i);
        });

    });

    describe('checkParams compatability', function() {
        checker.rules({checkParamExistence: true, checkParamNames: true});

        checker.cases([
            /* jshint ignore:start */
            /* jscs:disable */
            {
                  it: 'should report when a parameter is omitted',
                  code: function () {
                      Cls.prototype = {
                          /**
                           * @param xxx
                           */
                          run: function(xxx, zzz) {
                          }
                      };
                  },
                  errors: [
                      {message: 'Function is missing documentation for parameter `zzz`.',
                          line: 5, column: 9, filename: 'input', fixed: undefined, rule: 'jsDoc' }
                  ]
            },
            {
                  it: 'should report when the documentation of a parameter is skipped as well as complain about order.',
                  code: function () {
                      Cls.prototype = {
                          /**
                           * @param {Object} xxx
                           * @param {String} aaa
                           */
                          run: function(xxx, zzz, aaa) {
                          }
                      };
                  },
                  errors: [
                      {message: 'Parameter aaa is out of order',
                          line: 4, column: 23, filename: 'input', fixed: undefined, rule: 'jsDoc' },
                      {message: 'Function is missing documentation for parameter `zzz`.',
                          line: 6, column: 9, filename: 'input', fixed: undefined, rule: 'jsDoc' }
                  ]
            },
            {
                  it: 'should report when the documentation of a parameter is forgotten.',
                  code: function () {
                      Cls.prototype = {
                          /**
                           * @param {Object} xxx
                           * @param {String} zzz
                           */
                          run: function(xxx, zzz, aaa) {
                          }
                      };
                  },
                  errors: [
                      {message: 'Function is missing documentation for parameter `aaa`.',
                          line: 6, column: 9, filename: 'input', fixed: undefined, rule: 'jsDoc' }
                  ]
            }
            // jscs:enable
            /* jshint ignore:end */
        ]);
    });

    describe('with true', function() {
        checker.rules({checkParamExistence: true});

        checker.cases([
            /* jshint ignore:start */
            /* jscs:disable */
            {
                  it: 'should report when a parameter is omitted',
                  code: function () {
                      Cls.prototype = {
                          /**
                           * @param xxx
                           */
                          run: function(xxx, zzz) {
                          }
                      };
                  },
                  errors: [
                      {message: 'Function is missing documentation for parameter `zzz`.',
                          line: 5, column: 9, filename: 'input', fixed: undefined, rule: 'jsDoc' }
                  ]
            },
            {
                  it: 'should report when an argument is omitted',
                  code: function () {
                      Cls.prototype = {
                          /**
                           * @argument xxx
                           */
                          run: function(xxx, zzz) {
                          }
                      };
                  },
                  errors: [
                      {message: 'Function is missing documentation for parameter `zzz`.',
                          line: 5, column: 9, filename: 'input', fixed: undefined, rule: 'jsDoc' }
                  ]
            },
            {
                  it: 'should report when an arg is omitted',
                  code: function () {
                      Cls.prototype = {
                          /**
                           * @arg xxx
                           */
                          run: function(xxx, zzz) {
                          }
                      };
                  },
                  errors: [
                      {message: 'Function is missing documentation for parameter `zzz`.',
                          line: 5, column: 9, filename: 'input', fixed: undefined, rule: 'jsDoc' }
                  ]
            },
            {
                  it: 'should report when the documentation of a parameter is skipped.',
                  code: function () {
                      Cls.prototype = {
                          /**
                           * @param {Object} xxx
                           * @param {String} aaa
                           */
                          run: function(xxx, zzz, aaa) {
                          }
                      };
                  },
                  errors: [
                      {message: 'Function is missing documentation for parameter `zzz`.',
                          line: 6, column: 9, filename: 'input', fixed: undefined, rule: 'jsDoc' }
                  ]
            },
            {
                  it: 'should complain twice when more than one parameter missed.',
                  code: function () {
                      Cls.prototype = {
                          /**
                           * @param {Object} xxx
                           * @param {String} aaa
                           * @param {String} fff
                           */
                          run: function(xxx, zzz, aaa, ggg, fff) {
                          }
                      };
                  },
                  errors: [
                      {message: 'Function is missing documentation for parameter `zzz`.',
                          line: 7, column: 9, filename: 'input', fixed: undefined, rule: 'jsDoc' },
                      {message: 'Function is missing documentation for parameter `ggg`.',
                          line: 7, column: 9, filename: 'input', fixed: undefined, rule: 'jsDoc' }
                  ]
            },
            {
                  it: 'should not complain at all when an inheritdoc is present even if a parameter is documented.',
                  code: function () {
                      Cls.prototype = {
                          /**
                           * @inheritdoc
                           * @param {String} xxx
                           */
                          run: function(xxx, zzz, aaa, ggg, fff) {
                          }
                      };
                  },
                  errors: []
            },
            {
                  it: 'should not complain at all when an inheritdoc is present.',
                  code: function () {
                      Cls.prototype = {
                          /**
                           * @inheritdoc
                           */
                          run: function(xxx, zzz, aaa, ggg, fff) {
                          }
                      };
                  },
                  errors: []
            },
            {
                  it: 'should not complain on classes.',
                  code: function () {
                      /**
                       * @class Foo
                       */
                      function Cls( foo, bar ) {
                      }
                  },
                  errors: []
            }
            // jscs:enable
            /* jshint ignore:end */
        ]);
    });
});
