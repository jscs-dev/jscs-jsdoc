
module.exports = {
    presets: [
        require('lib/presets/plugin.json')
    ],
    reporters: [
        require('lib/reporters/plugin.js')
    ],
    rules: [
        require('lib/rules/plugin-validation-rules.js')
    ]
};
