module.exports = {
    'parser': 'babel-eslint',
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true,
        'node': true,
        'mocha': true,
    },
    'extends': ['eslint:recommended', 'plugin:react/recommended'],
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'settings': {
        'react': {
            'createClass': 'createReactClass',
            'pragma': 'React',
            'version': '16.6.3',
        },
        'propWrapperFunctions': [
            'forbidExtraProps',
        ]
    },
    'plugins': [
        'react-hooks'
    ],
    'rules': {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'no-console': [
            'off',
            {allow: ["warn", "error"]}
        ],
        'indent': [
            'error',
            4,
            {SwitchCase: 1}
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'off',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
    },
};