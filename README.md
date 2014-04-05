# jsdoc
[![Build Status](https://secure.travis-ci.org/zxqfox/jscs-jsdoc.svg?branch=master)](http://travis-ci.org/zxqfox/jscs-jsdoc)
[![NPM version](https://badge.fury.io/js/jscs-jsdoc.png)](http://badge.fury.io/js/jscs-jsdoc)
[![Dependency Status](https://david-dm.org/zxqfox/jscs-jsdoc.png)](https://david-dm.org/zxqfox/jscs-jsdoc)

`jscs-jsdoc` plugin for [jscs](https://github.com/mdevils/node-jscs/).

## Friendly packages

 * JSCS: https://github.com/mdevils/node-jscs/

## Plugin installation

`jscs-jsdoc` can be installed using `npm`.
Install it globally if you are using globally installed `jscs`

    npm -g install jscs-jsdoc

Or install it into your project

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
 - "checkRedundantReturns" reports redundant returns in jsdoc
 - "checkTypes" reports invalid types in jsdoc

#### Example

```js
"jsDoc": {
    "checkParamNames": true,
    "checkRedundantParams": true,
    "requireParamTypes": true,
    "checkReturnTypes": true,
    "checkRedundantReturns": true,
    "requireReturnTypes": true,
    "checkTypes": true
}
```

##### Valid

```js
/**
 * Adds style error to the list
 *
 * @param {String} message
 * @param {Number|Object} line
 * @param {Number} [column]
 * @returns {String[]}
 */
add: function(message, line, column) {
    return ['foo', 'bar'];
}
```

##### Invalid

```js
/**
 * Adds style error to the list
 *
 * @param {String} message
 * @param {Number,Object} line
 * @param {Number} [column]
 * @returns {String}
 */
add: function() {
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
    checker.configure({'jsDoc': {/*...*/}});
    var errors = checker.checkString('var x, y = 1;');
    errors.getErrorList().forEach(function(error) {
        console.log(errors.explainError(error));
    });
</script>
```
