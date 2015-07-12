describe('lib/rules/validate-jsdoc/require-return-description', function () {
  var checker = global.checker({
    plugins: ['./lib/index']
  });

  describe('not configured', function() {
    it('should report with undefined', function() {
      global.expect(function() {
        checker.configure({requireReturnDescription: undefined});
      }).to.throws(/accepted value/i);
    });

    it('should report with an object', function() {
      global.expect(function() {
        checker.configure({requireReturnDescription: {}});
      }).to.throws(/accepted value/i);
    });
  });

  describe('with true', function() {
    checker.rules({requireReturnDescription: true});

    checker.cases([
      /* jshint ignore:start */
      {
        it: 'should not report',
        code: function() {
          function yay(yey) {
          }
        }
      }, {
        it: 'should report missing jsdoc-return description for function',
        errors: 1,
        code: function () {
          var x = 1;
          /**
           * @returns
           */
          function funcName() {
            // dummy
          }
        }
      }, {
        it: 'should report missing jsdoc-return description for method',
        errors: 1,
        code: function () {
          Cls.prototype = {
            /**
             * @returns
             */
            run: function() {
              // dummy
            }
          };
        }
      }, {
        it: 'should not report invalid jsdoc for function',
        code: function () {
          var x = 1;
          /**
           * @returns {Boolean} False.
           */
          function funcName() {
            return false;
          }
        }
      }, {
        it: 'should not report invalid jsdoc for method',
        code: function () {
          Cls.prototype = {
            /**
             * @returns {Boolean} False.
             */
            run: function() {
              return false;
            }
          };
        }
      }, {
        it: 'should report with right location',
        code: function () {
          Cls.prototype = {
            /**
             * @returns
             */
            run: function() {
              return false;
            }
          };
        },
        errors: {column: 5, line: 3}
      }
      /* jshint ignore:end */
    ]);

  });
});

