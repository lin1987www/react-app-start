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
// const tsEslintrc = require('./ts.eslintrc');

const isProd = process.env.NODE_ENV === 'production';

require('dotenv').config({path: isProd ? 'prod.env' : 'dev.env'});

// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
const { CheckerPlugin } = require('awesome-typescript-loader');

const common = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'cheap-module-source-map' : 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    resolve: {
        symlinks: false,
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
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
            // https://webpack.js.org/api/loaders/#pitching-loader
            {
                test: /(spec|test)\.(jsx?|tsx?)$/,
                exclude: /node_modules/,
                use: ['mocha-loader'],
            },
            {
                test: /\.(jsx?|tsx?)$/,
                include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'test')],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            // To avoid node_modules building failed at jsx
                            presets: babel_presets,
                            plugins: babel_plugins,
                        }
                    },
                ]
            },
            {
                enforce: 'pre',
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: eslintrc
            },
            {
                // Please don't try to move awesome-typescript-loader with babel-loader.
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
            },
            // {
            //
            //     enforce: 'pre',
            //     test: /\.(tsx?)$/,
            //     exclude: /node_modules/,
            //     loader: 'eslint-loader',
            //     // eslint for typescript didn't work. Please use "npm run test:tslint" instead.
            //     options: tsEslintrc
            // },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: false
                }
            },
            {
                test: /\.[ps]?css$/,
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
        new CheckerPlugin(),
    ],
};

const prod = {
    plugins: [
        // 避免import順序改變造成 hash 改變
        new webpack.HashedModuleIdsPlugin(),
    ]
};

const dev = {
    output: {
        // Workaround https://github.com/webpack-contrib/worker-loader/issues/142
        globalObject: 'this'
    },
    plugins: [
        // To Avoid 'window is not defined' error, we need add {globalObject: 'this'} to output
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
        'lib.min': ['react', 'react-dom'],
        'index': ['./src/views/index/index.jsx'],
        'test': ['./test/index.js'],
        'todo_list': ['./src/views/todo_list.jsx'],
        'hi_i18n': ['./src/views/hi_i18n.jsx'],
        'browser_router': ['./src/views/browser_router.jsx'],
        'ref': ['./src/views/ref.jsx'],
        'hook': ['./src/views/hook.jsx'],
        'hook_in_class': ['./src/views/hook_in_class.jsx'],
        'type-script': ['./src/views/type-script/type-script'],
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            inject: 'body',
            chunks: ['lib.min', 'index'],
            template: './src/views/index/index.html',
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
        new HtmlWebpackPlugin({
            inject: 'body',
            title: 'Type Script',
            chunks: ['lib.min', 'type-script'],
            filename: 'type-script.html',
        }),
    ],
});

module.exports = [
    config
];
