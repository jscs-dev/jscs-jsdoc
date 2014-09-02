# jscs-jsdoc
[![Build Status](https://secure.travis-ci.org/jscs-dev/jscs-jsdoc.svg?branch=master)](http://travis-ci.org/jscs-dev/jscs-jsdoc)
[![NPM version](https://badge.fury.io/js/jscs-jsdoc.png)](http://badge.fury.io/js/jscs-jsdoc)
[![Dependency Status](https://david-dm.org/jscs-dev/jscs-jsdoc.png)](https://david-dm.org/jscs-dev/jscs-jsdoc)

`jsdoc` plugin for [jscs](https://github.com/jscs-dev/node-jscs/).

## Friendly packages

 * JSCS: https://github.com/jscs-dev/node-jscs/

## Plugin installation

`jscs-jsdoc` can be installed using `npm`.
Install it globally if you are using globally installed `jscs`

    npm -g install jscs-jsdoc

But better install it into your project

    npm install jscs-jsdoc --save-dev

## Usage

To use plugin you should add it to configuration file `.jscsrc`:

```json
{
    "additionalRules": [
        "node_modules/jscs-jsdoc/lib/rules/*.js"
    ],
    "jsDoc": {
    }
}
```

## Configuration

### jsDoc

Enables JsDoc validation.

Type: `Object`

Values:

 - "checkParamNames" ensures param names in jsdoc and in function declaration are equal
 - "requireParamTypes" ensures params in jsdoc contains type
 - "checkRedundantParams" reports redundant params in jsdoc
 - "checkReturnTypes" tries to compare function result type with declared type in jsdoc
 - "requireReturnTypes" ensures returns in jsdoc contains type
 - "checkTypes" reports invalid types
 - "checkRedundantReturns" reports redundant returns in jsdoc
 - "checkRedundantAccess" reports redundant access declarations
 - "leadingUnderscoreAccess" ensures access declaration is set for `_underscored` function names
 - "enforceExistence" ensures jsdoc declarations exists for functions and methods

#### Example

```js
"jsDoc": {
    "checkParamNames": true,
    "checkRedundantParams": true,
    "requireParamTypes": true,
    "checkReturnTypes": true,
    "requireReturnTypes": true,
    "checkTypes": true,
    "checkRedundantReturns": true,
    "checkRedundantAccess": true,
    "leadingUnderscoreAccess": "private",
    "enforceExistence": true
}
```

##### Valid

```js
/**
 * Adds style error to the list
 *
 * @private
 * @param {String} message
 * @param {Number|Object} line
 * @param {Number} [column]
 * @returns {String[]}
 */
_add: function(message, line, column) {
    return ['foo', 'bar'];
}
```

##### Invalid

```js
/**
 * Adds style error to the list
 *
 * @protected
 * @param {String} message
 * @param {Number,Object} line
 * @param {Number} [column]
 * @returns {String}
 */
_add: function() {
    if (true) {
        return false;
    }
    return 15;
}
```

## Browser Usage

NOT SUPPORTED ATM. SORRY.

File [jscs-jsdoc-browser.js](jscs-jsdoc-browser.js) contains browser-compatible version of `jscs-jsdoc`.

Download and include `jscs-jsdoc-browser.js` into your page just after `jscs-browser.js`.

```html
<script src="jscs-browser.js"></script>
<script src="jscs-jsdoc-browser.js"></script>
<script>
    var checker = new JscsStringChecker();
    checker.registerDefaultRules();
    checker.configure({'jsDoc': {/* ... */}});
    var errors = checker.checkString('var x, y = 1;');
    errors.getErrorList().forEach(function (error) {
        console.log(errors.explainError(error));
    });
</script>
```
