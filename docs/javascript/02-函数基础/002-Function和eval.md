# Function 和 eval

## Function

每个 JavaScript 函数实际上都是一个 Function 对象。运行 `(function(){}).constructor === Function`便可
以得到这个结论。

### 构造函数

**`Function` 构造函数**创建一个新的 `Function` **对象**。直接调用此构造函数可用动态创建函数，但会遇
到和 [`eval`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval)
类似的的安全问题和(相对较小的)性能问题。然而，与 `eval` 不同的是，`Function` 创建的函数只能在全局作
用域(window / global)中运行。

```js
var test1 = new Function('a', 'b', 'c', 'console.log(a+b+c)');
var test2 = new Function('a, b, c', 'console.log(a+b+c)'); // test1 === test2
test1(1, 2, 3);
test2(1, 2, 3);
```

### 描述

使用 Function 构造器生成的 Function 对象是在函数创建时解析的。这比你使用函数声明或者函数表达式并在你
的代码中调用更为低效，因为使用后者创建的函数是跟其他代码一起解析的。

所有被传递到构造函数中的参数，都将被视为将被创建的函数的参数，并且是相同的标示符名称和传递顺序。

以调用函数的方式调用 Function 的构造函数（而不是使用 new 关键字) 跟以构造函数来调用是一样的。（函数
调用 和 new 函数 是一样的）

### 属性和方法

全局的 Function 对象没有自己的属性和方法，但是，因为它本身也是一个函数，所以它也会通过原型链从自己的
原型链 Function.prototype 上继承一些属性和方法。

```js
// 此时 new Function === Function
var t1 = new Function('console.log("t1")');
var t2 = Function('console.log("t2")');

t1(); // t1
t2(); // t2

console.log(t1.__proto__ === Function.prototype); // true
console.log(Function.__proto__ === Function.prototype); // true Function.__proto__ 指向自身的 prototype
```

### 原型对象

属性：

- `Function.length` - 获取函数的接收参数个数。
- `Function.prototype.constructor` - 声明函数的原型构造方法。

方法：

- `Function.prototype.apply()`
- `Function.prototype.bind()`
- `Function.prototype.call()`
- `Function.prototype.toString()`

## eval 函数

`eval(string)` 函数会将传入的字符串当做 JavaScript 代码进行执行。 `string`：一个表示**JavaScript 表
达式**、语句或一系列语句的字符串。表达式可以包含变量与已存在对象的属性。返回值：返回字符串中代码的返
回值。如果返回值为空，则返回 undefined。

```js
var code = `function anonymous(
  ) {
  console.log("t1")
  }`;
eval(`!${code}()`);
```

**永远不要使用 eval！**

eval() 是一个危险的函数，容易被攻击；eval() 通常比其他替代方法更慢，因为它必须调用 JS 解释器，而许多
其他结构则可被现代 JS 引擎进行优化。

## 面试题

```js
// 面试题 1
var a = 1,
  b = 2;
function test() {
  var b = 3;
  // Function 的作用域是全局的作用域，不会形成闭包 1 + 2 + 4
  return new Function('c', 'console.log(a + b + c)');
}
var t = test();
t(4); // 浏览器环境： 7  ； node环境 报错（global 环境下没有 a ， b）
```

Function 构造器与函数声明之间的不同：

由 Function 构造器创建的函数不会创建当前环境的闭包，它们总是被创建于全局环境，因此在运行时它们只能访
问全局变量和自己的局部变量，不能访问它们被 Function 构造器创建时所在的作用域的变量。这一点与使用
eval 执行创建函数的代码不同。

```js
// 面试题 2
var a = 1,
  b = 2;
function test() {
  var b = 3;
  eval('!function _(c) { console.log(a + b + c) }(4)'); // 1 + 3 + 4
}

test(); // 8
```
