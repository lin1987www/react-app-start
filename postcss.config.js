module.exports = {
    parser: require('postcss-safe-parser'),
    plugins: [
        require('precss'),
        require('autoprefixer')
    ]
};
