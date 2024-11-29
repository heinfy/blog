# Proxy

## 概述

Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改。 Proxy 可以理解在目标对象架设一个“拦截”层外界对该对象的访问都必须先通过这层拦截，因此提供了一种机制可以对外界的访问进行过滤和修改。

```javascript
var obj = new Proxy(
  {},
  {
    get: function (target, key, receiver) {
      console.log(`getting ${key}`);
      return Reflect.get(target, key, receiver);
    },
    set: function (target, key, value, receiver) {
      console.log(`setting ${key}`);
      return Reflect.get(target, key, value, receiver);
    }
  }
);
obj.count = 1; // 触发 set 事件 setting count
++obj.count; //  触发 get 和 set 事件 getting count setting count
```

Proxy 重载了点运算符，用**自己的定义覆盖了语言的原始定义。**

ES6 提供了 Proxy 构造函数，用于生成 Proxy 实例。

```javascript
/**
 * new Proxy() 生成一个 Proxy 实例
 * target 参数表示所要拦截的目标对象
 * handler 参数也是一个对象，用来定制拦截行为
 */
let proxy = new Proxy(target, handler);
```

注意：

要使 Proxy 起作用，必须针对 Proxy 实例进行操作，而不是目标对象。

如果 handler 没有设置任何拦截，那句等同于直接通向源对象。

例子：

```javascript
let target = {};
let handler = {};
var proxy = new Proxy(target, handler);
proxy.count = 1;
console.log(proxy.count); // 1
target.count = 2;
console.log(target.count); // 2
```

现在有一个技巧：将 Proxy 设置到 object.proxy 属性中，从而可以在 object 对象上调用。

```javascript
let object = {
  proxy: new Proxy(target, handler)
};
```

也可以将 proxy 直接挂载到原型上

```javascript
let proxy = new Proxy(
  {},
  {
    get: function (target, handler) {
      return 'houfee';
    }
  }
);

let obj = Object.create(proxy);

console.log(obj.name); // houfee

// proxy 是 obj 原型上的对象，根据原型链会在 proxy 对象读取该属性，导致被拦截
```

同一个拦截器函数设置多个操作：

```javascript
var handler = {
  get: function (target, name) {
    if (name === 'prototype') {
      return Object.prototype;
    }
    return `holle ${name}`;
  },

  apply: function (target, thisBinding, args) {
    return args[0];
  },

  construct: function (target, args) {
    return { value: args[1] };
  }
};

var fproxy = new Proxy(function (x, y) {
  return x * y;
}, handler);

console.log(fproxy(2, 5)); // 2
console.log(new fproxy(2, 5)); // {value: 5}
console.log(fproxy.prototype === Object.prototype); // true
console.log(fproxy.houfee); // holle houfee
```

## 方法

1.get(target, propKey, receiver)

拦截对象属性的读取，比如 proxy.houfee 和 proxy['houfee']，最后一个参数 receiver 是一个可选参数。

2.set(target, propKey, value, receiver)

拦截对象属性的设置，比如 proxy.houfee = v 和 proxy['houfee'] = v ,返回一个 boolean 值

3.has(target, propKey)

拦截 propKey in proxy 的操作，返回一个布尔值。

4.deleteProperty(target, propKey)

拦截 delete proxy[propKey] 的操作，返回一个布尔值。

5.ownKeys(target)

拦截 Object.getOwnPropertyNames(proxy)、 Object.getOwnPropertySymbols(proxy)、Object(proty)，返回一个数组。 该方法返回目标对象所有自身属性的属性名，而 Object.keys() 的返回结果仅包括目标对象自身的可遍历属性。

6.getOwnPropertyDescriptor(target, propKey)

拦截 Object.getOwnPropertyDescriptor(target, propKey)，返回属性的描述对象。

7.defineProperty(target, propKey, propDesc)

拦截 Object.defineProperty(target, propKey, propDesc)、Object.defineProperties(proxy, propDesc)，返回一个布尔值。

8.preventExtensions(target)

拦截 Object.preventExtensions(proxy)，返回一个布尔值。

9.getPrototypeOf(target)

拦截 Object.getPrototypeOf(target)，返回一个对象。

10.isExtensible(target)

拦截 Object.isExtensible(target)，返回一个布尔值。

11.setPrototypeOf(target, proto)

拦截 Object.setPrototypeOf(target, proto)，返回一个布尔值。如果目标对象是函数，呢么还有 2 种额外操作可以拦截。

12.apply(target, object, args)

拦截 Proxy 实例，并将其作为函数调用，比如 proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。

13.construct(target, args)

拦截 Proxy 实例作为构造函数调用的操作，比如 new proxy(...args)。

## Proxy 实例的方法

### 1. get(target, propKey, receiver)

**拦截对象属性的读取**

```js
var person = {
  name: 'houfee'
};

var proxy = new Proxy(person, {
  get: function (target, property) {
    if (property in target) {
      return target[property];
    } else {
      return `person对象不存在${property}属性`;
    }
  }
});
console.log(proxy.name); // houfee
console.log(proxy.age); // person对象不存在age属性
```

如果直接`person.age`会返回`undefined`

`get` 方法用于原型：

```js
var proto = new Proxy(
  {},
  {
    get: function (target, propertyKey, receiver) {
      console.log('GET ' + propertyKey);
      return target[propertyKey];
    }
  }
);
let obj = Object.create(proto);
console.log(obj.name); // GET name
```

使用 `get` 拦截实现数组读取负数索引。

```js
function createArray(...elements) {
  let handler = {
    get: function (target, propKey, receiver) {
      let index = Number(propKey);
      if (index < 0) {
        propKey = String(target.length + index);
      }
      return Reflect.get(target, propKey, receiver);
    }
  };
  let target = [];
  target.push(...elements);
  return new Proxy(target, handler);
}

let arr = createArray('a', 'b', 'c');
console.log(arr[-1]); // c 数组是特殊的对象！
```

其他 demo 参看《ES6 标准入门》。

### 2. set(target, propKey, value, receiver)

拦截对象属性的设置。

```js
let validator = {
  set: function (obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('这个数不是整数');
      } else {
        throw new TypeError('这个数是整数');
      }
    }
    // 对于 age 以为的属性，直接保存
    obj[prop] = value;
  }
};

let person = new Proxy({}, validator);
person.age = 100;
console.log(person.age); // TypeError: 这个数是整数
person.age = 10.5;
console.log(person.age); // TypeError: 这个数不是整数
person.age = 'houfee';
console.log(person.age); // TypeError: 这个数不是整数
```

**利用 set 方法还可以实现数据绑定，即使每当对象发生变化时，会自动更新 DOM**

```js
let handler = {
  get: function (target, key) {
    invariant(key, 'get');
    return target[key];
  },
  set: function (target, key, value) {
    invariant(key, 'set');
    target[key] = value;
    return true;
  }
};

function invariant(key, action) {
  if (key[0] === '_') {
    console.log(`${action} 私有${_prop}属性的尝试无效`);
  }
}

var target = {};
var proxy = new Proxy(target, handler);
console.log(proxy._prop); // get 私有 _prop 属性的尝试无效
proxy._prop = 'c'; // set 私有 _prop 属性的尝试无效

// 只要读/写的属性名的第一个字符是_,一律console，从而达到紧致读写的目的。
```

### 3. apply(target, object, args)

apply 方法一律拦截函数的调用，call 和 appply 操作。

```
apply(target, object, args)
target: 目标对象
object： 目标对象的上下文 this
args： 目标对象的参数数组

var handler = {
    apply: function(target, ctx, args) {
        return Reflect.apply(..argments)
    }
}
```

例子 1：

```js
var target = function () {
  return 'i am the target!';
};
var handler = {
  apply: function () {
    return 'i am the proxy!';
  }
};

var p = new Proxy(target, handler);
console.log(p()); // i am the proxy! 函数P调用时，被apply方法拦截，赶回字符串
```

例子 2：

```js
var twice = {
  apply: function (target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};

function sum(left, right) {
  return left + right;
}

var proxy = new Proxy(sum, twice);

console.log(proxy(1, 3)); // 8
console.log(proxy.call(null, 5, 3)); // 16
console.log(proxy.apply(null, [8, 9])); // 34
console.log(Reflect.apply(proxy, null, [5, 4])); // 18 Reflect.apply也会被拦截
```

### 4. has(target, propKey)

has 方法拦截的是 HasProperty 操作，判断对象是否具有某个属性时，这个方法会生效。而不是拦截 HasOwnProperty 操作，即 has 方法**不判断一个属性是对象自身的属性还是继承来的属性。**

下面的例子使用 has 方法影藏了某些操作，使其不被 in 运算符发现。

```js
var handler = {
  has(target, key) {
    if (key[0] === '_') {
      return false;
    }
    return key in target;
  }
};
var target = { _prop: 'foo', prop: 'fee' };
var proxy = new Proxy(target, handler);
console.log('_prop' in proxy); // false
```

上面的代码中，如果源对象的属性名第一个字符是“\_”，那么就返回 false，从而不被 in 运算符发现。

如果源对象不可配置或者紧致扩展，那么这是 has 拦截会报错。

```js
var obj = { a: 10 };
Object.preventExtensions(obj);
var p = new Proxy(obj, {
  has(target, prop) {
    return false;
  }
});

console.log('a' in p); // Uncaught TypeError: 'has' on proxy: trap returned falsish for property 'a' but the proxy target is not extensible 代理上的未捕获类型错误：“has”：陷阱为属性“a”返回了虚假的，但代理目标不可扩展
```

上面的代码中，obj 对象紧致扩展，结果使用 has 拦截会报错。也就是说，如果某个属性不可配置（或者目标对象不可扩展），则 has 方法就不得“隐藏”（即返回 false）目标对象的该属性。

```js
let stu1 = { name: '张三', score: 59 };
let stu2 = { name: '李四', score: 89 };

let handler = {
  has(target, prop) {
    if (prop === 'score' && target[prop] < 60) {
      console.log(`${target.name} 不及格`);
      return false;
    }
    return prop in target;
  }
};
let proxy1 = new Proxy(stu1, handler);
let proxy2 = new Proxy(stu2, handler);
console.log('score' in proxy1); // 张三 不及格 false
console.log('score' in proxy2); // true
for (let a in proxy1) {
  console.log(proxy1[a]); // 张三 59
}
for (let a in proxy2) {
  console.log(proxy2[a]); // 李四 89
}
```

上面的代码中，has 拦截只对 in 循环生效，对 for ... in 循环不生效，导致不符合要求的属性没有被排除在 for...in 循环之外。

### 5. construct(target, args)

construct 用于拦截 new 命令，下面是拦截的写法：

```js
let handler = {
  construct(target, args, newTarget) {
    return new target(...args);
  }
};
// target 目标对象
// args 构建函数的参数对象
```

例子：

```js
var p = new Proxy(function () {}, {
  construct(target, args) {
    console.log(`called: ${args.join('-')}`);
    return { value: args[0] * 10 };
  }
});
console.log(new p(1).value); // called: 1  10
```

construct 方法返回值必须是一个对象，否则会报错

### 6. deleteProperty(target, propKey)

deleteProperty 用于拦截 delete 操作，如果这个方法抛出错误或者返回 false，当属性就无法被 delete 命令删除。

```js
let handler = {
  deleteProperty(target, key) {
    invariant(key, 'delete');
    return true;
  }
};
function invariant(key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}"`);
  }
}

var target = { _prop: 'foo' };
var proxy = new Proxy(target, handler);
console.log(delete proxy._prop); //  Invalid attempt to delete private "_prop"
```

上面代码，deleteProperty 拦截了 delete 操作符，删除第一个字符为“\_”的属性会报错。

**注意：目标对象的不可配置（configurable）的属性不能被 deleteProperty 删除，否则会报错。**

### 7. defineProperty(target, propKey, propDesc)

defineProperty 方法拦截 Object.defineProperty 操作。

```js
let handler = {
  defineProperty(target, key, descriptor) {
    console.log(key); // foo
    return false;
  }
};

var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = 'bar';
// 书上 解释会报错，但是在chrome 中没有！！！
```

### 8. getOwnPropertyDescriptor(target, propKey)

getOwnPropertyDescriptor 拦截 Object.getOwnPropertyDescriptor ()，返回一个属性描述对象 或者 undefined。

例子：

```js
let handler = {
  getOwnPropertyDescriptor(target, key) {
    console.log(key); // wat // _foo // baz
    if (key[0] === '_') {
      return;
    }
    return Object.getOwnPropertyDescriptor(target, key);
  }
};

var target = { _foo: 'bar', baz: 'tar' };
var proxy = new Proxy(target, handler);
let data1 = Object.getOwnPropertyDescriptor(proxy, 'wat');
console.log(data1); // undefined
let data2 = Object.getOwnPropertyDescriptor(proxy, '_foo');
console.log(data2); // undefined
let data3 = Object.getOwnPropertyDescriptor(proxy, 'baz');
console.log(data3); // {value: "tar", writable: true, enumerable: true, configurable: true}
```

上面代码中，handler.getOwnPropertyDescriptor 方法对于第一个字符为下划线的属性名会返回 undefined。

### 9. getPrototypeOf(target)

getPrototypeOf 主要用来拦截获取对象原型。拦截以下操作：

```js
Object.prototype.__prop__
Object.prototype.isPrototypeOf()
Object.getPrototypeOf()
Reflect.getPrototypeOf()
instanceof
```

例子：

```js
var proto = {};
var p = new Proxy(
  {},
  {
    getPrototypeOf(target) {
      return proto;
    }
  }
);
console.log(Object.getPrototypeOf(p) === proto); // true
```

上面代码 getPrototypeOf 方法拦截 Object.getPrototypeOf()， 返回 proto 对象。

注意：getPrototypeOf 方法的返回值必须是对象 或者是 null，否则会报错。另外，如果目标对象不可扩展（extensible），getPrototypeOf 方法补习返回目标对象的原型对象。

### 10. isExtensible(target)

isExtensible 拦截 Object.isExtensible 操作

```js
var p = new Proxy(
  {},
  {
    isExtensible(target) {
      console.log('called'); // called
      return true;
    }
  }
);
console.log(Object.isExtensible(p)); // true
```

上面代码，在调用 Object.isExtensible() 方法会输出 called。

**注意 isExtensible 只会返回布尔值，否则会自动转化为布尔值**

### 11. ownKeys(target)

ownKeys 方法用来拦截对象自身属性的读取操作。具体来说，拦截以下操作：

```js
Object.getOwnPropertyNames();
Object.getOwnPropertySymbols();
Object.keys();
```

例子：

```js
var target = { a: 1, b: 2, c: 3 };
let handler = {
  ownKeys(target) {
    return ['a'];
  }
};
let proxy = new Proxy(target, handler);
console.log(Object.keys(proxy)); // ["a"]
```

上面代码拦截了对于 target 对象的 Object.keys(proxy)值返回 a 属性。

例子 2： 拦截第一个字符为\_

```js
var target = { _a: 1, _b: 2, c: 3 };
let handler = {
  ownKeys(target) {
    return Reflect.ownKeys(target).filter(key => key[0] !== '_');
  }
};
let proxy = new Proxy(target, handler);
for (let key of Object.keys(proxy)) {
  console.log(target[key]);
} // 3
```

需要注意的是，使用 Object.keys 方法时，有三类属性会被 ownKeys 自动过滤掉，不会返回。

```
目标对象不存在的属性
属性名为 Symbol 的值
不可遍历（enumerable）的属性
```

例子 3：

```js
var target = { a: 1, b: 2, c: 3, [Symbol.for('secret')]: 4 };
Object.defineProperty(target, 'key', {
  enumerable: false,
  configurable: true,
  writable: true,
  value: 'static'
});
let handler = {
  ownKeys(target) {
    return ['a', 'd', Symbol.for('secret'), 'key'];
  }
};
let proxy = new Proxy(target, handler);
console.log(Object.keys(proxy)); // ["a"]
// 不存在的属性d Symbol属性 不可遍历的属性 都被过滤掉了
```

例子 4： ownKeys 还可以拦截 Object.getOwnPropertyNames()

```js
var p = new Proxy(
  {},
  {
    ownKeys(target) {
      return ['a', 'b', 'c'];
    }
  }
);
let s = Object.getOwnPropertyNames(p);
console.log(s); // ["a", "b", "c"]
```

ownKeys 方法返回的数据成员只能是字符串 或 symbol 值，如果有其他类型的值，或者返回的根本不是数组，就会报错：

```js
var p = new Proxy(
  {},
  {
    ownKeys(target) {
      return ['a', 'b', true, undefined, null, {}, []];
    }
  }
);
let s = Object.getOwnPropertyNames(p);
console.log(s); // Uncaught TypeError: true is not a valid property name
// 每一个数组成员都不是字符串或者symbol值，因此会报错
```

如果目标对象自身包含不可配置的属性，则该属性必须被 ownKeys 方法返回，否则会报错：

```js
var obj = {};
Object.defineProperty(obj, 'a', {
  enumerable: true,
  configurable: false,
  value: 1000
});
var p = new Proxy(obj, {
  ownKeys(target) {
    return ['b'];
  }
});
let s = Object.getOwnPropertyNames(p);
console.log(s); // 'ownKeys' on proxy: trap result did not include 'a'
```

上面代码，obj 的 a 属性不可配置，这时 ownKeys 方法返回的数组之中必须包含 a，否则会报错。

另外，如果目标对象是不可扩展的，这时 ownKeys 方法返回的数组中必须包含源对象的所有属性，切不能包含多余的属性，否则会报错：

```js
var obj = { a: 123 };
Object.preventExtensions(obj);
var p = new Proxy(obj, {
  ownKeys(target) {
    return ['a', 'b'];
  }
});
let s = Object.getOwnPropertyNames(p);
console.log(s); // TypeError: 'ownKeys' on proxy: trap returned extra keys but proxy target is non-extensible
```

上面的对象 obj 是不可扩展的，这时 ownKeys 方法返回的数组之中包含了 obj 对象的多余属性，所以报错了。

### 12. preventExtensions(target)

preventExtensions 方法拦截 Object.preventExtensions() 。该方法必须返回一个布尔值，否则会被自动转为布尔值。

只有目标对象不可扩展时（即 Object.isExtensible(proxy) 为 false ）， proxy.preventExtensions 才能返回 true ，否则会报错。

```js
var p = new Proxy(
  {},
  {
    preventExtensions: function (target) {
      return true;
    }
  }
);
console.log(Object.preventExtensions(p)); // preventExtensions' on proxy: trap returned truish but the proxy target is extensible

//proxy.preventExtensions 方法返回 true ，但这时 Object.isExtensible(proxy) 会返回 true
```

为了防止出现这个问题，通常要在 proxy.preventExtensions 方法里面，调用一次 Object.preventExtensions 。

```js
var p = new Proxy(
  {},
  {
    preventExtensions: function (target) {
      console.log('called'); // called
      Object.preventExtensions(target);
      return true;
    }
  }
);
console.log(Object.preventExtensions(p)); // Proxy {}
```

### 13. setPrototypeOf(target, proto)

setPrototypeOf 方法主要用来拦截 Object.setPrototypeOf 方法。

例子：

```js
var handler = {
  setPrototypeOf(target, proto) {
    throw new Error('Changing the prototype is forbidden');
  }
};
var proto = {};
var target = function () {};
var proxy = new Proxy(target, handler);
console.log(Object.setPrototypeOf(proxy, proto)); //  Changing the prototype is forbiddenA
```

上面代码中，只要修改 target 的原型对象，就会报错。注意，该方法只能返回布尔值，否则会被自动转为布尔值。另外，如果目标对象不可扩展（extensible）， setPrototypeOf 方法不得改变目标对象的原型。

## Proxy.revocable()

Proxy.revocable 方法返回一个可取消的 Proxy 实例。

```js
let target = {};
let handler = {};
let { proxy, revoke } = Proxy.revocable(target, handler);
proxy.foo = 123;
console.log(proxy.foo); // 123
revoke();
console.log(proxy.foo); // Uncaught TypeError: Cannot perform 'get' on a proxy that has been revoked
// Proxy.revocable 方法返回一个对象，该对象的 proxy 属性是 Proxy 实例， revoke 属性是一个函数，可以取消 Proxy 实例。当执行 revoke 函数之后，再访问 Proxy 实例，就错误
```

**Proxy.revocable 的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。**

## this 问题

虽然 Proxy 可以代理针对目标对象的访问，但它不是目标对象的透明代理，**即不做任何拦截的情况下，也无法保证与目标对象的行为一致**。主要原因就是**在 Proxy 代理的情况下，目标对象内部的 this 关键字会指向 Proxy 代理。**

```js
const target = {
  m: function () {
    console.log(this === proxy); // false true false
  }
};
const handler = {};
const proxy = new Proxy(target, handler);
console.log(target.m()); // undefined
console.log(proxy.m()); // undefined
console.log(target.m()); // undefined
// 一旦 proxy 代理 target.m ，后者内部的 this 就指向 proxy 了，而不是 target
```

例子：由于 this 指向变化导致 Proxy 无法代理目标对象：

```js
const _name = new WeakMap();
class Person {
  constructor(name) {
    _name.set(this, name);
  }
  get name() {
    return _name.get(this);
  }
}
const jane = new Person('Jane');
console.log(jane.name); // 'Jane'
const proxy = new Proxy(jane, {});
console.log(proxy.name); // undefined
// 目标对象 jane 的 name 属性，实际保存在外部 WeakMap 对象 _name 上面，通过 this 键区分。由于通过 proxy.name 访问时， this 指向 proxy ，导致无法取到值，所以返回 undefined 。
```

此外，有些原生对象的内部属性，只有通过正确的 this 才能拿到，所以 Proxy 也无法代理这些原生对象的属性：

```js
const target = new Date();
const handler = {};
const proxy = new Proxy(target, handler);
console.log(proxy.getDate()); // TypeError: this is not a Date object.
// getDate 方法只能在 Date 对象实例上面拿到，如果 this 不是 Date 对象实例就会报错。
```

这时， this 绑定原始对象，就可以解决这个问题：

```js
const target = new Date('2015-01-01');
const handler = {
  get(target, prop) {
    if (prop === 'getFullYear') {
      return target.getFullYear.bind(target);
    }
    return Reflect.get(target, prop);
  }
};
const proxy = new Proxy(target, handler);
console.log(proxy.getFullYear()); // 2015
```

## 实例：Web 服务的客户端

Proxy 对象可以拦截目标对象的任意属性，这使得它很合适用来写 Web 服务的客户端

```js
const service = createWebService('http://example.com/data');
service.employees().then(json => {
  const employees = JSON.parse(json);
  // ···
});
```

上面代码新建了一个 Web 服务的接口，这个接口返回各种数据。Proxy 可以拦截这个对象的任意属性，所以不用为每一种数据写一个适配方法，只要写一个 Proxy 拦截就可以了。

```js
function createWebService(baseUrl) {
  return new Proxy(
    {},
    {
      get(target, propKey, receiver) {
        return () => httpGet(baseUrl + '/' + propKey);
      }
    }
  );
}
```

同理，Proxy 也可以用来实现数据库的 ORM 层。
