module.exports = {
    env: {
        'jest': true,
        'mocha': false
    },
    rules: {
        'no-unused-vars': [
            'off',
            {}
        ],
        'no-console': [
            'off',
            {allow: ["warn", "error"]}
        ],
    }
};


