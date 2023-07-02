### webpack

#### webpack 的 plugin 和 loader 的区别？

loader：

由于 webpack 本身只能打包 commonjs 规范的 js 文件，所以针对 css，图片等格式的文件没法打包，就需要引入第三方的模块进行打包。
loader 扩展了 webpack，只专注于转化文件这一个领域，完成压缩 / 打包 / 语言翻译等，仅仅只是为了打包。

plugin：

plugin 也是为了扩展 webpack 的功能，plugin 是作用于 webpack 本身的；
从打包优化到压缩，到重新定义环境变量，针对 html 文件打包和拷贝（还有很多设置）的插件：html-webpack-plugin

区别：

1. loader 运行在打包文件之前（loader 为在模块加载时的预处理文件）
2. plugins 在整个编译周期都起作用。
