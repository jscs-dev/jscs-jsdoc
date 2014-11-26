/**
 * @param {module:jscs/lib/Configuration} configuration
 */
module.exports = function(configuration) {
    configuration.registerRule(require('./rules/validate-jsdoc'));
};
