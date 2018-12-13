let presets = [
    [
        '@babel/preset-env',
        {
            debug: true,
            useBuiltIns: 'entry', // 使用 babel 的 polyfill
        }
    ],
    '@babel/preset-react'
];

let plugins = [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-json-strings',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
];

if (process.env['ENV'] === 'prod') {

} else {

}

module.exports = {presets, plugins};