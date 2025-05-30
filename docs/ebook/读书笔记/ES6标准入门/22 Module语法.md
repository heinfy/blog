# 23 Module 语法

## 1. 概述

ES6 模块的设计思想，是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

```js
// CommonJS模块
let { stat, exists, readFile } = require('fs');
// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
```

上面代码的实质是整体加载 fs 模块（即加载 fs 的所有方法），生成一个对象（ \_fs ），然后再从这个对象上面读取 3 个方法。**这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。**

ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，再通过 import 命令输入。

```js
// ES6
import { stat, exists, readFile } from 'fs';
```

上面代码的实质是从 fs 模块加载 3 个方法，其他方法不加载。**这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。**当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。

由于 ES6 模块是编译时加载，使得静态分析成为可能。有了它，就能进一步拓宽 JavaScript 的语法，比如引入宏（macro）和类型检验（type system）这些只能靠静态分析实现的功能。

**除了静态加载带来的各种好处，ES6 模块还有以下好处。**

1. 不再需要 UMD 模块格式了，将来服务器和浏览器都会支持 ES6 模块格式。目前，通过各种工具库，其实已经做到了这一点。
2. 将来浏览器的新 API 就能用模块格式提供，不再必须做成全局变量或者 navigator 对象的属性。
3. 不再需要对象作为命名空间（比如 Math 对象），未来这些功能可以通过模块提供。

## 2. 严格模式

ES6 的模块自动采用严格模式，不管你有没有在模块头部加上 "use strict"; 。

严格模式主要有以下限制。

1. 变量必须声明后再使用
2. 函数的参数不能有同名属性，否则报错
3. 不能使用 with 语句
4. 不能对只读属性赋值，否则报错
5. 不能使用前缀 0 表示八进制数，否则报错
6. 不能删除不可删除的属性，否则报错
7. 不能删除变量 delete prop ，会报错，只能删除属性 delete global[prop]
8. eval 不会在它的外层作用域引入变量
9. eval 和 arguments 不能被重新赋值
10. arguments 不会自动反映函数参数的变化
11. 不能使用 arguments.callee
12. 不能使用 arguments.caller
13. 禁止 this 指向全局对象
14. 不能使用 fn.caller 和 fn.arguments 获取函数调用的堆栈
15. 增加了保留字（比如 protected 、 static 和 interface ）

## 3. export 命令

模块功能主要由两个命令构成： export 和 import 。 export 命令用于规定模块的对外接口， import 命令用于输入其他模块提供的功能。

```js
// profile.js
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;
```

```js
// profile.js
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;
export { firstName, lastName, year };
```

输入函数或者类：

```js
export function multiply(x, y) {
 return x * y;
};

// 可以使用 as 关键字重命名。
function v1() { ... }
function v2() { ... }
export {
 v1 as streamV1,
 v2 as streamV2,
 v2 as streamLatestVersion
};
```

**错误：** 输出一个接口！！

```js
// 报错
export 1;
// 报错
var m = 1;
export m;
// 因为没有提供对外的接口。第一种写法直接输出 1，第二种写法通过变量 m
```

**正确：**

```js
// 写法一
export var m = 1;
// 写法二
var m = 1;
export { m };
// 写法三
var n = 1;
export { n as m };
```

```js
// 报错
function f() {}
export f;

// 正确
export function f() {};
// 正确
function f() {}
export {f};

```

另外， export 语句输出的接口，**与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。**

```js
export var foo = 'bar';
setTimeout(() => (foo = 'baz'), 500);
```

上面代码输出变量 foo ，值为 bar ，500 毫秒之后变成 baz 。

**这一点与 CommonJS 规范完全不同。CommonJS 模块输出的是值的缓存，不存在动态更新**

最后， export 命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，下一节的 import 命令也是如此。这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。

```js
function foo() {
  export default 'bar'; // SyntaxError
}
foo();
```

## 4. import 命令

使用 export 命令定义了模块的对外接口以后，其他 JS 文件就可以通过 import 命令加载这个模块。

```js
// main.js
import { firstName, lastName, year } from './profile';
function setName(element) {
  element.textContent = firstName + ' ' + lastName;
}
```

`import` 命令要使用 `as` 关键字，将输入的变量重命名。

```js
import { lastName as surname } from './profile';
```

`import` 后面的 `from` 指定模块文件的位置，可以是相对路径，也可以是绝对路径， `.js` 后缀可以省略。如果只是模块名，不带有路径，那么必须有配置文件，告诉 `JavaScript` 引擎该模块的位置。

**注意， import 命令具有提升效果，会提升到整个模块的头部，首先执行。**

```js
foo();
import { foo } from 'my_module';
```

上面的代码不会报错，因为 import 的执行早于 foo 的调用。**这种行为的本质是， import 命令是编译阶段执行的，在代码运行之前。**

由于 import 是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。

```js
// 报错
import { 'f' + 'oo' } from 'my_module';
// 报错
let module = 'my_module';
import { foo } from module;
// 报错
if (x === 1) {
 import { foo } from 'module1';
} else {
 import { foo } from 'module2';
}

```

最后， import 语句会执行所加载的模块，因此可以有下面的写法。

```js
import 'lodash';
```

上面代码仅仅执行 lodash 模块，但是不输入任何值。

如果多次重复执行同一句 import 语句，那么只会执行一次，而不会执行多次。

```js
import 'lodash';
import 'lodash';
```

上面代码加载了两次 lodash ，但是只会执行一次。

```js
import { foo } from 'my_module';
import { bar } from 'my_module';
// 等同于
import { foo, bar } from 'my_module';
```

上面代码中，虽然 foo 和 bar 在两个语句中加载，但是它们对应的是同一个 my_module 实例。也就是说，**import 语句是 Singleton 模式。**

## 5. 模块的整体加载

除了指定加载某个输出值，还可以使用整体加载，即用星号（ \* ）指定一个对象，所有输出值都加载在这个对象上面

下面是一个 circle.js 文件，它输出两个方法 area 和 circumference 。

```js
// circle.js
export function area(radius) {
  return Math.PI * radius * radius;
}
export function circumference(radius) {
  return 2 * Math.PI * radius;
}
```

现在，加载这个模块。

```js
// main.js
import { area, circumference } from './circle';
console.log('圆面积：' + area(4));
console.log('圆周长：' + circumference(14));
```

上面写法是逐一指定要加载的方法，整体加载的写法如下。

```js
import * as circle from './circle';
console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));
```

注意，模块整体加载所在的那个对象（上例是 circle ），应该是可以静态分析的，所以不允许运行时改变。下面的写法都是不允许的。

```js
import * as circle from './circle';
// 下面两行都是不允许的
circle.foo = 'hello';
circle.area = function () {};
```

## 6. `export default`命令

`export default` 命令，为模块指定默认输出：

```js
// export-default.js
export default function () {
  console.log('foo');
}
```

上面代码是一个模块文件 `export-default.js` ，它的默认输出是一个函数。

其他模块加载该模块时， `import` 命令可以为该匿名函数指定任意名字。

```js
// import-default.js
import customName from './export-default';
customName(); // 'foo'
```

上面代码的 `import` 命令，可以用任意名称指向 `export-default.js` 输出的方法，这时就不需要知道原模块输出的函数名。需要注意的是，这时 `import` 命令后面，不使用大括号。

`export default` 命令用在非匿名函数前，也是可以的。

```js
// export-default.js
export default function foo() {
 console.log('foo');
}
// 或者写成
function foo() {
 console.log('foo');
}
export default foo;
```

上面代码中， `foo` 函数的函数名 `foo` ，在模块外部是无效的。加载的时候，视同匿名函数加载。

下面比较一下默认输出和正常输出。

```js
// 第一组
export default function crc32() {
  // 输出
  // ...
}
import crc32 from 'crc32'; // 输入
// 第二组
export function crc32() {
  // 输出
  // ...
}
import { crc32 } from 'crc32'; // 输入
```

，第一组是使用 `export default` 时，对应的 import 语句不需要使用大括号；第二组是不使用 `export default` 时，对应的 import 语句需要使用大括号。

## 7. export 与 import 的复合写法

如果在一个模块之中，先输入后输出同一个模块， `import` 语句可以与 `export` 语句写在一起。

```js
export { foo, bar } from 'my_module';
// 等同于
import { foo, bar } from 'my_module';
export { foo, bar };
```

上面代码中， `export` 和 `import` 语句可以结合在一起，写成一行。

模块的接口改名和整体输出，也可以采用这种写法。

```js
// 接口改名
export { foo as myFoo } from 'my_module';
// 整体输出
export * from 'my_module';
```

默认接口的写法如下。

```js\
export { default } from 'foo';
```

具名接口改为默认接口的写法如下。

```js
export { es6 as default } from './someModule';
// 等同于
import { es6 } from './someModule';
export default es6;
```

下面三种 import 语句，没有对应的复合写法。

```js
import * as someIdentifier from 'someModule';
import someIdentifier from 'someModule';
import someIdentifier, { namedIdentifier } from 'someModule';
```

## 8. 模块的继承

假设有一个 circleplus 模块，继承了 circle 模块。

```js
// circleplus.js
export * from 'circle';
export var e = 2.71828182846;
export default function (x) {
  return Math.exp(x);
}
```

上面代码中的 export _ ，表示再输出 circle 模块的所有属性和方法。注意， export _ 命令会忽略 circle 模块的 default 方法。然后，上面代码又输出了自定义的 e 变量和默认方法。

这时，也可以将 circle 的属性或方法，改名后再输出。

```js
// circleplus.js
export { area as circleArea } from 'circle';
```

上面代码表示，只输出 circle 模块的 area 方法，且将其改名为 circleArea 。

加载上面模块的写法如下。

```js
// main.js
import * as math from 'circleplus';
import exp from 'circleplus';
console.log(exp(math.e));
```

上面代码中的 import exp 表示，将 circleplus 模块的默认方法加载为 exp 方法。

## 9. 跨模块常量

const 声明的常量只在当前代码块有效。如果想设置跨模块的常量（即跨多个文件），或者说一个值要被多个模块共享，可以采用下面的写法。

```js
// constants.js 模块
export const A = 1;
export const B = 3;
export const C = 4;
// test1.js 模块
import * as constants from './constants';
console.log(constants.A); // 1
console.log(constants.B); // 3
// test2.js 模块
import { A, B } from './constants';
console.log(A); // 1
console.log(B); // 3
```

如果要使用的常量非常多，可以建一个专门的 constants 目录，将各种常量写在不同的文件里面，保存在该目录下。

```js
// constants/db.js
export const db = {
  url: 'http://my.couchdbserver.local:5984',
  admin_username: 'admin',
  admin_password: 'admin password'
};
// constants/user.js
export const users = ['root', 'admin', 'staff', 'ceo', 'chief', 'moderator'];
```

然后，将这些文件输出的常量，合并在 index.js 里面。

```js
// constants/index.js
export { db } from './db';
export { users } from './users';
```

使用的时候，直接加载 index.js 就可以了。

```js
// script.js
import { db, users } from './index';
```

## 10. import()

### 10.1 简介

`import` 命令会被 `JavaScript` 引擎静态分析，先于模块内的其他模块执行（叫做”连接“更合适）。所以，下面的代码会报错。

```js
// 报错
if (x === 2) {
  import MyModual from './myModual';
}
```

上面代码中，**引擎处理 import 语句是在编译时，这时不会去分析或执行 if 语句，所以 import 语句放在 if 代码块之中毫无意义，因此会报句法错误，而不是执行时错误。也就是说， import 和 export 命令只能在模块的顶层，不能在代码块之中（比如，在 if 代码块之中，或在函数之中）。**

这样的设计，固然**有利于编译器提高效率，但也导致无法在运行时加载模块。在语法上，条件加载就不可能实现。**如果 import 命令要取代 Node 的 require 方法，这就形成了一个障碍。**因为 require 是运行时加载模块， import 命令无法取代 require 的动态加载功能。**

```js
const path = './' + fileName;
const myModual = require(path);
```

上面的语句就是动态加载， require 到底加载哪一个模块，只有运行时才知道。 import 语句做不到这一点。

因此，有一个提案，建议引入 import() 函数，完成动态加载。

```js
import(specifier);
```

上面代码中， import 函数的参数 specifier ，指定所要加载的模块的位置。 **import 命令能够接受什么参数， import() 函数就能接受什么参数，两者区别主要是后者为动态加载。**

import() 返回一个 Promise 对象。下面是一个例子。

```js
const main = document.querySelector('main');
import(`./section-modules/${someVariable}.js`)
  .then(module => {
    module.loadPageInto(main);
  })
  .catch(err => {
    main.textContent = err.message;
  });
```

import() 函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。它是运行时执行，也就是说，什么时候运行到这一句，也会加载指定的模块。另外， import() 函数与所加载的模块没有静态连接关系，这点也是与 import 语句不相同。

import() 类似于 Node 的 require 方法，区别主要是前者是异步加载，后者是同步加载。

### 10.2 适用场合

下面是 import() 的一些适用场合。

（1）按需加载。

import() 可以在需要的时候，再加载某个模块。

```js
button.addEventListener('click', event => {
  import('./dialogBox.js')
    .then(dialogBox => {
      dialogBox.open();
    })
    .catch(error => {
      /* Error handling */
    });
});
```

上面代码中， import() 方法放在 click 事件的监听函数之中，只有用户点击了按钮，才会加载这个模块。

（2）条件加载

import() 可以放在 if 代码块，根据不同的情况，加载不同的模块。

```js
if (condition) {
 import('moduleA').then(...);
} else {
 import('moduleB').then(...);
}

```

上面代码中，如果满足条件，就加载模块 A，否则加载模块 B。

（3）动态的模块路径

import() 允许模块路径动态生成。

```js
import(f()).then(...);

```

上面代码中，根据函数 f 的返回结果，加载不同的模块。

### 10.3 注意点

import() 加载模块成功以后，这个模块会作为一个对象，当作 then 方法的参数。因此，可以使用对象解构赋值的语法，获取输出接口。

```js
import('./myModule.js').then(({ export1, export2 }) => {
  // ...·
});
```

上面代码中， export1 和 export2 都是 myModule.js 的输出接口，可以解构获得。

如果模块有 default 输出接口，可以用参数直接获得。

```js
import('./myModule.js').then(myModule => {
  console.log(myModule.default);
});
```

上面的代码也可以使用具名输入的形式。

```js
import('./myModule.js').then(({ default: theDefault }) => {
  console.log(theDefault);
});
```

如果想同时加载多个模块，可以采用下面的写法。

```js
Promise.all([
 import('./module1.js'),
 import('./module2.js'),
 import('./module3.js'),
])
.then(([module1, module2, module3]) => {
 ···
});

```

import() 也可以用在 async 函数之中。

```js
async function main() {
  const myModule = await import('./myModule.js');
  const { export1, export2 } = await import('./myModule.js');
  const [module1, module2, module3] = await Promise.all([import('./module1.js'), import('./module2.js'), import('./module3.js')]);
}
main();
```
