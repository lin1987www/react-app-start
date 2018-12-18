const defaultsDeep = require('lodash.defaultsdeep');
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

const base = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: process.env.NODE_ENV === 'production' ? 'cheap-module-source-map' : 'inline-source-map',
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
        runtimeChunk: 'single',  // 將runtime 從 Boilerplate  分離
        splitChunks: {
            cacheGroups: {
                vendors: {
                    priority: -10,
                    test: /[\\/]node_modules[\\/]/
                }
            },
        }
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
            {
                test: /\.jsx?$/,
                include: [path.resolve(__dirname, 'src')],
                loader: 'babel-loader',
                options: {
                    // To avoid node_modules building failed at jsx
                    presets: babel_presets,
                    plugins: babel_plugins,
                },
            },
            {
                test: /test\.js$/,
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
                exclude: /node_modules/,
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
    entry: {
        'app': ['@babel/polyfill', './src/page/index.jsx'],
        'test': ['@babel/polyfill', './test/index.js'],
    },
    plugins: [
        new StyleLintPlugin(),
        new ManifestPlugin(),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            inject: true,
            title: 'Test Page',
            chunks: ['runtime', 'test'],
            filename: 'test.html',
        }),
        new HtmlWebpackPlugin({
            inject: true,
            chunks: ['runtime', 'app'],
            template: './src/page/index.html',
            filename: './index.html',
        }),
    ],
};

const prod = {
    plugins: base.plugins.concat([
        // 避免import順序改變造成 hash 改變
        new webpack.HashedModuleIdsPlugin(),
    ])
};

const dev = {
    plugins: base.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
    ])
};

module.exports = [
    defaultsDeep({}, base,
        process.env.NODE_ENV === 'production' ? prod : dev
    )
];
