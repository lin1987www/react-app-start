const eslintrc = require('./.eslintrc');
const merge = require('webpack-merge').smart;

let tsEslintrc = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname
    },
    rules: {
        // disable the rule for all files
        // "@typescript-eslint/explicit-function-return-type": "off"
    },
    overrides: [
        {
            // enable the rule specifically for TypeScript files
            files: ['**/*.ts', '**/*.tsx'],
            rules: {
                '@typescript-eslint/explicit-function-return-type': ["off"]
            }
        }
    ]
};

tsEslintrc = merge( eslintrc, tsEslintrc);

module.exports = tsEslintrc;
