# README for contributors

## Naming convention

Rules should be placed as they are in configuration. Their names should be hyphenized (as well as in jscs).

Tests for them should be placed in the same manner in `./test` directory. For one rule file should be maked one test file with the same name.

## Rule formats

There are 3 rule formats atm to simplify developing:

- Classic (used in `jscs`) - function with JSFile and JSErrors objects
- Scope based - function with specified scope and 2 params: esprima node object and err callback
- Tag based - function with specified tags and 3 params: DocTag, esprima node object (if exists) and err callback

Scopes and tags are pretty fine for structurizing rules for jsdocs (at some pov) but also there are iterators in file and jsdoc blocks.

### Classic

Some times you need to have full data of file to check it. You can take a look at [checkTypes rule](https://github.com/jscs-dev/jscs-jsdoc/blob/master/lib/rules/validate-jsdoc/check-types.js)

```js
// passing a function
module.exports = ruleChecker;
// define a scope 'file'
module.exports.scopes = ['file'];
// define allowed options
module.exports.options = {
    rule: {allowedValues: [true]}
};

/**
 * @param {JSCS.JSFile} file
 * @param {JSCS.Errors} errors
 */
function ruleChecker(file, errors) {
  var comments = file.getComments();
  comments.forEach(function(commentNode) {
    if (commentNode.type !== 'Block' || commentNode.value[0] !== '*') {
      return;
    }

    // trying to create DocComment object
    var node = jsdoc.createDocCommentByCommentNode(commentNode);
    if (!node.valid) {
      errors.add('invalid doc comment block', node.loc.start);
    }

    node.iterate(function(tag) {
      // test tags here
    )}
  });
}
```

### Scope based

For now it's only function scope. But it could be a variable, or some other important places. (need to know about it actually)

```js
module.exports = ruleChecker;
module.exports.scopes = ['function'];
module.exports.options = {
    rule: {allowedValues: [true]}
};

/**
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {function(string,DocLocation|number,?number)} err
 */
function ruleChecker(node, err) {
  if (!node.jsdoc) {
    return;
  }

  // will check only `@nohugshere` tags in function jsdocs
  node.jsdoc.iterateByType(['nohugshere'],
    function (tag, i) {
      if (tag.value.indexOf('hug')) {
        err('hug found in tag ' + tag.id, tag.loc);
      }
    });
}
```

### Tag based

```js
module.exports = ruleChecker;
module.exports.tags = ['foo', 'bar', 'baz'];
module.exports.scopes = ['function'];
module.exports.options = {
    rule: {allowedValues: [true]}
};

/**
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {DocTag} tag
 * @param {Function} err
 */
function ruleChecker(node, tag, err) {
  // etc.
}
```

## Tests

The root name of each test should be full path name of rule without `.js` suffix (to simplify debugging process).

Each section in test file could be splitted to several sections: allowed params tests, functional tests, and location tests.

Also there're [some helpers](./test/init.js) to simplify test development. Most important of them are global.checker, and chai's `.deep.similar` assertion.

### Tests checker

This object provides few methods to make tests much easier:
- __construct(opts) - makes checker wrapper object
- configure(opts) - to configure checker instantly
- check - to check case instantly
- rules - to configure checker before each case
- cases - to describe what cases it should check

```js
describe('lib/rules/validate-jsdoc/some-rule', function () {
  var checker = global.checker({
    additionalRules: ['lib/rules/validate-jsdoc.js']
  });

  checker.rules({commonRule: true});
  checker.cases([
    /* jshint ignore:start */
    {
      it: 'should not report',
      code: function() {
        // some code here
      }
    }, {
      it: 'should report something',
      errors: 1,
      code: function () {}
    }, {
      it: 'should report something concrete',
      errors: {loc: {line: 5, column:10}},
      code: function () {}
    }, {
      it: 'should be called with additional rules',
      rules: {additionalRule: 'orAnother'},
      errors: {loc: {line: 5, column:10}},
      code: function () {}
    }
    /* jshint ignore:end */
  ]);
});
```

## Another helpful things

There're pretty simple `Doc*` objects so please take a look at [their code](./lib/jsdoc.js).

Also we have some helpers in the [root rule file](./lib/rules/validate-jsdoc.js).
