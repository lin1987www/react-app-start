module.exports = {
    parser: require('postcss-safe-parser'),
    plugins: [
        require('postcss-import'),
        require('precss'),
        require('autoprefixer'),
    ]
};
