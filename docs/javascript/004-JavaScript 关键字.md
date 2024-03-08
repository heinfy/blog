# JavasCript 关键字

## async await 的原理是什么?

- [co 模块](https://github.com/tj/co/blob/master/index.js)

`async` 和 `await` 是用于处理异步操作的 JavaScript 关键字。它们的原理涉及到 JavaScript 的事件循环和 Promise 对象。下面是它们的原理简要概述：

1. 异步函数（`async function`）：

   - 当你在函数前面加上 `async` 关键字时，它会告诉 JavaScript 解析器这是一个异步函数。
   - 异步函数总是返回一个 Promise 对象。

2. `await`关键字：

   - `await` 用于等待一个 Promise 对象解决（即完成）。
   - 在使用 `await` 关键字时，函数会暂停执行，直到等待的 Promise 对象状态变为 resolved（解决）或 rejected（拒绝）。
   - 在等待期间，事件循环可以处理其他任务，确保 JavaScript 应用程序保持响应性。

3. 事件循环（Event Loop）：

   - JavaScript 是单线程的，但它可以处理异步操作，这是通过事件循环来实现的。
   - 事件循环是一种机制，它允许 JavaScript 在等待异步操作完成时执行其他任务。
   - 当一个异步操作完成后，它会将相关的回调函数推入消息队列（Callback Queue）中。
   - 事件循环会不断地检查消息队列，如果队列中有任务，就会执行它们。

综合起来，`async` 和 `await` 的原理允许你以更直观的方式编写异步代码，而不必使用回调函数或者手动处理 Promise 链。它们使得异步代码更易于理解和维护，同时仍然保持了 JavaScript 的单线程执行模型和事件循环机制。这样，你可以在异步操作完成时方便地处理结果，而不必担心回调地狱（Callback Hell）或复杂的 Promise 链。

## new 的原理和实现

使用 new 关键字来创建一个对象实例时，内部执行的逻辑如下：

1. 创建一个新的空对象。
2. 将该对象的[[Prototype]]（内部属性，指向构造函数的原型对象）指向构造函数的 prototype 属性所指向的对象，建立原型链。
3. 将构造函数的作用域赋给新对象（因此 this 指向这个新对象）。
4. 执行构造函数内部的代码，以初始化这个新对象。
5. 如果构造函数没有显式地返回一个对象，则返回这个新对象。

```js
function myNew(constructor, ...args) {
  // 创建一个空对象，__proto__ 指向构造函数的原型
  const newObj = Object.create(constructor.prototype);

  // 执行构造函数，并将新对象绑定到 this 上
  const result = constructor.apply(newObj, args);

  // 如果构造函数返回了一个对象，则返回这个对象；否则返回新对象
  return result instanceof Object ? result : newObj;
}

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHello = function () {
  console.log(`Hello, my name is ${this.name}, and I am ${this.age} years old.`);
};

const john = myNew(Person, 'John', 30);
john.sayHello(); // 输出：Hello, my name is John, and I am 30 years old.
```

## bind、call 和 apply 方法实现

```js
var obj = { name: '石榴' };
var type = '水果';

function sayHi(type) {
  console.log(`这是${type}——${this.name}`);
}

// bind
Function.prototype._bind = function (context, ...rest) {
  // 获取当前上下文对象
  let ctx = context || window;
  let symbol = Symbol('__bind__');
  // 为上下文添加唯一方法
  ctx[symbol] = this;
  return function () {
    return ctx[symbol](...rest);
  };
};

sayHi._bind(obj, type)();

// call
Function.prototype._call = function (context, ...rest) {
  let ctx = context || window;
  let symbol = Symbol('__call__');
  ctx[symbol] = this;
  let res = ctx[symbol](...rest);
  delete ctx[symbol];
  return res;
};

// apply
Function.prototype._apply = function (context, ...rest) {
  let ctx = context || window;
  let symbol = Symbol('__apply__');
  ctx[symbol] = this;
  let res = ctx[symbol](...rest);
  delete ctx[symbol];
  return res;
};

sayHi._apply(obj, type);
```

## instanceof 的原理和实现

在 JavaScript 中，instanceof 是一个用于检查对象是否是某个类的实例的操作符。它的语法是 object instanceof constructor，其中 object 是要检查的对象，constructor 是要检查的类（或者说构造函数）。

instanceof 运算符会检查对象的原型链，如果对象的原型链中存在 constructor.prototype，则返回 true，否则返回 false。这意味着它可以用来检查对象是否是通过某个构造函数创建的实例。

下面是一个手动实现 instanceof 的简单示例：

```js
function myInstanceOf(obj, constructor) {
  // 检查参数是否合法
  if (typeof constructor !== 'function') {
    throw new TypeError('Right-hand side of instanceof is not callable');
  }

  // 获取对象的原型
  let proto = Object.getPrototypeOf(obj);

  // 在原型链中查找 constructor.prototype
  while (proto !== null) {
    if (proto === constructor.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }

  return false;
}

function Person(name) {
  this.name = name;
}

const person = new Person('Alice');

console.log(myInstanceOf(person, Person)); // true
console.log(myInstanceOf(person, Object)); // true，因为所有对象都是 Object 的实例
console.log(myInstanceOf(person, Array)); // false
```

### instanceof 和 typeof 的区别

- typeof 是一个操作符，用于检查一个变量的数据类型。它返回一个表示变量类型的字符串。typeof 对于大多数基本数据类型（如字符串、数字、布尔值）和函数是有效的，但它在处理复杂数据类型（如数组、对象和 null）时有限制。

主要区别：

- `typeof` 用于检查数据类型，而 `instanceof` 用于检查对象的继承关系。
- `typeof` 返回表示数据类型的字符串，而 `instanceof` 返回一个布尔值。
- `typeof` 对于大多数基本数据类型和函数都有效，但在处理复杂数据类型时（如数组、对象等）的结果可能不如预期。
- `instanceof` 主要用于检查对象的实例关系，通常在面向对象编程中使用。

## Promise 的原理和实现

- [官方文档](https://promisesaplus.com/)
- [视频地址](https://www.bilibili.com/video/BV1ph411f7Th)

```js
const PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  REJECTED = 'REJECTED';

// 判断 x 是否是 promise
function resolvePromise(promise2, x, reslove, reject) {
  // console.log(promise2, x, reslove, reject);
  if (promise2 === x) {
    throw reject(new TypeError('Chaining cycle detected for promise #<MyPromise>'));
  }
  let called = false;
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        // 这肯定是 Promise
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            // 解决.then多层次嵌套promis的递归问题
            resolvePromise(promise2, y, reslove, reject);
            // reslove(y);
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        reslove(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    reslove(x);
  }
}

class MyPromise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const reslove = value => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;

        // 发布
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };
    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;

        // 发布
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    // 捕获 throw 错误
    try {
      executor(reslove, reject);
    } catch (e) {
      reject(e);
    }
  }
  // x 可以是 普通值 也可以是 promise
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : reason => {
            throw reason;
          };
    let promise2 = new MyPromise((reslove, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, reslove, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, reslove, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      // 发布订阅
      if (this.status === PENDING) {
        // 收集回调 => 订阅
        this.onFulfilledCallbacks.push(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, reslove, reject);
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, reslove, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
    });
    // 返回 promise
    return promise2;
  }
  catch(errorCallback) {
    return this.then(null, errorCallback);
  }
}

// test
let promise1 = new MyPromise((resolve, reject) => {
  resolve('Promise1');
  // resolve('Error');
  // setTimeout(() => {
  //   resolve('success');
  // }, 2000);
  // throw new Error('Exception: Error');
});

let promise2 = promise1.then(
  () => {
    // return new Error('Error');
    // return Promise.resolve('Promise resolve')
    // return 'then promise';
    return new MyPromise((reslove, reject) => {
      // reslove('new Promise reslove');
      // setTimeout(() => {
      //   reslove('new Promise reslove');
      // }, 2000);
      setTimeout(() => {
        reslove(
          new MyPromise((reslove, reject) => {
            reslove('new Promise reslove');
          })
        );
      }, 2000);
    });
  },
  reason => {
    return reason;
  }
);

promise2
  .then()
  .then()
  .then(
    value => {
      throw Error('Error');
    },
    reason => {
      console.log(reason);
    }
  )
  .catch(e => {
    console.log(e);
  });

module.export = MyPromise;
```

## 实现 promise.all 方法

> `const p = Promise.all([p1, p2, p3]);`
>
> p 的状态由 p1、p2、p3 决定，分成两种情况。
>
> （1）只有 p1、p2、p3 的状态都变成 fulfilled，p 的状态才会变成 fulfilled，此时 p1、p2、p3 的返回值组成一个数组，传递给 p 的回调函数。
>
> （2）只要 p1、p2、p3 之中有一个被 rejected，p 的状态就变成 rejected，此时第一个被 reject 的实例的返回值，会传递给 p 的回调函数。

```js
function myPromiseAll(promises) {
  return new Promise(function (resolve, reject) {
    if (!Array.isArray(promises)) {
      throw new Error('promises 必须为数组');
    }
    let result = [],
      complatedCount = 0;
    // 数组length为0，直接返回空对象
    if (promises.length === 0) {
      resolve(result);
    }
    function processPromise(index, value) {
      result[index] = value;
      complatedCount++;
      // promises 所有方法都成功，返回结果数组
      if (complatedCount === promises.length) {
        resolve(result);
      }
    }
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i])
        .then(value => {
          processPromise(i, value);
        })
        .catch(error => {
          reject(error);
        });
    }
  });
}

// 示例用法
const promise1 = new Promise(resolve => setTimeout(() => resolve(1), 1000));
const promise2 = new Promise(resolve => setTimeout(() => resolve(2), 500));
const promise3 = new Promise(resolve => setTimeout(() => resolve(3), 2000));

myPromiseAll([promise1, promise2, promise3])
  .then(results => {
    console.log('All promises resolved:', results);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

## JSON.stringify

```js
/*
 * JSON.stringify(value[, replacer [, space]])
 * value：json对象/数组
 * replacer：
 * ① 函数：在序列化过程中，被序列化的值每个属性都会经过该函数的转换和处理
 * ② 如果该参数时一个数组，则只有包含这个数组中的属性名才会被序列，化到最终的json字符串中
 *
 * space：指定缩进用的空白字符串
 * 如果参数是个数字，它代表有多少的空格；上限为10。该值若小于1，则意味着没有空格
 * 如果该参数为字符串(字符串的前十个字母)，该字符串将被作为空格
 * 如果该参数没有提供（或者为null）将没有空格
 */
var obj = {
  name: 'Janny',
  age: 23,
  stars: ['Joe', 'Rose'],
  friends: {
    name: 'zjj',
    age: 29,
    stars: ['Janny', 'jshsd']
  }
};
// 注意，它是一个递归调用的过程
var c = JSON.stringify(
  obj,
  (key, value) => {
    console.log('key', key);
    console.log('value', value);
    return typeof value === 'string' ? value.toUpperCase() : value;
  },
  ''
);
console.log('c', c);
```

## JSON.parse

```js
/*
 * JSON.parse(text[, reviver]) 返回值：Object类型, 对应给定JSON文本
 * text: 要被解析成JavaScript值的字符串
 * reviver: 转换器, 如果传入该参数(函数)，可以用来修改解析生成的原始值，调用时机在parse函数返回之前。
 */
const a = JSON.parse('{"p": 5}', function (k, v) {
  if (k === '') return v; // 如果到了最顶层，则直接返回属性值，
  return v * 2; // 否则将属性值变为原来的 2 倍。
}); // { p: 10 }

const b = JSON.parse(
  '{"name":"JANNY","age":23,"stars":["HHH","EEE"],"friends":{"name1":"ZJJ","age1":29,"stars1":["JANNY","JSHSD"]}}',
  function (k, v) {
    console.log(k, v);
    return v;
  }
);
console.log(b);
```

## Object.defineProperty

- [mozilla defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [从 0 到 1 学习「Object.defineProperty」](https://www.bilibili.com/video/BV12z4y1U7no)

**定义：**

> Object.defineProperty 给对象定义属性。

直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并**返回此对象**。

应当**直接在 Object 构造器对象上调用此方法**，而不是在任意一个 Object 类型的实例上调用。

```js
var obj = {};

var newObj = Object.defineProperty(obj, 'a', {
  value: 100
});

console.log(obj === newObj); // true

obj.defineProperty; // 报错， defineProperty 是 Object 挂载的静态方法！
```

**参数：**

`Object.defineProperty(obj, prop, descriptor)`

> obj：要定义属性的对象 prop：要定义或修改的属性的名称或 Symbol descriptor：要定义或修改的属性描述符返回值：被传递给函数的对象

**描述：**

`Object.defineProperty` 可以精确添加或修改对象的属性。通过赋值操作添加的普通属性(`obj.a = 100`)是可以枚举的(`for...in`或者`Object.keys`)，也可以删除。但是`Object.defineProperty`默认不能枚举修改（immutable），不能重写、也不能删除，可以通过`descriptor`修改默认配置。

对象里属性描述符有俩种形式：数据描述符和存取描述符。一个描述符只能是这两者其中之一；不能同时是两者。

数据描述符是一个具体值的属性，例如（obj.a）的属性：

- `configurable`： 默认为 false， true 时可以 `delete.a` 属性
- `enumerable`： 默认为 false， 可枚举属性
- `value`： 默认为 undefined，可以是任何有效的 JavaScript 值（数值，对象，函数等）
- `writable`：默认为 false， 当且仅当该属性的 writable 键值为 true 时，属性的值，也就是上面的 value，才能被赋值运算(`obj.a = 200` 这种重新赋值)

存取描述符是由 getter 函数和 setter 函数所描述的属性。

- get：默认为 undefined。属性的 getter 函数，如果没有 getter，则为 undefined。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的 this 并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。
- set：默认为 undefined。属性的 setter 函数，如果没有 setter，则为 undefined。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象。

```js
var obj = {};

var newObj = Object.defineProperty(obj, 'a', {
  // 访问 obj.a 时，才会触发 get方法
  get() {
    console.log('get a:', 1);
    return 1;
  },
  // 赋值时触发set，不会触发 get方法
  set(newValue) {
    console.log('set value:', newValue);
  }
});

console.log(obj.a);

obj.a = 200;
```

**定义一个列表，设置列表中每项属性的是否允许篡改，删除等。**

```js
const personInfo = [
  {
    name: 'zs',
    age: 26,
    job: 'IT工程师',
    publicKey: 1231313
  },
  {
    name: 'ls',
    age: 45,
    job: 'IT工程师',
    publicKey: 44545
  },
  {
    name: 'ww',
    age: 32,
    job: 'IT工程师',
    publicKey: 1515
  }
];

// 为每项数据的属性定义 可篡改性、可删除性、可枚举性
const personInfoDefine = {
  name: {
    writable: false, // 不可篡改
    configurable: true, // 不可删除
    enumerable: true // 可枚举
  },
  age: {
    writable: false, // 不可篡改
    configurable: true, // 不可删除
    enumerable: true // 可枚举
  },
  job: {
    writable: false, // 不可篡改
    configurable: true, // 不可删除
    enumerable: true // 可枚举
  },
  publicKey: {
    writable: false, // 不可篡改
    configurable: true, // 不可删除
    enumerable: false // 不可枚举
  }
};

// 使用自执行函数，避免全局定义
(() => {
  // 定义规范列表中每项属性的方法
  function useStrictObject(data, desc) {
    // 判断是否是对象，不是对象报TypeError
    if (typeof data !== 'object' || data === null) {
      return new TypeError('we need a type `object` whitout null');
    }

    // 如果不是数组（是对象），调用内部函数
    if (!Array.isArray(data)) {
      return defineObject(data, desc);
    }
    // 如果是对象，遍历调用内部函数
    return data.map(item => {
      return defineObject(item, desc);
    });
  }

  // 真正的为每项规定属性性质的方法
  function defineObject(data, desc) {
    // 通过 new 来创建空对象
    let _obj = new ConstractObject();
    // 为每一项定义属性，读取配置personInfoDefine的内容
    for (let k in data) {
      Object.defineProperty(_obj, k, {
        ...desc[k],
        value: data[k]
      });
    }
    // 返回给用户，这时就是 defineProperty 定义好的，用户可访问的对象
    return _obj;
  }

  function ConstractObject() {
    // 遍历原型的方法，目的是为了防止用户在遍历拿到的数据时，把原型自定义对象遍历进去。
    for (const k in ConstractObject.prototype) {
      Object.defineProperty(ConstractObject.prototype, k, {
        writable: false,
        configurable: false,
        enumerable: false
      });
    }
  }

  // 在原型上定义配置方法，允许用户调用改变默认的配置
  ConstractObject.prototype.setConfig = function (prop, desc, value) {
    Object.defineProperty(this, prop, {
      [desc]: value
    });
  };

  const _personInfo = useStrictObject(personInfo, personInfoDefine);

  // 修改数据，可以发现用户不能直接修改
  _personInfo[1].job = 'adfa';
  // 通过调用内部原型的setConfig方法，来获取特定的属性
  _personInfo[2].setConfig('publicKey', 'enumerable', true);
  console.log(_personInfo);
  // 这时就可以遍历出来 _personInfo[2].publicKey 属性。
  _personInfo.forEach(element => {
    for (const key in element) {
      console.log(key);
    }
  });
})();
```

## toString 和 valueOf

**toString 的转换规则：**

`toString()` 作用是返回 `object` 的字符串表示，`JavaScript` 中 `object` 默认的 `toString()` 方法返回字符串 `[object Object]`。

注意，基本数据类的 toString() 方法，是由基本包装类型提供。

| 对象     | 返回值                                                                        |
| -------- | ----------------------------------------------------------------------------- |
| Array    | 以逗号分割的字符串，如`[1,2]`的`toString`返回值为`1,2`，跳过`null，undefined` |
| Boolean  | `True`                                                                        |
| Date     | 可读的时间字符串，如 `Tue Oct 15 2019 12:20:56 GMT+0800 (中国标准时间)`       |
| Function | 声明函数的`js`源代码字符串                                                    |
| Number   | 数字值                                                                        |
| Object   | `[object Object]`                                                             |
| String   | 字符串                                                                        |

**valueOf 的转换规则：**

`valueOf()`函数的作用是返回该`object`自身。

| 对象     | valueOf 返回值       |
| -------- | -------------------- |
| Array    | 数组本身             |
| Boolean  | 布尔值               |
| Date     | 返回毫秒形式的时间戳 |
| Function | 函数本身             |
| Number   | 数字值               |
| Object   | 对象本身             |
| String   | 字符串值             |

1. 对象转换为布尔值：`直接转换为true（包装类型也一样），不调用valueOf和toString`
2. 对象转换为数字：对象转换为数字会依次调用`valueOf`和`toString`方法： 1. 如果对象具有`valueOf`方法且返回原始值(`string、number、boolean、undefined、null`)，则将该原始值转换为数字(转换失败会返回`NaN`)，并返回这个数字 2. 如果对象具有`toString`方法且返回原始值 (`string、number、boolean、undefined、null`)，则将该原始值转换为数字(转换失败会返回`NaN`)，并返回这个数字 3. 转换失败，抛出`TypeError`
3. 对象转换为字符串：调用`toString`方法

**number 的转换规则：**

将非 number 类型的值转换为 number 类型

- 一种是隐式转换,如进行`(\*、/)`操作时,会自动其余类型的值转为 number 类型
- 一种是显示转换-调用`Number()、parseInt()、parseFloat()`方法转换
- `Number()`：
- 如果是`boolean`值，`true`和`false`将分别被替换为 1 和 0
- 如果是数字值，只是简单的传入和返回
- 如果是`null`值，返回 0
- 如果是`undefined`，返回`NaN`
- 如果是字符串，遵循下列规则：
  - 如果字符串中只包含数字，则将其转换为十进制数值，即”1“会变成 1，”123“会变成 123，而”011“会变成 11（前导的 0 被忽略）
  - 如果字符串中包含有效的浮点格式，如”1.1“，则将其转换为对应的浮点数（同样，也会忽略前导 0）
  - 如果字符串中包含有效的十六进制格式，例如”0xf“，则将其转换为相同大小的十进制整数值
  - 如果字符串是空的，则将其转换为 0
  - 如果字符串中包含除了上述格式之外的字符，则将其转换为`NaN`
- 如果是对象，则调用对象的`valueOf()`方法，再调用对象的`toString()`方法，然后再依次按照前面的规则转换返回的字符串值。

`parseInt(value,radius)`第一个参数是需要转换的值，第二个参数是转换进制；

`parseFloat()`转换规则基本与`parseInt()`一致，只有如下不同点

- `parseFloat()`遇到浮动数据时，浮点有效(但是只有第一个.有效)，如"10.1"会被转为 10.1；'10.1.1'会被转为 10.1
- `parseFloat()`只会默认处理为 10 进制，而且会忽略字符串前面的 0，所以不会有在默认情况下转为 8 进制的情

**对象转换字符串：**

```js
/* 1.先调用对象的toString方法
2.判断该方法的返回值是否为基础数据类型（Number，String，Boolean，Undefined，ull）
3.若返回值为基础数据类型，则转换规则按照相应数据类型的转换规则对其进行转换
4.若返回值不为基础数据类型，则在该返回值的基础上继续调用valueOf方法
5.判断valueOf的返回值是否为基础数据类型
6.判断是否为基础数据类型，若是基础数据类型则进行操作3
7.若仍旧不为基础数据类型则报错 */

let b = { name: 'houfee' };
console.log(String(b)); // [object Object]
let c = [];
console.log(String(c)); // 空字符串
let d = {};
console.log(String(d)); // [object Object]
```

`String`与`Number`的区别则在于

- `Number`是先调用`valueOf()`再调用`toString ()`：先转换为原始类型，再转化为字符串形式
- `String`是先调用`toString()`再调用`valueOf()`：先转换为字符串形式，再转化为原始类型

**其他转化规则：**

```js
console.log(Number({})); // NaN、
console.log(String({})); // [object Object]
console.log(Boolean({})); // true

console.log(Number([])); // 0
console.log(String([])); // 空字符串
console.log(Boolean([])); // true

console.log({} + {}); // [object Object][object Object]
console.log({} + []); // [object Object]
console.log([] + {}); // [object Object]
console.log([] + []); // 空字符串
```
