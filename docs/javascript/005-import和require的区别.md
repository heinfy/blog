# import 和 require 的区别

ES6 的 import 和 CommonJS 的 require 是两种不同的 JavaScript 模块导入方式

1. 语法差异
   - ES6 的 import 语法更加现代化和简洁，使用关键字 `import` 来导入模块，可以一次导入多个成员，也支
     持默认导出和命名导出。
   - CommonJS 使用 `require` 函数来导入模块，通常需要一个字符串参数，指定要导入的模块路径。
2. 动态/静态导入
   - ES6 的 import 是静态的，模块路径必须在编译时确定，不能使用动态表达式。
   - CommonJS 的 require 是动态的，可以在运行时根据条件导入不同的模块。
3. 异步加载
   - ES6 的 import 支持异步加载模块，可以使用 `import()` 函数动态加载模块。
   - CommonJS 的 require 是同步的，模块在导入时立即加载。
4. 导入方式:
   - ES6 的 import 导入的模块是不可变的，它们被视为只读，无法修改导入的值。
   - CommonJS 的 require 导入的模块是可变的，可以修改导入的值，因为它返回的是模块的引用。
5. 缓存:
   - CommonJS 会缓存已加载的模块，多次调用 require 不会重新加载。
   - ES6 的 import 也会缓存已加载的模块，不会重复加载同一模块。
6. 浏览器支持:
   - ES6 的 import 是标准的模块系统，可以直接在现代浏览器中使用。
   - CommonJS 是 Node.js 独有的模块系统，不适用于浏览器端，需要使用工具如 Browserify 或 Webpack 将
     CommonJS 模块转换为浏览器可用的代码。

## exports 和 module.export

1. `exports` 对象：

   - `exports` 是一个空对象（默认情况下），用于向外部导出模块的成员。
   - 通过给 `exports` 对象添加属性或方法，可以将它们导出到其他模块中。
   - `exports` 本质上是 `module.exports` 的一个引用，即 `exports` 和 `module.exports` 最初指向相同的
     对象。

2. `module.exports` 对象：

   - `module.exports` 是一个真正的导出对象，它可以是任何值，不仅仅是一个对象，也可以是函数、字符串、
     数字等。
   - 如果在模块中直接赋值给 `module.exports`，它将覆盖掉 `exports` 对象的引用，这意味着 `exports` 不
     再指向 `module.exports`。

3. 区别和联系：

   - 当你使用 `exports` 导出成员时，你实际上是在向 `module.exports` 添加属性，所以 `exports` 和
     `module.exports` 最初指向相同的对象。但如果你重新赋值给 `exports`，它将不再指向
     `module.exports`。
   - 如果你只使用 `exports` 导出成员，而没有重新赋值给 `module.exports`，那么最终导出的内容将是
     `module.exports` 的值。如果你混合使用 `exports` 和 `module.exports`，以 `exports` 导出一些内容
     ，以 `module.exports` 导出其他内容，最终导出的将是 `module.exports` 的值。
