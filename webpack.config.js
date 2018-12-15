const webpack = require('webpack');
const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');


module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    entry: {
        'app': ['@babel/polyfill', './src/page/index.jsx'],
        'test': ['@babel/polyfill', './test/index.js'],
    },
    output: {
        // filename: 'main.js',
        filename: '[name].[hash].bundle.js',
        chunkFilename: '[name].[chunkhash].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new ManifestPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // 避免import順序改變造成 hash 改變
        new webpack.HashedModuleIdsPlugin(),
        // 清除指定資料夾底下的資料
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
        new StyleLintPlugin({}),
    ],
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
                    // Explicitly disable babelrc so we don't catch various config in much lower dependencies.
                    babelrc: true,
                },
            },
            {
                test: /test\.js$/,
                exclude: /node_modules/,
                use: 'mocha-loader',
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: false
                        }
                    }
                ]
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
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin()
        ],
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
};
