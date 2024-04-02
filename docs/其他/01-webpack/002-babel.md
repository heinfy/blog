# Babel

在 JavaScript 中，Babel 是一个广泛使用的 JavaScript 编译器，而 Babel 的 plugins 则是用来扩展 Babel 功能的工具。

**Babel**:

- Babel 是一个 JavaScript 编译器，主要用于将 ECMAScript 2015+ 的新特性编译为向后兼容的 JavaScript 代码，以便在当前和旧版本的浏览器或环境中运行。
- Babel 不仅可以编译新语法，还可以编译一些新的内置方法，比如 `Object.assign`、`Array.from` 等，以及一些新的 API，如 Promise、Generator 等。
- Babel 是一个模块化的工具，它可以通过插件来扩展其功能，从而实现各种不同的转换和处理。

## presets 和 plugins

**Presets**：

Presets 是预设的转换器集合，它们包含了一组预定义的转换规则，可以一次性地将代码转换成某个特定环境所需要的语法。常见的 Presets 包括：

1. **@babel/preset-env**: 这是 Babel 的官方预设之一，根据配置的目标环境自动确定所需的转换规则，可以根据目标浏览器或 Node.js 版本等自动选择合适的转换规则。
2. **@babel/preset-react**: 用于处理 React 应用中的 JSX 语法和一些相关的转换规则。
3. **@babel/preset-typescript**: 用于处理 TypeScript 代码的转换，包括类型检查等。
4. **@babel/preset-flow**: 用于处理 Flow 静态类型检查器的代码转换。

**Plugins**:

Plugins 是单个的转换器，每个插件通常只负责一个特定的转换规则。用户可以根据自己的需求选择性地启用或禁用插件，并且可以通过配置插件的选项来自定义转换行为。

- Babel 的 plugins 是用来扩展 Babel 功能的工具，用于在 Babel 编译过程中对代码进行转换、分析和处理。
- 插件可以用来实现各种不同的转换，比如转换语法、转换 API、添加 Polyfill 等。

常见的 Babel 插件：

1. `@babel/plugin-transform-arrow-functions`：将箭头函数转换为普通函数。
2. `@babel/plugin-transform-classes`：转换 ES6 类语法。
3. `@babel/plugin-transform-template-literals`：转换模板字面量。
4. `@babel/plugin-transform-block-scoping`：转换块作用域。
5. `@babel/plugin-transform-destructuring`：转换解构语法。
6. `@babel/plugin-transform-async-to-generator`：将 async/await 转换为生成器函数。
7. `@babel/plugin-transform-regenerator`：为 async/await 添加 polyfill。
8. `@babel/plugin-transform-runtime`：使用 Babel 提供的运行时来避免编译输出中的重复代码。
9. `@babel/plugin-proposal-object-rest-spread`：转换对象的扩展运算符。
10. `@babel/plugin-proposal-class-properties`：转换类属性语法。
11. `@babel/plugin-syntax-dynamic-import`：支持动态导入语法。
12. `@babel/plugin-transform-react-jsx`：转换 JSX 语法。
13. `@babel/plugin-transform-react-display-name`：自动添加 React 组件的 displayName。
14. `@babel/plugin-transform-react-constant-elements`：优化 React 组件的不变元素。
15. `@babel/plugin-transform-runtime`：用于将 Babel 转换结果中的公共代码提取成辅助函数。

### Presets 和 Plugins有什么区别？

1. **粒度不同**: Presets 是一组转换规则的集合，而 Plugins 是单个转换规则的实现。
2. **使用方式不同**: Presets 可以一次性地应用一组转换规则，而 Plugins 则需要用户根据需求逐个添加和配置。
3. **适用场景不同**: Presets 适合用于快速配置常见的转换需求，而 Plugins 则适合用于精细控制转换过程，或者应用一些特定的转换规则。

### polyfill

在 Babel 中，Polyfill 是指用于实现浏览器不支持的 JavaScript 特性或 API 的代码填充（Shim）。

Polyfill 的作用是为了解决以下问题：

1. **兼容性问题**: 不同的浏览器或环境对 JavaScript 新特性的支持程度不同，有些浏览器可能不支持或支持不完整，使用 Polyfill 可以使得开发者能够在这些环境中使用新的 JavaScript 特性，而不用担心兼容性问题。
2. **填充缺失的 API**: 有些浏览器可能不支持一些标准的 JavaScript API，比如一些 ES6+ 新增的方法或对象，通过 Polyfill 可以在这些浏览器中模拟实现这些 API，以便开发者在其上下文中使用。

常见的 Polyfill：

1. **core-js**: core-js 是一个非常常见的 Polyfill 库，它提供了大量的标准 JavaScript API 的 Polyfill，包括对新的 ECMAScript 版本的支持，如 ES6、ES7 等，以及一些其他标准的 API 支持。
2. **regenerator-runtime**: regenerator-runtime 是用于支持 generator 函数和 async/await 的 Polyfill，它是 Babel 编译 async/await 代码时所依赖的运行时支持。
3. **fetch**: fetch API 是用于进行网络请求的标准 API，而一些老版本的浏览器不支持它，因此可以使用 fetch 的 Polyfill 来提供兼容性。
4. **es6-promise**: 对 Promise 的支持是 ES6 中的一个重要特性，而一些旧版本的浏览器可能不支持 Promise，es6-promise Polyfill 可以填充这个功能。
5. **Array.prototype.includes**: Array.prototype.includes 方法是用于判断数组中是否包含某个元素，而一些较老的浏览器可能不支持这个方法，因此可以使用 polyfill 来填充这个缺失。
6. **Object.assign**: Object.assign 方法用于对象的合并，一些旧版本的浏览器可能不支持它，可以使用 polyfill 来提供支持。
7. **Array.from**: Array.from 方法用于将类数组对象或可迭代对象转换为数组，也可以使用 polyfill 来提供支持。
8. **Intl**: Intl 是用于国际化和本地化的 JavaScript API，一些较老版本的浏览器可能不支持它，因此可以使用 Polyfill 来填充这个功能。