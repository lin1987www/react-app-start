const merge = require('webpack-merge').smart;
const webpack = require('webpack');
const path = require('path');

const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const StyleLintPlugin = require('stylelint-webpack-plugin');

const babelrc = require('./.babelrc');
const babel_presets = babelrc.presets;
const babel_plugins = babelrc.plugins;

const eslintrc = require('./.eslintrc');

const isProd = process.env.NODE_ENV === 'production';

const common = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'cheap-module-source-map' : 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    resolve: {
        symlinks: false
    },
    output: {
        libraryTarget: 'umd',
        filename: '[name].[hash].bundle.js',
        chunkFilename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimizer: [new TerserPlugin()],
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: eslintrc
            },
            {
                test: /\.jsx?$/,
                include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'test')],
                loader: 'babel-loader',
                options: {
                    // To avoid node_modules building failed at jsx
                    presets: babel_presets,
                    plugins: babel_plugins,
                },
            },
            {
                test: /(spec|test)\.jsx?$/,
                exclude: /node_modules/,
                use: ['mocha-loader'],
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: false
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]_[local]_[hash:base64:5]',
                            camelCase: true,
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
        ]
    },
    plugins: [
        new StyleLintPlugin(),
        new ManifestPlugin(),
    ],
};

const prod = {
    plugins: [
        // 避免import順序改變造成 hash 改變
        new webpack.HashedModuleIdsPlugin(),
    ]
};

const dev = {
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
};

const base = merge(common, isProd ? prod : dev);

const config = merge(base, {
    optimization: {
        runtimeChunk: {
            name: 'lib.min'
        },
        splitChunks: {
            name: 'lib.min',
            chunks: 'all',
        }
    },
    entry: {
        'lib.min': ['@babel/polyfill'],
        'index': ['./src/web/index.jsx'],
        'test': ['./test/index.js'],
        'todo_list': ['./src/web/todo_list.jsx'],
        'hi_i18n': ['./src/web/hi_i18n.jsx'],
        'browser_router': ['./src/web/browser_router.jsx'],
        'ref': ['./src/web/ref.jsx'],
        'hook': ['./src/web/hook.jsx'],
        'hook_in_class': ['./src/web/hook_in_class.jsx'],
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            inject: 'body',
            chunks: ['lib.min', 'index'],
            template: './src/web/index.html',
            filename: 'index.html',
        }),
        new HtmlWebpackPlugin({
            inject: 'body',
            title: 'Test Page',
            chunks: ['lib.min', 'test'],
            filename: 'test.html',
        }),
        new HtmlWebpackPlugin({
            inject: 'body',
            title: 'Todo List',
            chunks: ['lib.min', 'todo_list'],
            filename: 'todo_list.html',
        }),
        new HtmlWebpackPlugin({
            inject: 'body',
            title: 'Hi i18n',
            chunks: ['lib.min', 'hi_i18n'],
            filename: 'hi_i18n.html',
        }),
        new HtmlWebpackPlugin({
            inject: 'body',
            title: 'browser_router',
            chunks: ['lib.min', 'browser_router'],
            filename: 'browser_router.html',
        }),
        new HtmlWebpackPlugin({
            inject: 'body',
            title: 'Ref',
            chunks: ['lib.min', 'ref'],
            filename: 'ref.html',
        }),
        new HtmlWebpackPlugin({
            inject: 'body',
            title: 'Hook',
            chunks: ['lib.min', 'hook'],
            filename: 'hook.html',
        }),
        new HtmlWebpackPlugin({
            inject: 'body',
            title: 'Hook in class',
            chunks: ['lib.min', 'hook_in_class'],
            filename: 'hook_in_class.html',
        }),
    ],
});

module.exports = [
    config
];