module.exports = function(configuration) {
    configuration.registerRule(new (require('./rules/validate-jsdoc'))());
};
