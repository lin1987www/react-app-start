# 建立順序
## 安裝 npm
[npm](https://codeburst.io/how-to-create-and-publish-your-first-node-js-module-444e7585b738)

node_modules包含兩種:
1.   module  可以被import、require用於程式實際執行，安裝時搭配 --save 或 -S 參數使用
2.   package 則是用於開發階段，可以的程式指令，安裝時搭配 --save-dev 或 -D 參數使用，執行package安裝的指令時，使用**npx**

*   升級 npm 版本

        npm update npm -g

*   查看版本

        npm -v

*   npm 登入登出

        npm login
        npm logout

*   npm 設定初始化 (產生 package.json)

        npm init --scope=username

*   移除沒有用到的 module

        npm prune

*   產生發佈檔案 tgz

        npm pack

*   發佈 npm 套件使用

        npm publish --access=public

產生 package.json 後，新增 files 指定那些檔案是需要的，有了 files 就可以省略 .npmignore 跟 .gitignore 等檔案

    {   
        "files": [
            "src",
            "test",
            "*.js",
            ".eslintignore",
            ".travis.yml"
        ]
    }

## 安裝 ESLint
[ESLint](https://eslint.org/docs/user-guide/getting-started)

    // --save-dev 跟 -D 都是一樣的option  會修改到 package.json 檔案中
    npm install --save-dev eslint
        
/node_modules/.bin包含了所有可以執行的package指令        
        
    // 執行 eslint 中的初始化設定黨
    npx eslint --init
    
    // 實際可執行程式對應的位置
    node ./node_modules/eslint/bin/eslint.js --init

1.  選擇最新的ES語法
2.  使用ES6 modules
3.  Browser, Node全選
4.  使用 CommonJS
5.  使用 JSX 用於 React
6.  使用 React
7.  縮排使用空白符號
8.  使用單引號作為字串符號
9.  使用Unix的換行 (LF)
10. 需要半引號作為結尾
11. 使用JavaScript格式作為設定檔

產生.eslintrc.js設定檔案後Enable ESLint 關閉其他 Lint 如 JSLint

IDE畫面右下角可以切換 CRLF (Windows)、LF (Unix)、CR (Mac) 各種換行方式
        
[ESLint React](https://www.npmjs.com/package/eslint-plugin-react)

    // 安裝用於檢查 react 的語法
    npm install --save-dev eslint-plugin-react

修改 .eslintrc.js 新增 plugin:react/recommended 到 extends

    module.exports = {
        // ...
        "extends": ["eslint:recommended", "plugin:react/recommended"],
        // ...
    };

建立 .eslintignore

    # ESLint do test need .eslintignore, it is not limit by package.json files setting.
    # Build
    node_modules/*
    build/*
    dist/*

新增 package.json 可執行ESLint 檢測的指令
    
    // package.json
    {
        "scripts": {
            "test:lint": "eslint . --ext .js,.jsx",
        }
    }
 
## 安裝 Babel
[Babel](https://babeljs.io/docs/en/usage)
[Try it out](https://babeljs.io/repl/build/master)

    npm install --save-dev @babel/core @babel/cli @babel/preset-env babel-loader
    npm install --save @babel/polyfill

@babel/preset-env 和 @babel/polyfill 和 babel-loader 用於整合 webpack 使瀏覽器支援 ES, React, TypeScript 語法

建立 .babelrc.js

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

@babel/preset-react 用於編譯 React 的 .jsx 檔案
其他 plugins 是對其 ES 語法進行擴充與支援，而這些套件通常只用於開發階段，因此必須安裝於 devDependencies

    npm install --save-dev @babel/preset-react
    npm install --save-dev @babel/plugin-syntax-dynamic-import @babel/plugin-proposal-object-rest-spread @babel/plugin-syntax-import-meta @babel/plugin-proposal-class-properties @babel/plugin-proposal-json-strings @babel/plugin-proposal-export-default-from @babel/plugin-proposal-export-namespace-from


## 安裝 webpack
[webpack](https://webpack.js.org/guides/installation/)

    npm install --save-dev webpack webpack-cli
    
不使用 webpack-cli 的 init 因為是舊版的，因此手動建立以下三個設定檔檔案
    
webpack.config.js

    const webpack = require('webpack');
    const path = require('path');
    const ManifestPlugin = require('webpack-manifest-plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
    
    module.exports = {
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        devtool: 'inline-source-map',
        devServer: {
            contentBase: './dist',
            hot: true
        },
        entry: {
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
        ],
        module: {
            rules: [
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

webpack.dev.js

    const merge = require('webpack-merge');
    const common = require('./webpack.config.js');
    
    module.exports = merge(common, {
        // mode: 'development',
        devtool: 'inline-source-map',
        plugins: common.plugins.concat([
        ]),
    });

webpack.prod.js

    const merge = require('webpack-merge');
    const common = require('./webpack.config.js');
    
    module.exports = merge(common, {
        // mode: 'production',
        // Avoid inline-*** and eval-*** use in production as they can increase bundle size and reduce the overall performance.
        devtool: 'cheap-module-source-map',
        plugins: common.plugins.concat([
        ]),
    });

然後接下來依序安裝缺少的module

    npm install --save-dev webpack-dev-server webpack-manifest-plugin webpack-merge html-webpack-plugin clean-webpack-plugin uglifyjs-webpack-plugin

package.json 新增指令，webpack-dev-server 開發階段伺服器可自動重新編譯並且載入，其中相依於 webpack-dev-middleware

    // package.json
    {
        "scripts": {
            "build": "webpack --progress --config webpack.prod.js",
            "start": "webpack-dev-server --open --config webpack.dev.js",
        }
    }
    
webpack-manifest-plugin 是用於產生編譯檔案後的對應 .json 文件 (已加入)

    // webpack.config.js
    var ManifestPlugin = require('webpack-manifest-plugin');
    module.exports = {
        // ...
        plugins: [
          new ManifestPlugin()
        ]
    };
    
webpack-merge 則是可以將設定檔分開管理

html-webpack-plugin 編譯建立html檔案

clean-webpack-plugin 編譯前清除特定檔案

uglifyjs-webpack-plugin 將 js 壓縮最佳化

設定環境變數 NODE_ENV

    set NODE_ENV=production

察看環境變數 NODE_ENV

    echo %NODE_ENV%

## 安裝 mocha 自動測試 跟 chai 測試語法

[chai](https://www.chaijs.com/)
[mocha](https://mochajs.org/)

    npm install --save-dev chai mocha mocha-loader @babel/register

@babel/register 搭配 mocha 所使用，讓即使在開發環境底下IDE也能執行 babel 後的語法

mocha 和 mocha-loader 用於編譯出瀏覽器也能執行的測試檔案

然後手動建立測試用的三個檔案

test/index.js 是測試檔案主體，可以引入其他測試檔案

    import function_test from './function.test';

test/function.test.js 是測試部分function運作，在此只是範例

    const {assert, expect, should} = require('chai');

    describe('Mocha Test', function () {
        describe('Basic', function () {
            it('should return number of charachters in a string', function () {
                assert.equal('Hello'.length, 5);
            });
            it('should return first charachter of the string', function () {
                assert.equal('Hello'.charAt(0), 'H');
            });
        });
    });

test/.eslintrc.js 額外的設定，可以使得 ESLint 知道test資料夾底下的js 是使用 mocha 的語法

    module.exports = {
        env: {
            'mocha': true,
        },
        rules: {
            'no-unused-vars': [
                'off',
                {}
            ],
            'no-console': [
                'off',
                {allow: ["warn", "error"]}
            ]
        }
    };

告知 webpack 將 mocha 套用於所有 test.js 結尾的所有檔案 (已加入)

    {
        test: /test\.js$/,
        exclude: /node_modules/,
        use: 'mocha-loader',
    },

可執行指令 新增到 package.json 的 scripts 當中

    {
        "scripts": {
            "test:mocha": "mocha --require @babel/register ./test/index.js",
        }
    }

注意指令中 --require @babel/register 是必須設定的額外參數，才能使得 IDE 執行時也能夠正常運作

    Mocha Extra options: --require @babel/register

## 安裝 react

    npm install --save react react-dom
    npm install --save-dev html-loader prop-types

建立 src/index.js

    import HelloWorld from './components/hello-world.jsx';

    export {
        HelloWorld
    };

建立 src/index.js 後修改 package.json 的 main 內容為 "main": "src/index.js"，表示被引用時 export 的內容

    {
      "main": "src/index.js",
    }

建立 src/components/hello-world.jsx

    import React from 'react';
    import PropTypes from 'prop-types';

    class HelloWorld extends React.Component {
        render() {
            return <h1>Hello, {this.props.name}</h1>;
        }
    }

    HelloWorld.propTypes = {
        name: PropTypes.string.isRequired
    };

    export {HelloWorld as default};

建立 src/page/index.html

    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <title>Index Page</title>
    </head>
    <body>
    <div id='root'></div>
    </body>
    </html>

建立 src/page/index.html 對應的 src/page/index.jsx

    import React from 'react';
    import ReactDOM from 'react-dom';
    import HelloWorld from '../components/hello-world.jsx';

    ReactDOM.render(
        <HelloWorld name="world!" /> ,
        document.getElementById('root')
    );

告知 webpack 如何載入 jsx (已加入)

    // webpack.config.js
    {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'babel-loader',
        options: {
            // Explicitly disable babelrc so we don't catch various config in much lower dependencies.
            babelrc: true,
        },
    },

告知 webpack 如何載入 html 檔案

    // webpack.config.js
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

告知 webpack ，新增 index.html 頁面，其對應關係透過 HtmlWebpackPlugin 關聯起來

    // webpack.config.js
    module.exports = {
        // ...
        entry: {
            'app': ['@babel/polyfill', './src/page/index.jsx'],
        },
        // ...
        plugins: [
            new HtmlWebpackPlugin({
                inject: true,
                chunks: ['runtime', 'app'],
                template: './src/page/index.html',
                filename: './index.html',
            }),
        ],
    }

## 安裝 PostCss
[PostCss](https://github.com/postcss/postcss)

    npm install --save-dev style-loader css-loader postcss-loader precss postcss-cli postcss-safe-parser autoprefixer stylelint stylelint-webpack-plugin

precss contains plugins for Sass-like features, like variables, nesting, and mixins.

autoprefixer adds vendor prefixes, using data from Can I Use.

stylelint-webpack-plugin allows defining a glob pattern matching the configuration and use of stylelint.

建立 postcss.config.js

    // postcss.config.js
    module.exports = {
        parser: require('postcss-safe-parser'),
        plugins: [
            require('precss'),
            require('autoprefixer')
        ]
    };

新增指令到 package.json

    // package.json
    {
        "scripts": {
            "build:css" : "postcss src/**/*.css --base src --dir dist --config postcss.config.js",
        }
    }

告知 webpack 如何載入 css 檔案

    // webpack.config.js
    module.exports = {
        module: {
            rules: [
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
        }
    }

使得 webpack 可以檢查所有 css 而不只是所有引入的檔案

    // webpack.config.js
    const StyleLintPlugin = require('stylelint-webpack-plugin');

    module.exports = {
      // ...
      plugins: [
        new StyleLintPlugin({}),
      ],
      // ...
    }

建立 src/page/index.css

    /* src/page/index.css */
    body {
        break-inside: avoid;
        break-after: page;
    }
    :fullscreen {
        display: flex;
    }

修改 index.jsx 加入 import index.css

    // src/page/index.jsx
    import React from 'react';
    import ReactDOM from 'react-dom';
    import HelloWorld from '../components/hello-world.jsx';
    import './index.css';

    ReactDOM.render(
        <HelloWorld name="world!" /> ,
        document.getElementById('root')
    );

## 設定瀏覽器支援 Browserlist

[Browserlist](https://github.com/browserslist/browserslist)
[browserl.ist](https://browserl.ist/)

在 package.json 中新增 browserslist

    // package.json
    {
      "browserslist": [
        "last 3 versions",
        "Safari >= 8",
        "iOS >= 8",
        "ie >= 8"
      ],
    }


## 額外問題

["Unresolved function or method" for require()](https://stackoverflow.com/questions/20136714/how-can-i-fix-webstorm-warning-unresolved-function-or-method-for-require-fi)

File > Settings > Language & Frameworks > Node.js and NPM
Then click the enable button (apparently in new versions, it is called "Coding assistance for Node").
打勾取消在打勾後，就會正常