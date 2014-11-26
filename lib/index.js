module.exports = function(configuration) {
    configuration.registerRule(require('./rules/validate-jsdoc'));
};
