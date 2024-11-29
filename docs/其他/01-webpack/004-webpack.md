# webpack

- [10天搞定webpack4](https://www.bilibili.com/video/BV1a4411e7Bz)

>  代码转换、文件优化、代码分割、模块管理、自动刷新、代码检验、自动发布

## 1.基础语法

### 1.1 输入\输出

可以指定一个入口或者多个入口，可以是`String` `Array` `Object`

+ `String`：打包形成一个chunk，输出一个bundle文件，输出文件名称默认是main
+ `Array`：所有入口文件最终只会形成一个chunk，输出一个bundle文件
+ `Object`：几个入口文件就有几个bundle文件，chunk名称是[key]

```js
const { resolve } = require("path")

module.exports = {
  entry: "./src/index.js", // String 单入口
  // entry: ["./src/index.js", "./src/index.js"], // Array 多入口
  // entry: { // 多入口
  //   "main": "./src/index.js",
  //   "test": "./src/index.js"
  // },
  output: { // 输出
    filename: 'js/[name].[chunkhash:10].js', // 文件夹/文件名称
    path: resolve(__dirname, 'build'), // 输出文件目录
    publicPath: '/', // 所有资源引入公共路径前缀
    chunkFilename: 'js/[name]_chunk.js', // 非入口chunk的名称
    library: '[name]', // 整个库向外暴漏的变量名
    libraryTarget: 'window' // 目标环境 global ｜ commonjs
  }
}
```



### 1.2 module

+ 主要处理非js文件

```js
const { resolve } = require("path")

module.exports = {
  module: {
    rules: [
      { // eslint
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre', // previous 在mormal loader 前置执行， post
        loader: 'eslint-loader',
        options: {
          cache: true,
          fix: true // ESLint自动修复功能
        }
      },
      {
        oneOf: [ // 以下loader只会匹配一次
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'thread-loader',
                options: {
                  workers: 2
                }
              },
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        // 按需加载
                        useBuiltIns: 'usage',
                        corejs: {
                          version: 3 
                        },
                        targets: {
                          chrome: '58',
                          firefox: '60',
                          ie: '11',
                          safari: '10',
                          edge: '17'
                        }
                      }
                    ]
                  ],
                  cacheDirectory: true // babel 缓存
                }
              }
            ]
          },
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-preset-env')()
                  ]
                }
              }
            ]
          },
          {
            test: /\.less$/,
            use: [
              'style-loader',
              'css-loader',
              'less-loader'
            ]
          },
          {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: "url-loader",
            options: {
              limit: 8 * 1024,
              name: '[hash:10].[ext]',
              esModule: false,
              outputPath: 'img'
            }
          },
          {
            test: /\.html$/i,
            loader: 'html-loader',
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'fonts/[name].[hash:7].[ext]'
            }
          },
          {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[hash:7].[ext]',
              outputPath: 'media'
            }
          }
        ]
      }
    ]
  },
}
```

### 1.3 plugins

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: true, // 删除双引号
        collapseWhitespace: true // 折叠空行
      },
      hash: true // 添加 hash 戳
    }),
    new MiniCssExtractPlugin({
      filename: 'css/build.[chunkhash:10].css'
    }),
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    }),
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    }),
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json')
    }),
    // 将某个文件打包输出出去，并在html文件中引入它
    new AddAssetAtmlWebpackPlugin({
      filepath: resolve(__dirname, 'dll/jquery.js')
    })
  ],
}
```

### 1.4 mode

```js
module.export = {
  mode: "production", // development
}
```

### 1.5 devServer

```js
module.export = {
  devServer: {
    overlay: { // 如果出错了，不要全频显示
      warnings: false,
      errors: true
    },
    contentBase: resolve(__dirname, 'build'), // 运行代码的目录 指定 build 文件夹作为静态服务
    watchContentBase: true, // 监听 contentBase 目录下的文件，一旦变化就 reload
    watchOptions: { // 忽略监听文件
      ignored: /node_modules/
    },
    compress: true, // gzip压缩
    progress: true, // 进度条
    port: 8989,
    hot: true, // hmr
    open: true,
    clientLogLevel: 'none', // 不要显示启用服务器日志信息
    quiet: true, // 除去一些基本启用信息以外，其他内容都不要展示
    proxy: {
      "/api": {
        target: "https://cli.vuejs.org/config/",
        changeOrigin: true,
        pathRewrite: {
          ['^/api']: ''
        }
      }
    }
  },
}
```

### 1.6 optimization

```js
module.export = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30 * 1024, // 分割chunk的最小为30kb
      maxChunks: 0, // 没有最大限制
      maxAsyncRequests: 5, // 按需加载时并行加载文件的最大数量
      maxInitialRequests: 3, // 入口js文件最大并行请求数量
      automaticNameDelimiter: '~', // 名称链接符
      name: true, // 可以使用命名规则
      cacheGroups: { // 分割chunk的组
        // node_modules文件会被打包到 venders组的chunk中，
        // venders-xxx.js
        // 满足上面的公共规则，如大小超过30kb，至少被引用1次
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 优先级
        },
        default: {
          minChunks: 2, // 要提取的chunk最少被引用2次
          prioity: -20, // 优先级
          reuseExistingChunk: true // 如果当前要打包的模块，和之前已经被提取的模块是同一个，就会复用，而不是重新打包
        }
      },
      // 当前模块的记录其他模块的hash单独打包为一个文件 runtime
      // 解决：修改a文件导致b文件的contenthash变化
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`
      },
      minimizer: {
        new TerserWebpackPlugin({
          cache: true, // 是否缓存
          parallel: true, // 并发打包
          sourceMap: true // 启用sourceMap
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
          cssProcessorOptions: {
            safe: true
          }
        })
      }

    }
  }
}
```

### 1.7 resolve

```js
module.export = {
  resolve: { // 解析第三方模块
    modules: [path.resolve('node_modules')], // 告诉webpack去哪里解析模块
    extensions: ['.js', '.json', '.jsx'], // 配置省略文件路径的后缀名
    mainFields: ['style', 'main'], // 先找 package.json 中的 style 字段，在找 main 字段
    alias: { // 别名
      bootstrap: 'bootstrap/dist/css/bootstrap.css'
    }
  },
}
```

### 1.8 devtool

```js
module.export = {
  /** devtool 配置项
  1） source-map 源码映射，生成单独的加映射文件，调试源代码，会标记出错的列和行
  2） eval-source-map 不会生成单独的文件，会标记出错的列和行
  3） 'cheap-module-source-map' 不会产生列，但是是一个单独的映射文件
  4） 'cheap-module-eval-source-map' 不会产生文件，集成在打包后的文件中，而且不会产生列 
  */
  devtool: 'source-map',
}
```

### 1.9 watch

```js
module.export = {
  /** 监控代码变换，实时打包  */
  watch: true,
  watchOptions: { // 监控选项
    poll: 1000, // 每秒 1000 检测
    aggregateTimeout: 500,// 防抖
    ignored: /node_modules/
  },
}
```

## 2.常用插件

### 2.1 配置脚本

```json
{
  "scripts": {
    "dev": "webpack-dev-server --config webpack.config.js --colors",
    "build": "webpack --config webpack.config.js --colors"
  }
}

//自定义打包配置文件： webpack.config.xxx.js 执行命令 npx webpack --config webpack.config.xxx.js
module.exports = {/* ... */}
```

### 2.2 基本插件

1. `webpack-dev-server`

```js
// npm i webpack-dev-server -D
devServer: {
  port: 8081,
  progress: true, // 进度条
}
```

2. `html-webpack-plugin`

```js
// npm i html-webpack-plugin -D
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: true, // 删除双引号
        collapseWhitespace: true // 折叠空行
      },
      hash: true // 添加 hash 戳
    })
  ]
  // ...
}
```

3. `css-loader less less-loader mini-css-extract-plugin postcss-loader style-loader url-loader` 

```js
// npm i css-loader less less-loader mini-css-extract-plugin postcss-loader style-loader url-loader -D
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
module.exports = {
  // ...
  plugins: [
    new MiniCssExtractPlugin({
      filename: path.posix.join('static', 'css/[name].[contenthash].css'),
      // disable: false,  //是否禁用此插件
      // allChunks: true,
      // publicPath: '',
      options: {
        insert: 'head'
      }
    })
  ],
  module: {
    rules: [
      { // css
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // localIdentName:'[name]-[local]-[hash:base64:6]',
              publicPath: '../../'
            }
          },
          {
            loader: 'css-loader',
            options: {
              url: true,
              modules: {}
            }
          },
          'postcss-loader'
        ]
      },
      { // less
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../'
            }
          },
          {
            loader: 'css-loader',
            options: {}
          },
          'less-loader',
          'postcss-loader'
        ]
      },
    ]
  }
  // ...
}
```

4. `postcss.config.js`

```js
module.exports = {
  plugins: {
    'autoprefixer': {
      overrideBrowserslist: 'last 5 version'
    }
  }
}
```

5. `optimize-css-assets-webpack-plugin`

```js
// `postcss-loader` 配合`autoprefixer`给样式加前缀
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 用于优化\最小化CSS
const TerserJSPlugin = require('terser-webpack-plugin') // js 压缩

module.exports = {
  // ...
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        cache: true, // 是否缓存
        parallel: true, // 并发打包
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        cssProcessorOptions: {
          safe: true
        }
      })
    ]
  },
  // ...
}
```

6. `terser-webpack-plugin``
7.  ``@babel/preset-env @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties @babel/plugin-transform-runtime `-

```js
//  `ES6` 语法转换
// npm i @babel/preset-env @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties @babel/plugin-transform-runtime -D
// npm i @babel/runtime -S
require("core-js-pure/stable")
require("regenerator-runtime/runtime")

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ // 预设
              ["@babel/preset-env", {
                "useBuiltIns": "usage",
                "targets": {
                  "chrome": "58",
                  "ie": "11"
                }
              }]
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', {'legacy': true}], // 装饰器
              ['@babel/plugin-proposal-class-properties', {'loose': true}], // Class
              "@babel/plugin-transform-runtime"
            ]
          }
        },
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
    ]
  }
  // ...
}
```

`@babel/polyfill` 已弃用，参看：[core-js@3带来的惊喜](https://www.cnblogs.com/sefaultment/p/11631314.html)、[corejs](https://babeljs.io/docs/en/babel-plugin-transform-runtime#corejs)

8. `eslint eslint-loader`

```js
// npm i eslint eslint-loader -D
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre', // previous post，在mormal loader 前置执行
        use: {
          loader: 'eslint-loader',
          options: {
            cache: true,
            fix: true // ESLint自动修复功能
          }
        },
        enforce: 'pre', // previous post
        exclude: /node_modules/
      }
    ]
  }
  // ...
}
```

[官方配置地址](https://eslint.org/demo) => `Rules Configuration`

```json
{
  "parserOptions": {
    "ecmaVersion": 11,
    "sourceType": "module",
    "ecmaFeatures": {
      "globalReturn": true
    }
  },
  "rules": {},
  "env": {
    "node": true,
    "commonjs": true,
    "es6": true
  }
}

```



### 2.3 第三方模块使用

> 以依赖于 `jquery` 为类，将`module`中的模块挂载到`window`上。

+ 方法一

```js
// npm i jquery -S
// expose-loader 暴露全局的loader/内联的loader 到 window上
import $ from 'expose-loader?$!jquery'
// pre 前面执行的loader normal--普通loader/内联loader/后置post-loader
console.log('window.$',window.$) // 类似于 CDN 引入文件
```

+ 方法二

```js
// npm i jquery -S
import $ from 'jquery'
console.log('window.$',window.$)
```

配置：

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      { // 将 jquery 暴露给 window
        test: require.resolve('jquery'),
        use: 'expose-loader?$'
      }
    ]
  }
  // ...
}
```

+ 方法三：在每个模块中注入`$` 对象，不打包`jquery`：

```js
console.log('$', $) // 在模块中使用，但是 $ 不存在window中
```



```js
// webpack.config.js
module.exports = {
  // ...
  plugins: [
    new Webpack.ProvidePlugin({ // 在每个模块注入 $ 对象
      "$": "jquery"
    })
   ]
  // ...
}
```

+ 方法四：`CDN` 引入：

```html
<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.js"></script>
```

防止在模块中多次`import jquery`，导致打包体积变大：

```js
// webpack.config.js
module.exports = {
  // ...
  externals: { // 不打包 jquery
    jquery: 'jquery'
  }
  // ...
}
```

### 2.4 打包图片

在`js`中生成图片、在`css`插入图片、在`html`中插入图片

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            name:  path.posix.join('static', 'img/[name].[hash:7].[ext]'),
            esModule: false,
            limit: 5 * 1024,
            // outputPath: 'img/',
            // name: '[name].[hash:7].[ext]',
            // publicPath:'img/'
            // publicPath: 'http://www.houfee.top/' // 只为打包的图片添加 地址路径
          }
        }
      },
    ]
  }
  // ...
}
```



## 3.webpack其他配置

### 3.1 source-map

说明：

```js
// webpack.config.js
module.exports = {
  // ...
  // 1） source-map 源码映射，生成单独的加映射文件，调试源代码，会标记出错的列和行
  // 2） eval-source-map 不会生成单独的文件，会标记出错的列和行
  // 3） 'cheap-module-source-map' 不会产生列，但是是一个单独的映射文件
  // 4） 'cheap-module-eval-source-map' 不会产生文件，集成在打包后的文件中，而且不会产生列 
  devtool: 'source-map',
  // ...
}
```



### 3.2 实时打包

```js
// webpack.config.js
module.exports = {
  // ...
  watch: true,
  watchOptions: { // 监控选项
    poll: 1000, // 每秒 1000 检测
    aggregateTimeout: 500,// 防抖
    ignored: /node_modules/
  },
  // ...
}
```



### 3.3 其他插件

+ `clean-webpack-plugin`——用于删除/清理构建文件夹
+ `copy-webpack-plugin`——将单个文件或整个目录（已存在）复制到构建目录
+ `bannerPlugin`——版权声明

`npm install -D clean-webpack-plugin  copy-webpack-plugin`

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// webpack.config.js
module.exports = {
  // ...
  plugins: [
    // 重新打包时，清除打包目录
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: 'doc', to: './readme' }
    ]),
    new Webpack.BannerPlugin('版权所有，翻版必究，么么哒')
  ],
  // ...
}
```



### 3.4 `webpack` 配置跨域

#### 3.4.1 模拟前后台分离

```js
// server.js  执行： node ./server.js
let express = require('express')

let app = express()

app.get('/user',(req, res) => {
  res.json('server 服务')
})

app.listen(4000) // 将服务跑在 4000 端口
```



```js
// index.js 发送 ajax
let xhr = new XMLHttpRequest()
// 默认访问： http://localhost:8081/api/user —— webpack-dev-server 的服务
// 将 8081 端口上的服务 转发给 server.js 起得4000端口 的服务
xhr.open('GET', '/api/user', true)
xhr.onload = () => {
  console.log(xhr.response)
}
xhr.send()

```



```js
// webpack.config.js
module.exports = {
  // ...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // 将 8081 转发为 4000
        pathRewrite: {
          '^/api': '' // 重写时域名为空
        }
      }
    },
    port: 8081
  },
  // ...
}
```



#### 3.4.2 前端 MOCK 数据

```js
// webpack.config.js
module.exports = {
  // ...
  devServer: {
    before(app) {
      app.get('/api/user',(req, res) => {
        res.json('server 服务 ---- before 钩子')
      })
    },
    port: 8081
  },
  // ...
}
```



#### 3.4.3 有服务端

+ 不用代理来处理，在服务端启动webpack，此时服务端的端口有webpack的端口

中间件：`cnpm i webpack-dev-middleware -D`

```js
// server.js  执行： node ./server.js
let express = require('express')
let webpack = require('webpack')
let app = express()

// 中间件
let middle = require('webpack-dev-middleware')

let config = require('./webpack.config.js')

let compiler = webpack(config)

app.use(middle(compiler))

app.get('/user',(req, res) => {
  res.json('server 服务')
})

app.listen(4000)
```



```js
// webpack.config.js
module.exports = {
  // ...
  devServer: {
    port: 8081
  },
  // ...
}
```



`运行 node server.js, 访问：http://localhost:4000/，不访问8081端口。`



### 3.5 resolve

解析第三方模块

```js
// webpack.config.js
module.exports = {
  // ...
  resolve: {
    modules: [path.resolve('node_modules')],
    mainFields: ['style', 'main'], // 入口文件 先找 package.json 中的 style 字段，在找 main 字段
    // mainFields 和 alias 两者实现一种即可
    // alias: { // 别名，使用 bootstrap 代替 'bootstrap/dist/css/bootstrap.css'，可以在js中直接 import
    //   bootstrap: 'bootstrap/dist/css/bootstrap.css'
    // }
  },
  // ...
}
```



### 3.6 定义环境变量

```js
// webpack.config.js
module.exports = {
  // ...
  plugins: [
    new Webpack.DefinePlugin({ // 定义环境变量
      ENV: JSON.stringify('production'), // production
      FLAG: 'true', // boolean
      EXPRESSION: '5*8' // number
    }),
  ]
  // ...
}
```



```js
// index.js 引用
console.log('DefinePlugin定义环境变量：', ENV, FLAG, EXPRESSION)
```



### 3.7 区别环境

`cnpm i webpack-merge -D`

```js
// webpack.base.js 公共配置
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const Webpack = require('webpack')

require("core-js-pure/stable")
require("regenerator-runtime/runtime")

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  devServer: {
    port: 8082,
  },
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: './static/js/bundle.js',
    path: path.join(__dirname, './build')
  },
  resolve: { // 解析第三方模块
    modules: [path.resolve('node_modules')],
    extensions: ['.js', '.css', '.json'],
    mainFields: ['style', 'main'], // 先找 package.json 中的 style 字段，在找 main 字段
  },
  plugins: [
    new Webpack.DefinePlugin({ // 定义环境变量
      ENV: JSON.stringify('production'), // production
      FLAG: 'true',
      EXPRESSION: '5*8'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true
      },
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: path.posix.join('static', 'css/[name].[contenthash].css'),
      options: {
        insert: 'head'
      }
    }),
    new Webpack.ProvidePlugin({ // 在每个模块注入 $ 对象
      "$": "jquery"
    }),
  ],
  module: {
    rules: [
      { // html 页面加载图片
        test: /\.html$/,
        use: 'html-withimg-loader'
      },
      { // js
        test: /\.js$/,
        include: [resolve('src')],//需要处理的文件夹
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["@babel/preset-env", {
                "useBuiltIns": "entry", // entry usage
                "corejs": 3,
                "targets": {
                  "chrome": "58",
                  "ie": "11"
                }
              }]
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', {'legacy': true}],
              ['@babel/plugin-proposal-class-properties', {'loose': true}],
              "@babel/plugin-transform-runtime"
            ]
          }
        },
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
      { // css - 这是加载第三方css-自己的样式写在less中
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
      { // less
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // localIdentName:'[name]-[local]-[hash:base64:6]',
              publicPath: '../../'
            }
          },
          {
            loader: 'css-loader',
            options: {}
          },
          'less-loader',
          'postcss-loader'
        ]
      }
    ]
  }
}

```



```js
// webpack.dev.js
const { smart } = require('webpack-merge')

let base = require('./webpack.base.js')
module.exports = smart(base, {
  mode: 'development'
})
```



```js
// webpack.prod.js
const { smart } = require('webpack-merge')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 用于优化\最小化CSS
const TerserJSPlugin = require('terser-webpack-plugin')

let base = require('./webpack.base.js')
module.exports = smart(base, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        cache: true, // 是否缓存
        parallel: true, // 并发打包
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }]
        },
        cssProcessorOptions: {
          safe: true
        }
      })
    ]
  }
})

```



## 4.webpack优化

### 4.1noParse

```js
// webpack.config.js
module.exports = {
  // ...
    module: {
      noParse: /jquery/, // 不去解析 jquery 包，优化打包时间
    }
  // ...
}
```

### 4.2 忽略第三方包

> 忽略第三方包的无用配置：以 npm i moment -S 测试：减少打包体积

```js
import moment from 'moment'
// 以下引用将会全部加载语言包
// moment.locale('zh-cn')
// 手动引入单独的中文包
// import 'moment/locale/zh-cn'
console.log(moment().endOf('day').fromNow())
```

```js
// webpack.config.js
module.exports = {
  // ...
  plugins: [
    new Webpack.IgnorePlugin(/\.\/locale/, /moment/), // 忽略配置
  ]
  // ...
}
```

### 4.3 动态连接库

> 动态连接库——对某些第三方库进行单独打包

案例：抽离`react react-dom`；将第三方包和业务代码分开打包，减少打包体积。

```js
// src/index.html
<body>
  <div id="root"></div>
  <script src="/_dll_react.js"></script>
</body>

// src/index.js
import React from 'react'
import { render } from 'react-dom'
render(
  <h1>jsx</h1>,
  window.root
)
import calc from './test'
console.log(calc.sum(10, 90))

// src/test.js
let sum = (a, b) => {
  return a + b + 'sum'
}

let minus = (a, b) => {
  return a - b + 'minus'
}

export default {
  sum,
  minus
}
```

执行`npx webpack --config webpack.config.react.js`：

```js
// webpack.config.react.js
const path = require('path')
const Webpack = require('webpack')
module.exports = {
  // path.join(__dirname, './src/test.js'),
  entry: {
    react: ['react', 'react-dom']
  },
  output: {
    filename: '_dll_[name].js',
    path: path.join(__dirname, './dist'),
    library: '_dll_[name]', // 将打包模块命名为 a
    // libraryTarget: 'var', // 使用 commonjs 方式命名模块 var this commonjs
  },
  plugins: [
    new Webpack.DllPlugin({
      name: '_dll_[name]',
      path: path.resolve(__dirname, 'dist', 'manifest.json')
    })
  ]
}
```

### 4.3 多线程打包

1. `happypack`

```js
// npm i happypack -D ——打包 js 文件
// webpack.config.react.js
const Happypack = require('happypack')
module.exports = {
  // ...
  plugins: [
    new Happypack({
      id: 'js-pack',
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            '@babel/plugin-transform-runtime'
          ]
        }
      }]
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-withimg-loader'
      },
      {
        test: /\.js$/,
        use: 'Happypack/loader?id=js-pack', // js开启多线程打包
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      }
    ]
  }
  // ...
}
```

打包`css`文件同`js`文件一样，只需再`new Happypack({/** ... */})`

2. `thread-loader`

```js
// npm i thread-loader -D //  开启多进程打包，开启线程也有600ms的消耗
use: [
  {
    loader: 'thread-loader',
    options: {
      workers: 2
    }
  },
]
```



### 4.4 webpack 自带优化

+ tree-shaking 模式
+ scope hosting 作用域提升

### 4.5 模块分隔

- [Webpack4之SplitChunksPlugin](https://juejin.im/post/5af15e895188256715479a9a)

```js
// index.js
import a from './a'
import b from './b'
import c from './c'

// other.js
import a from './a'
import b from './b'
console.log('other--------')

// a.js
console.log('a--------')

// b.js
console.log('b--------')

// c.js
console.log('c--------')

// webpack.config.react.js
const Happypack = require('happypack')
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      cacheGroups: { // 缓存组
        common: { // 公共的模块
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        },
        vendor: {
          priority: 1,
          test: /node_modules/, // 把你抽离出来
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        }
      }
    },
  },
  entry: {
    index: './src/index.js',
    other: './src/other.js',
  },
  output: {
    filename: './static/js/[name].js',
    path: path.join(__dirname, './build')
  },
  // ...

```



### 4.6 懒加载

```js
// index.js
let btn = document.createElement('button')

btn.innerHTML = '按钮'

btn.addEventListener('click', () => {
  console.log('click')
  // ES6 jsonp 实现动态加载js
  import('./source.js').then(data => {
    console.log(data)
  })
})

document.body.appendChild(btn)

// source.js
export default '导入文件'
```

其他：不用安装`"@babel/plugin-syntax-dynamic-import"`插件

### 4.7 热更新

```js
// index.js
import source from './source'
console.log(source)
if(module.hot) {
  module.hot.accpet('./source.js', function() {
    console.log('文件更细了')
    let source = require('./source')
    console.log(source)
  })
}
```



```js
// webpack.config.react.js
const Happypack = require('happypack')
module.exports = {
  // ...
  devServer: {
    hot: true,
  },
  plugins: [
    new Webpack.NamedModulesPlugin(), // 打印热更新插件路径
    new Webpack.HotModuleReplacementPlugin() // 热更新插件
  ],
  // ...
}
```

### 4.8 其他优化手段

+ 优化代码调试——sourceMap
+ externals——防止将一些npm包打包到项目中
+ oneof——use规则配置
+ babel缓存 和 文件资源缓存

```bash
# babel缓存
cacheDirectory: true, // babel 缓存

# 文件资源缓存
hash：每次webpack构建时会生成一个唯一的值
问题：因为js和css同时使用一个hash值
如果重新打包，会导致所有的缓存失效（这时重新打包我就可能只更改一个文件，却引起全部文件更新）

chunkhash： 根据chunk生成hash值。如果打包来远同一个chunk，那么hash值就一样
问题：js个css的hash值是一样的
因为css是在js中被引入的，同属于一个chunk

contenthash：根据文件的内容生成hash值。不同文件hash值一定不一样
```

+ tree shaking

```js
// 前提 1. ES6模块化   2.开启production环境

// 在 package.json中配置
"sideEffects": false // 所有代码都没有副作用，都可以进行 treeshaking，问题会把 css/@babel/polyfill 干掉
"sideEffects": [".css"] // 排除css文件，不 tree shaking
```

+ code split

```js
// 方法一：多入口

// 方法二：
// 可以将node_modules中的代码单独打包一个chunk最终输出
// 自动分析多入口chunk中，有没有公共文件，如果有会打包成单独一个chunk
```

+ 懒加载和预加载

```js
// 懒加载 webpackChunkName: 'tset'
// 预加载 webpackPreFetch: 'true'
import(/* webpackChunkName: 'tset', webpackPreFetch: 'true' */ './test.js').then(({ /* 结构解析 */}) => {})
```

+ pwa

```js
// pwa: 渐进式网络开发应用程序（离线访问）
// npm i workbox-webpack-plugin -D

// webpack.config.js
new WorkboxWebpackPlugin.GenerateSW({
  // 生成一个 serviceWorker 文件，需要在入口文件做配置
  clientsClaim: true, // 帮助serviceWorker快速启动
  skipWaiting: true // 删除旧的 serviceWorker
}),
  
// src/index.js
// 注册serviceWorker

// 判断serviceWorker兼容性
/* 注意！！！
1.eslint 不认识 window navigator 等变量
需要在package.json中配置
  "eslintConfig": {
    "extends": "airbnb-base",
    "env": {
      "browser": true // 支持浏览器端全局访问
    }
  },

2. /build 必须运行在 服务端
*/
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        console.log('ok');
      })
      .catch(() => {
        console.log('error');
      });
  });
}
```

##  5.测试将vue打包成动态连接库

```js
// 第一步
// webpack.dll.js
const { resolve } = require('path')
const webpack = require('webpack')
module.exports = {
  entry: {
    vue: ['vue']
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dll'),
    library: '[name]_[hash:10]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_[hash:10]',
      path: resolve(__dirname, 'dll/manifest.json')
    })
  ],
  mode: "production"
}

// 执行 npx webpack --config webpack.dll.js 
// 生成 dll/vue.js dll/manifest.json 文件
```

```js
// 第二步
// webpack.config.js
// npm i add-asset-html-webpack-plugin -D

const AddAssetAtmlWebpackPlugin = require('add-asset-html-webpack-plugin')

// .... plugins 添加一下 new ...
new Webpack.ProvidePlugin({ // 通过Webpack自带方法，为每个模块注入 vue 对象
  vue: "vue"
}),
new webpack.DllReferencePlugin({ // 告诉 webpack 那些库不参与打包，同时使用时的名称也得变
  manifest: path.resolve(__dirname, 'dll/manifest.json')
}),
// 将某个文件打包输出出去，并在html文件中引入它
new AddAssetAtmlWebpackPlugin({
  filepath: path.resolve(__dirname, 'dll/vue.js')
}),
  
// 执行 npm run build
```
