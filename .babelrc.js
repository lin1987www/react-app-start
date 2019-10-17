// for @babel/register, babel-loader
let presets = [
    [
        '@babel/preset-env',
        {
            debug: true,
            useBuiltIns: 'entry',  // import '@babel/polyfill';
            corejs: '2',
        }
    ],
    '@babel/preset-react'
];

let plugins = [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-json-strings',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-regenerator',
    '@babel/plugin-transform-async-to-generator',
    ['react-intl-auto', {
        'removePrefix': 'app/'
    }],
    ["react-intl", {
        "messagesDir": "./translations/messages/"
    }],
];

const _MOCHA_PATH = new RegExp('(\\\\|/)node_modules\\1mocha\\1bin\\1_mocha$');
const isMochaRunning = process.argv.findIndex(arg => _MOCHA_PATH.test(arg)) > -1; // eslint-disable-line no-unused-vars
if (isMochaRunning) {
    plugins.push('dynamic-import-node');
}

module.exports = {presets, plugins};
