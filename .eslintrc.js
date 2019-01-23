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
    'rules': {
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
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
    },
};