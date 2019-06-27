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

    // package.json
    {   
        "files": [
            "src",
            "test",
            "*.js",
            ".eslintignore",
            ".travis.yml"
        ]
    }


## 安裝 webpack
[webpack](https://webpack.js.org/guides/installation/)

    npm install --save-dev webpack webpack-cli cross-env

cross-env 用於跨平台設定環境變數

建立 webpack.config.js

    // webpack.config.js
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
        ],
    });
    
    module.exports = [
        config
    ];

然後接下來依序安裝缺少的module

    npm install --save-dev webpack-dev-server webpack-manifest-plugin webpack-merge clean-webpack-plugin html-webpack-plugin terser-webpack-plugin

package.json 新增指令 ， webpack-dev-server 開發階段伺服器可自動重新編譯並且載入，相依於 webpack-dev-middleware

    // package.json
    {
        "scripts": {
            "start": "webpack-dev-server --open --config webpack.config.js",
            "build": "cross-env NODE_ENV=production webpack --progress --config webpack.config.js",
            "build:dev": "cross-env NODE_ENV=development webpack --progress --config webpack.config.js",
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

webpack-merge 用來將 Webpack 的設定進行複寫

html-webpack-plugin 編譯建立html檔案

clean-webpack-plugin 編譯前清除特定檔案

terser-webpack-plugin 產生最佳化壓縮後 js

設定環境變數 NODE_ENV

    set NODE_ENV=production

察看環境變數 NODE_ENV

    echo %NODE_ENV%


## 安裝 Babel
[Babel](https://babeljs.io/docs/en/usage)
[Try it out](https://babeljs.io/repl/build/master)

babel-loader 設定，如果沒有設定的話也會自動去尋找設定檔

    // webpack.config.js
    module.exports = {
        // ...
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    include: [path.resolve(__dirname, 'src')],
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    debug: true,
                                    useBuiltIns: 'usage', // 使用 babel 的 polyfill
                                    corejs: '2',
                                }
                            ],
                            '@babel/preset-react'
                        ],
                        plugins: [
                            '@babel/plugin-syntax-dynamic-import',
                            '@babel/plugin-proposal-object-rest-spread',
                            '@babel/plugin-syntax-import-meta',
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-json-strings',
                            '@babel/plugin-proposal-export-default-from',
                            '@babel/plugin-proposal-export-namespace-from',
                            '@babel/plugin-transform-async-to-generator',
                            '@babel/plugin-transform-runtime'
                        ],
                    },
                },
            ]
        }
    }

babel-loader, @babel/preset-env 和 @babel/polyfill, core-js@2 用於整合 webpack 使瀏覽器支援 ES, React 語法

    npm install --save-dev @babel/core @babel/cli @babel/preset-env babel-loader
    npm install --save @babel/polyfill core-js@2

@babel/preset-react 用於編譯 React 的 .jsx 檔案
其他 plugins 是對其 ES 語法進行擴充與支援，而這些套件通常只用於開發階段，因此必須安裝於 devDependencies

    npm install --save-dev @babel/preset-react
    npm install --save-dev @babel/plugin-syntax-dynamic-import @babel/plugin-proposal-object-rest-spread @babel/plugin-syntax-import-meta @babel/plugin-proposal-class-properties @babel/plugin-proposal-json-strings @babel/plugin-proposal-export-default-from @babel/plugin-proposal-export-namespace-from @babel/plugin-transform-async-to-generator @babel/plugin-transform-runtime


## 安裝 ESLint
[ESLint](https://eslint.org/docs/user-guide/getting-started)

    // --save-dev 跟 -D 都是一樣的option  會修改到 package.json 檔案中
    npm install --save-dev eslint eslint-loader eslint-plugin-react babel-eslint
        
/node_modules/.bin包含了所有可以執行的package指令        
        
    // 執行 eslint 中的初始化設定黨
    npx eslint --init
    
    // 實際可執行程式對應的位置
    node ./node_modules/eslint/bin/eslint.js --init

初始化選擇

1.  選擇最新的ES語法
2.  使用ES6 modules (import 語法)
3.  Browser, Node全選
4.  使用 CommonJS (require語法)
5.  使用 JSX 用於 React
6.  使用 React
7.  縮排使用空白符號
8.  使用單引號作為字串符號
9.  使用Unix的換行 (LF)
10. 需要半引號作為結尾
11. 使用JavaScript格式作為設定檔

修改縮排 indent 規則為以下所示

    'indent': [
        'error',
        4,
        {SwitchCase: 1}
    ],

修改字串符號規則，改為關閉

    'quotes': [
        'off',
        'single'
    ],

產生.eslintrc.js設定檔案後 Enable ESLint 關閉其他 Lint 如 JSLint

IDE畫面右下角可以切換 CRLF (Windows)、LF (Unix)、CR (Mac) 各種換行方式

eslint-loader 設定，不需要額外指定設定檔，因為會自動去找

    // webpack.config.js
    
    const eslintrc = require('./.eslintrc');
    module.exports = {
        // ...
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader',
                    options: eslintrc
                },
            ]
        }
    }

### [Disabling Rules with Inline Comments](https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments)

    /* eslint-disable */
    alert('foo');
    /* eslint-enable */

    /* eslint-disable no-alert, no-console */
    alert('foo');
    console.log('bar');
    /* eslint-enable no-alert, no-console */

    alert('foo'); // eslint-disable-line no-alert, quotes, semi
    
    // eslint-disable-next-line
    alert('foo');

[Enforce specifying rules to disable in eslint-disable comments](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-abusive-eslint-disable.md)


## [ESLint React](https://www.npmjs.com/package/eslint-plugin-react)

eslint-plugin-react 用於檢查 react 的語法，修改 .eslintrc.js 新增 plugin:react/recommended 到 extends

babel-eslint 用於去除一些 react 語法解析上的問題

`移除 plugins 中的 "react"`，因為我們已經使用 extends 的 plugin:react/recommended 取代

    // .eslintrc.js
    module.exports = {
        // ...
        'parser': 'babel-eslint',
        'env': {
            'browser': true,
            'commonjs': true,
            'es6': true,
            'node': true,
            'mocha': true,
        },
        'extends': ['eslint:recommended', 'plugin:react/recommended'],
        'settings': {
            'react': {
                'createClass': 'createReactClass',
                'pragma': 'React',
                'version': '16.6.3',
            },
            'propWrapperFunctions': [
                'forbidExtraProps',
            ]
        }
    };

其中 env 是指全域變數 global variables

建立 .eslintignore

    # .eslintignore
    # ESLint do test need .eslintignore, it is not limit by package.json files setting.
    # Build
    node_modules/*
    build/*
    dist/*

新增 package.json 可執行 ESLint 檢測的指令
    
    // package.json
    {
        "scripts": {
            "test:lint": "eslint . --ext .js,.jsx --config .eslintrc.js",
        }
    }


## 安裝 mocha 自動測試 跟 chai 測試語法

[chai](https://www.chaijs.com/)
[mocha](https://mochajs.org/)

    npm install --save-dev chai mocha mocha-loader @babel/register

@babel/register 搭配 mocha 所使用，讓即使在開發環境底下IDE也能執行 babel 後的語法

mocha 和 mocha-loader 用於編譯出瀏覽器也能執行的測試網頁

然後手動建立測試用的三個檔案

test/index.js 是測試檔案主體，可以引入其他測試檔案

    // test/index.js
    import './function.test';

test/function.test.js 是測試部分 function 運作，在此只是範例

    // test/function.test.js
    const {assert, expect, should} = require('chai'); // eslint-disable-line no-unused-vars

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

    // test/.eslintrc.js
    module.exports = {
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

    // webpack.config.js
    module.exports = {
        // ...
        entry: {
            'test': ['@babel/polyfill', './test/index.js'],
        },
        module: {
            rules: [
                {
                    test: /test\.js$/,
                    exclude: /node_modules/,
                    use: 'mocha-loader',
                },
            ]
        }
    }

可執行指令 新增到 package.json 的 scripts 當中

    // package.json
    {
        "scripts": {
            "test:mocha": "mocha --require @babel/register ./test/index.js",
        }
    }

@babel/register 會尋找 Babel 的設定檔，因此必須建立 .babelrc.js，這裡的設定跟 webpack.config.js 裡面的 babel-loader 的 option 設定一致。
而為了統一 babel 的設定檔，因此 webpack.config.js 會從 babelrc.js 載入有效設定到 babel-loader 當中。

    // .babelrc.js
    // for @babel/register, babel-loader
    let presets = [
        [
            '@babel/preset-env',
            {
                debug: true,
                useBuiltIns: 'usage', // 使用 babel 的 polyfill
                corejs: '2',
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
        '@babel/plugin-transform-async-to-generator',
    ];

    module.exports = {presets, plugins};

注意指令中 --require @babel/register 是必須設定的額外參數，才能使得 IDE 執行時也能夠正常運作

    Mocha Extra options: --require @babel/register

另外也可以指定其測試時預設 timeout 時間

    Mocha Extra options: --timeout 5000


## Dynamic Import

Webpack 限定版本為 4.28.x  4.29.6 不能正常解析 Dynamic Import

    npm install --save-dev babel-plugin-dynamic-import-node @babel/plugin-syntax-dynamic-import

    let plugins = [
        ...
        '@babel/plugin-syntax-dynamic-import',
        ...
    ];

    const _MOCHA_PATH = new RegExp('(\\\\|/)node_modules\\1mocha\\1bin\\1_mocha$');
    const isMochaRunning = process.argv.findIndex(arg => _MOCHA_PATH.test(arg)) > -1;
    if (isMochaRunning) {
        plugins.push('dynamic-import-node');
    }
    
@babel/plugin-syntax-dynamic-import 用於內容開頭的宣告 import foo from 'foo'; 的使用方式 和 import()， Babel 7.4.0 已整合在 @babel/preset-env

dynamic-import-node 用於 mocha 執行測試時的 node 環境 import() 


## 安裝 react

    npm install --save react react-dom prop-types
    npm install --save-dev html-loader

建立 src/index.js

    // src/index.js
    import HelloWorld from './components/HelloWorld.jsx';

    export {
        HelloWorld
    };

建立 src/index.js 後修改 package.json 的 main 內容為 "main": "src/index.js"，表示被引用時 export 的內容

    // package.json
    {
      "main": "src/index.js",
    }

建立 src/components/HelloWorld.jsx

    // src/components/HelloWorld.jsx
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

建立 src/web/index.html

    <!-- src/web/index.html -->
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

建立 src/web/index.html 對應的 src/page/index.jsx

    // src/web/index.jsx
    import React from 'react';
    import ReactDOM from 'react-dom';
    import HelloWorld from '../components/HelloWorld.jsx';

    ReactDOM.render(
        <HelloWorld name="world!" /> ,
        document.getElementById('root')
    );

告知 webpack 如何載入 html 檔案

    // webpack.config.js
    module.exports = {
        // ...
        module: {
            rules: [
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
            ]
        }
    }

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
                template: './src/web/index.html',
                filename: 'index.html',
            }),
        ],
    }


## React Hook

    npm install --save-dev eslint-plugin-react-hooks 

Then add it to your ESLint configuration:

    {
      "plugins": [
        // ...
        "react-hooks"
      ],
      "rules": {
        // ...
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
      }
    }


## 安裝 PostCss
[PostCss](https://github.com/postcss/postcss)

WebStorm 可以啟動 PostCss plugin 外掛

    npm install --save postcss-import
    npm install --save-dev style-loader css-loader postcss-loader postcss-cli postcss-safe-parser stylelint stylelint-webpack-plugin stylelint-config-recommended autoprefixer precss

postcss-import To resolve path of an @import rule

precss contains plugins for Sass-like features, like variables, nesting, and mixins.

autoprefixer adds vendor prefixes, using data from Can I Use.

stylelint-webpack-plugin allows defining a glob pattern matching the configuration and use of stylelint.
stylelint-webpack-plugin 目前似乎尚未完善

stylelint-config-recommended 用於 stylielint 設定檔

建立 postcss.config.js

    // postcss.config.js
    module.exports = {
        parser: require('postcss-safe-parser'),
        plugins: [
            require('postcss-import'),
            require('precss'),
            require('autoprefixer')
        ]
    };

建立 stylelint.config.js

    // stylelint.config.js
    module.exports = {
        'extends': 'stylelint-config-recommended',
        'plugins': [],
        'rules': {}
    };

新增指令到 package.json

    // package.json
    {
        "scripts": {
            "test:css": "stylelint src/**/*.css src/**/*.scss",
            "build:css": "postcss src/**/*.css src/**/*.scss --base src --dir dist --config postcss.config.js"
        }
    }

告知 webpack 如何載入 css 檔案，postcss-loader會自動去尋找設定檔，因此不需要額外設定

    // webpack.config.js
    module.exports = {
        module: {
            rules: [
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
        }
    }

使得 webpack 可以檢查所有 css 而不只是所有引入的檔案

    // webpack.config.js
    const StyleLintPlugin = require('stylelint-webpack-plugin');

    module.exports = {
        // ...
        plugins: [
            new StyleLintPlugin(),
        ],
    }

建立 src/web/index.css

    /* src/web/index.css */
    @import "red.css";

    body {
        break-inside: avoid;
        break-after: page;
    }
    :fullscreen {
        display: flex;
    }

建立 src/web/red.scss

    /* src/web/red.scss */
    $red-color: #880000;
    * {
        color: $red-color;
    }

修改 index.jsx 加入 import index.css

    // src/web/index.jsx
    import React from 'react';
    import ReactDOM from 'react-dom';
    import HelloWorld from '../components/HelloWorld.jsx';
    import './index.css';

    ReactDOM.render(
        <HelloWorld name="world!" /> ,
        document.getElementById('root')
    );


## Redux 

    npm install --save redux react-redux


## redux-devtools-extension

[redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension#installation)

[use-redux-devtools-extension-package-from-npm](https://github.com/zalmoxisus/redux-devtools-extension#13-use-redux-devtools-extension-package-from-npm)

    npm install --save-dev redux-devtools-extension
    
使用方式    
    
    import {createStore, applyMiddleware, compose} from 'redux'; 
    
    // eslint-disable-next-line no-underscore-dangle
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    
    const store = createStore(
        rootReducer,
        composeEnhancers(
            // applyMiddleware(...middleware),
            // other store enhancers if any
        )
    );    


## react-router-dom

    npm install --save react-router-dom


## Redux Todo List


##  enzyme

    npm install --save-dev enzyme enzyme-adapter-react-16

修改設定測試檔 setupTests.js

    // setupTests.js
    import {configure} from 'enzyme';
    import Adapter from 'enzyme-adapter-react-16';
    
    configure({adapter: new Adapter()});

新增指令參數

    mocha --require setupTests.js


## [enzyme_render_diffs](https://gist.github.com/fokusferit/e4558d384e4e9cab95d04e5f35d4f913)

### Shallow

Real unit test (isolation, no children render)

### Simple shallow

Calls:

- constructor
- render

### Shallow + setProps

Calls:

- componentWillReceiveProps
- shouldComponentUpdate
- componentWillUpdate
- render

### Shallow + unmount

Calls:

- componentWillUnmount

### Mount

The only way to test componentDidMount and componentDidUpdate.
Full rendering including child components.
Requires a DOM (jsdom, domino).
More constly in execution time.
If react is included before JSDOM, it can require some tricks:

`require('fbjs/lib/ExecutionEnvironment').canUseDOM = true;` 

### Simple mount

Calls:

- constructor
- render
- componentDidMount

### Mount + setProps

Calls:

- componentWillReceiveProps
- shouldComponentUpdate
- componentWillUpdate
- render
- componentDidUpdate

### Mount + unmount

Calls:

- componentWillUnmount


### Render

only calls render but renders all children.

So my rule of thumbs is:

- Always begin with shallow
- If componentDidMount or componentDidUpdate should be tested, use mount
- If you want to test component lifecycle and children behavior, use mount
- If you want to test children rendering with less overhead than mount and you are not interested in lifecycle methods, use render

There seems to be a very tiny use case for render. I like it because it seems snappier than requiring jsdom but as @ljharb said, we cannot really test React internals with this.

I wonder if it would be possible to emulate lifecycle methods with the render method just like shallow ?
I would really appreciate if you could give me the use cases you have for render internally or what use cases you have seen in the wild.

I'm also curious to know why shallow does not call componentDidUpdate.

Kudos goes to https://github.com/airbnb/enzyme/issues/465#issuecomment-227697726 this gist is basically a copy of the comment but I wanted to separate it from there as it includes a lot of general Enzyme information which is missing in the docs.


## [JSDOM + Mocha](https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md#jsdom--mocha)

用於 IDE 的 Node 環境下模擬 DOM 環境

    npm install --save-dev jsdom

修改設定測試檔 setupTests.js
    
    // setupTests.js
    const { JSDOM } = require('jsdom');
    
    const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
    const { window } = jsdom;
    
    function copyProps(src, target) {
      Object.defineProperties(target, {
        ...Object.getOwnPropertyDescriptors(src),
        ...Object.getOwnPropertyDescriptors(target),
      });
    }
    
    global.window = window;
    global.document = window.document;
    global.navigator = {
      userAgent: 'node.js',
    };
    global.requestAnimationFrame = function (callback) {
      return setTimeout(callback, 0);
    };
    global.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
    copyProps(window, global);

新增指令參數

    mocha --require setupTests.js


##  i18n

    npm install --save-dev babel-plugin-react-intl babel-plugin-react-intl-auto
    npm install --save query-string

[babel-plugin-react-intl](https://github.com/yahoo/babel-plugin-react-intl) 產生個別 message

建立 scr/components/Greeting.jsx

    import React from 'react';
    import PropTypes from 'prop-types';
    import {injectIntl, FormattedMessage, defineMessages} from 'react-intl';
    import LocaleFooter from './LocaleFooter.jsx';
    
    const message = defineMessages({
        id: 'greeting',
        defaultMessage: 'Hi, \\{{name}\\}'
    });
    
    class Greeting extends React.Component {
        render() {
            const {name, intl} = this.props; // eslint-disable-line no-unused-vars
            return (<div>
                <h1>
                    <FormattedMessage
                        {...message.greeting}
                        values={{
                            name
                        }}
                    />
                </h1>
                <LocaleFooter/>
            </div>);
        }
    }
    
    Greeting.propTypes = {
        name: PropTypes.string.isRequired,
        intl: PropTypes.object.isRequired
    };
    
    const WrappedGreeting = injectIntl(Greeting);
    
    export {
        WrappedGreeting as default
    };

[babel-plugin-react-intl-auto](https://github.com/akameco/babel-plugin-react-intl-auto) 用於自動產生 message 的 id

使用 babel-plugin-react-intl-auto 後可以將 defineMessages 程式碼簡化成

    const message = defineMessages({
        greeting: 'Hi, \\{{name}\\}'
    });

修改 .babelrc.js 設定檔，新增 plugin 設定，使得輸出 message 到 指定資料夾中

    ['react-intl-auto', {
        'removePrefix': 'app/'
    }],
    ["react-intl", {
        "messagesDir": "./translations/messages/"
    }],

scratch-l10n 將個別的 message 的檔案 整合成單一語言檔案

將  scratch-l10n 中的 scripts/build-i18n-src.js 複製到當前資料夾下 ./scripts/build-i18n-src.js 

可執行指令 新增到 package.json 的 scripts 當中

    // package.json
    {
        "scripts": {
            "i18n:src": "node ./scripts/build-i18n-src.js ./translations/messages/src ./translations/"
        }
    }

這指令將會把 ./translations/messages/src 中所有的 messages 整合成一個 en.json 檔案放到 ./translations/ 底下

之後將產生出來的 en.json 改成其他語言的 json 檔案 放在相同的資料夾底下(如 zh-tw.json)，最後在使用 彙整的指令整合在一起 (參考 scripts/build-data.js 的寫法) 

新增指令為

    // package.json
    {
        "scripts": {
            "build:msgs": "node ./scripts/merge-messages.js ./translations"
        }
    }
    
執行後會在 ./translations 底下產生 msgs.js 的資料夾 ， 若指定語言下 其 msgs.js 並沒有指定id的對應字串的話，則以當初 defineMessages 中 defaultMessage 的值做為顯示    
    
IntlProvider 是被 Context.Provider 所包覆   
    
    // import {IntlProvider} from 'react-intl';
    <Context.Provider>
        <IntlProvider />
    </Context.Provider>   
    
當 IntlProvider 被 react-redux 所 connect 的時候，則會額外多出 <Connect(IntelProvider)> 跟 <Context.Consumer> 所包覆

    // import {IntlProvider} from 'react-intl';
    // import {connect} from 'react-redux';
    <Context.Provider>
    
        <Connect(IntelProvider)>
            <Context.Consumer>
            
                <IntlProvider />
                
            </Context.Consumer>
        </Connect(IntelProvider)
        
    </Context.Provider>  

當使用 injectIntl 的時候，再用一個 <InjectIntl> 所包覆起來

    <InjectIntl(Component)>
        <Component />
    </InjectIntl>

scratch-translate-extension-languages 將單一語言檔案 翻譯成其他語言檔案


## Jest

    npm install --save-dev jest babel-jest babel-core@^7.0.0-bridge.0 react-test-renderer

新增指令到 package.json

    // package.json
    {
        "scripts": {
            "test:jest": "jest __test__ --no-cache --watch",
        }
    }

test:jest 使用 watch 模式開啟，進入模式後使用互動的方式(i)逐步更新 snapshot 。

注意因為 jest snapshot 測試自動產生的 \_\_snapshots\_\_ 資料夾中的檔案應視為程式碼，一併加入VCS當，才能追蹤其變化。

### Snapshot test

建立 \_\_test\_\_/snapshot.test.js

    import React from 'react';
    import renderer from 'react-test-renderer';
    
    it('renders correctly', () => {
        const tree = renderer
            .create(<a href="http://www.facebook.com">Facebook</a>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

建立 \_\_test\_\_/.eslintrc.js

    module.exports = {
        env: {
            'jest': true,
            'mocha': false
        },
        rules: {
            'no-unused-vars': [
                'off',
                {}
            ],
            'no-console': [
                'off',
                {allow: ["warn", "error"]}
            ],
        }
    };


## Sinon

    npm install --save-dev sinon

建立 test/sinon.test.js
    
    import {assert, expect, should} from 'chai'; // eslint-disable-line no-unused-vars
    import sinon from 'sinon';
    
    describe('Sinon', () => {
        describe('Spy', () => {
            it('should call method once with each argument', () => {
                let api = {method: x => x};
                let spy = sinon.spy(api, 'method');
    
                api.method(42);
                api.method(1);
    
                assert(spy.withArgs(42).calledOnce);
                assert(spy.withArgs(1).calledOnce);
                assert.equal(spy.returnValues[0], 42);
                assert.equal(spy.returnValues[1], 1);
                assert.equal(spy.args[0][0], 42);
                assert.equal(spy.args[1][0], 1);
            });
        });
        describe('Stub', () => {
            it('test should stub method differently based on arguments', function () {
                // Test stubs are functions (spies) with pre-programmed behavior.
                let api = {method: () => 0};
                let callback = sinon.stub(api, 'method').callsFake(() => 2);
                callback.withArgs(42).returns(1);
                callback.withArgs(1).throws(new Error('name'));
    
                assert.equal(api.method(), 2);
                assert.equal(api.method(42), 1);
                assert.throws(() => api.method(1), Error, 'name');
            });
        });
        describe('Mock', () => {
            it('test should call once when exceptions', () => {
                let api = {
                    method: function () {
                    }
                };
                let mock = sinon.mock(api);
                mock.expects('method').exactly(1);
                api.method();
                mock.verify();
            });
        });
        describe('Fake', () => {
            function once(fn) {
                let returnValue, called = false;
                return function () {
                    if (!called) {
                        called = true;
                        returnValue = fn.apply(this, arguments);
                    }
                    return returnValue;
                };
            }
    
            it('calls the original function', () => {
                let callback = sinon.fake();
                let proxy = once(callback);
    
                proxy();
                proxy();
                proxy();
    
                assert.equal(callback.called, true);
                assert.equal(callback.callCount, 1);
            });
            it('calls original function with right this and args', () => {
                let callback = sinon.fake();
                let proxy = once(callback);
                let obj = {};
    
                proxy.call(obj, 1, 2, 3);
    
                assert(callback.calledOn(obj));
                assert(callback.calledWith(1, 2, 3));
            });
            it('returns the return value from the original function', () => {
                let callback = sinon.fake.returns(42);
                let proxy = once(callback);
    
                assert.equal(proxy(), 42);
            });
        });
        describe('Fake Clock', () => {
            let clock;
            beforeEach(() => {
                // runs before all tests in this block
                clock = sinon.useFakeTimers();
            });
            afterEach(() => {
                // runs after all tests in this block
                clock.restore();
            });
            it('calls callback after 100ms', function () {
                function debounce(callback) {
                    let timer;
                    return function () {
                        clearTimeout(timer);
                        let args = [].slice.call(arguments);
                        timer = setTimeout(function () {
                            callback.apply(this, args);
                        }, 100);
                    };
                }
    
                let callback = sinon.fake();
                let throttled = debounce(callback);
    
                throttled();
    
                clock.tick(99);
                assert.equal(callback.notCalled, true);
    
                clock.tick(1);
                assert.equal(callback.calledOnce, true);
    
                assert.equal(new Date().getTime(), 100);
            });
        });
    });

修改 test/index.js

    import './function.test';
    import './sinon.test';


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

### ["Unresolved function or method" for require()](https://stackoverflow.com/questions/20136714/how-can-i-fix-webstorm-warning-unresolved-function-or-method-for-require-fi)

File > Settings > Language & Frameworks > Node.js and NPM
Then click the enable button (apparently in new versions, it is called "Coding assistance for Node").
打勾取消在打勾後，就會正常

### [Page requested without authorization](https://intellij-support.jetbrains.com/hc/en-us/community/posts/207120569-Page-requested-without-authorization)

File > Settings > Build, Execution, Deployment > Debugger
"Allow unsigned requests" option enabled

### [Remove babelrc from loader-specific options](https://github.com/babel/babel-loader/commit/053c9f6ea115484fc63ea19ee484b863275d4c67#diff-04c6e90faac2675aa89e2176d2eec7d8)

babel 跟 babel-loader 設定上並不是完全通用，webpack只是透過 babel-loader 去調用 babel 的功能而已。其他loader也是一樣。

### [Doesn't compile a npm linked module](https://github.com/babel/babel-loader/issues/149#issuecomment-320581223)

    // webpack.config.js
    module.exports = {
        // ...
        resolve: {
            symlinks: false
        },
    }

另外 babel-loader 的 option 必須明確指定 presets 和 plugins

    // webpack.config.js
    module.exports = {
        // ...
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    include: [path.resolve(__dirname, 'src')],
                    loader: 'babel-loader',
                    options: {
                        presets: ...
                        plugins: ...
                    },
                },
            ]
        }
    }

### [uglifyjs-webpack-plugin ES6 support broken](https://github.com/webpack-contrib/uglifyjs-webpack-plugin/issues/362#issuecomment-425849160)

Use https://github.com/webpack-contrib/terser-webpack-plugin for ES6 (webpack@5 will be use this plugin for uglification)

### CSS

[Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
[@media](https://developer.mozilla.org/en-US/docs/Web/CSS/@media)

### [Node.js heap out of memory](https://stackoverflow.com/a/53443394/1584100)

    export NODE_OPTIONS=--max_old_space_size=4096
    
設定環境變數使得 node 的記憶體空間更大，預設約1.7G左右