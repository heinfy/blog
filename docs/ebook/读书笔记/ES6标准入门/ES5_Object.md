# [Object](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)

## 1、obj.key 或 obj[key]

**读取对象的属性或方法**：对象属性的读取：ES6 中被 Proxy 的 get(target, propKey, receiver)拦截。

**设置对象的属性的方法**：对象属性的设置：ES6 中被 Proxy 的 set(target, propKey, value, receiver)拦截，返回一个 boolean 值

[call()、apply()、bind()](https://www.cnblogs.com/houfee/articles/10071967.html)

```js
// 用 apply
var array = ['a', 'b', 'c']
var elements = [0, 1, 2]
array.push.apply(array, elements)
console.info(array) // ["a", "b", "c", 0, 1, 2]

let numbers = [1, 2, 4, 5, 7, 4, 2]
let max = Math.max.apply(null, numbers)
console.log(max) // 7
let min = Math.min.apply(null, numbers)
console.log(min) // 1

// 用 call
let animals = [
  { name: 'Lion', age: 17 },
  { name: 'Whale', age: 18 }
]
for (let i = 0; i < animals.length; i++) {
  ;(function (i) {
    this.print = function () {
      console.log('#' + i + ' ' + this.name + ', ' + this.age)
    }
    this.print()
  }.call(animals[i], i))
}
// 0 Lion, 17
// 1 Whale, 18
```

## 2、obj.func()

**对象的方法调用**：对象的方法调用：ES6 中被 Proxy 的 apply(target, object, args)拦截，apply 方法拦截函数的调用、call 和 apply 的操作。例如：proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。

## 3、key in obj

**判断对象中是否包含某个属性或方法**：判断对象存在与否：ES6 中被 Proxy 的 has(target, propKey) 拦截，返回一个布尔值。

## 4、construct 构造函数

**构造函数的调用**：ES6 中被 Proxy 的 construct(target, args) 拦截 Proxy 实例作为构造函数调用的操作，比如 new proxy(...args)。

## 5、delete obj.key

**删除对象中的某个属性**：删除对象中的某个属性：ES6 中被 Proxy 的 deleteProperty(target, propKey) 拦截，返回一个布尔值。

## 6、Object.defineProperty(obj, prop, descriptor)

**该方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。**

- obj：要在其上定义属性的对象。
- prop：要定义或修改的属性的名称。
- descriptor：将被定义或修改的属性描述符。
- 返回值：被传递给函数的对象

**默认情况下，使用  `Object.defineProperty()`  添加的属性值是不可修改的。**

MDN：[Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

ES6 中被 Proxy 的 defineProperty(target, propKey, propDesc) 拦截，返回一个布尔值。

注意：defineProperty(target, propKey, propDesc) 还拦截 Object.defineProperties(proxy, propDesc)，返回一个布尔值。

## 7、Object.getOwnPropertyDescriptor(target, propKey)

**该方法返回指定对象上一个自有属性对应的属性描述符。（自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性）**

- target: 需要查找的目标对象
- propKey: 目标对象内属性名称
- 返回值：如果指定的属性存在于对象上，则返回其属性描述符对象（property descriptor），否则返回 undefined。

**返回对象指定的属性配置**：该方法允许对一个属性的描述进行检索。在 Javascript 中，  属性   由一个字符串类型的“名字”（name）和一个“属性描述符”（property descriptor）对象构成。

一个属性描述符是一个记录，由下面属性当中的某些组成的：

- value：该属性的值(仅针对数据属性描述符有效)
- writable：当且仅当属性的值可以被改变时为true。(仅针对数据属性描述有效)
- get：获取该属性的访问器函数（getter）。如果没有访问器， 该值为undefined。(仅针对包含访问器或设置器的属性描述有效)
- set：获取该属性的设置器函数（setter）。 如果没有设置器， 该值为undefined。(仅针对包含访问器或设置器的属性描述有效)
- configurable：当且仅当指定对象的属性描述可以被改变或者属性可被删除时，为true。
- enumerable：当且仅当指定对象的属性可以被枚举出时，为 true。

ES6 中被 `Proxy的getOwnPropertyDescriptor(target, propKey)` 拦截，返回属性的描述对象。

## 8、[Object.getPrototypeOf(obj)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/GetPrototypeOf)

`Object.getPrototypeOf()`  方法返回指定对象的原型（内部`[[Prototype]]`属性的值）。

- obj:要返回其原型的对象
- 返回值：给定对象的原型。如果没有继承属性，则返回 null

```js
const prototype1 = {}
const object1 = Object.create(prototype1)

console.log(Object.getPrototypeOf(object1) === prototype1) // true
```

ES6 中被 `Proxy的getPrototypeOf(target) `拦截，返回一个对象。

## 9、[Object.isExtensible(obj)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)

`Object.isExtensible()`  方法判断一个对象是否是可扩展的（是否可以在它上面添加新的属性）。

- obj：需要检测的对象
- 返回值：表示给定对象是否可扩展的一个Boolean

默认情况下，对象是可扩展的：即可以为他们添加新的属性。以及它们的  [`__proto__`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)  属性可以被更改。[`Object.preventExtensions`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)，[`Object.seal`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)  或  [`Object.freeze`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)  方法都可以标记一个对象为不可扩展（non-extensible）。

```js
// 新对象默认是可扩展的.
var empty = {}
Object.isExtensible(empty) // === true

// ...可以变的不可扩展.
Object.preventExtensions(empty)
Object.isExtensible(empty) // === false

// 密封对象是不可扩展的.
var sealed = Object.seal({})
Object.isExtensible(sealed) // === false

// 冻结对象也是不可扩展.
var frozen = Object.freeze({})
Object.isExtensible(frozen) // === false
```

注意：在 ES5 中，如果参数不是一个对象类型，将抛出一个  [`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError)  异常。在 ES6 中， non-object 参数将被视为一个不可扩展的普通对象，因此会返回 false 。

ES6 中被 `Proxy的isExtensible(target)` 拦截，返回一个布尔值。

## 10、[Object.getOwnPropertyNames(obj)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)、 [Object.getOwnPropertySymbols(obj)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)、[Object.keys(obj)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)

### 10.1、Object.getOwnPropertyNames(obj)

**Object.getOwnPropertyNames()**方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括 Symbol 值作为名称的属性）组成的数组。

- obj：一个对象，其自身的可枚举和不可枚举属性的名称被返回。
- 返回值：在给定对象上找到的自身属性对应的字符串数组。
- 描述：`Object.getOwnPropertyNames()`  返回一个数组，该数组对的元素是  `obj`自身拥有的枚举或不可枚举属性名称字符串。  数组中枚举属性的顺序与通过  [`for...in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in)  循环（或  [`Object.keys`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)）迭代该对象属性时一致。数组中不可枚举属性的顺序未定义。

### 10.2、Object.getOwnPropertySymbols(obj)

`Object.getOwnPropertySymbols()`  方法返回一个给定对象自身的所有 Symbol  属性的数组。

- obj：要返回 Symbol 属性的对象。
- 返回值：在给定对象自身上找到的所有 Symbol 属性的数组

因为所有的对象在初始化的时候不会包含任何的 Symbol，除非你在对象上赋值了 Symbol  否则`Object.getOwnPropertySymbols()`只会返回一个空的数组。

### 10.3、Object.keys(obj)

`Object.keys()`  方法会返回一个由一个给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和使用  [`for...in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in)  循环遍历该对象时返回的顺序一致 。如果对象的键-值都不可枚举，那么将返回由键组成的数组。

ES6 中，Proxy 的`ownKeys(target)`方法拦截`Object.getOwnPropertyNames(proxy)`、 `Object.getOwnPropertySymbols(proxy)`、`Object.keys(proty)`，返回一个数组。

该方法返回目标对象所有自身属性的属性名，而 Object.keys() 的返回结果仅包括目标对象自身的可遍历属性。

## 11、Object.preventExtensions(obj)

`**Object.preventExtensions()**`方法让一个对象变的不可扩展，也就是永远不能再添加新的属性。

- obj：将要变得不可扩展的对象。
- 返回值：已经不可扩展的对象。

`Object.preventExtensions()`仅阻止添加自身的属性。但属性仍然可以添加到对象原型。一旦使其不可扩展，就无法再对象进行扩展。

[例子](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions#Examples)

```js
// Object.preventExtensions将原对象变的不可扩展,并且返回原对象.
var obj = {}
var obj2 = Object.preventExtensions(obj)
obj === obj2 // true

// 字面量方式定义的对象默认是可扩展的.
var empty = {}
Object.isExtensible(empty) //=== true

// ...但可以改变.
Object.preventExtensions(empty)
Object.isExtensible(empty) //=== false

// 使用Object.defineProperty方法为一个不可扩展的对象添加新属性会抛出异常.
var nonExtensible = { removable: true }
Object.preventExtensions(nonExtensible)
Object.defineProperty(nonExtensible, 'new', { value: 8675309 }) // 抛出TypeError异常

// 一个不可扩展对象的原型是不可更改的,__proto__是个非标准魔法属性,可以更改一个对象的原型.
var fixed = Object.preventExtensions({})
fixed.__proto__ = { oh: 'hai' } // 抛出TypeError异常
```

在 ES5 中，如果参数不是一个对象类型，将抛出一个[`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError)异常。在 ES2015 中，非对象参数将被视为一个不可扩展的普通对象，因此会被直接返回。

ES6 Proxy 中 `preventExtensions(target) `方法拦截` Object.preventExtensions()` 。该方法必须返回一个布尔值，否则会被自动转为布尔值。

只有目标对象不可扩展时（即 Object.isExtensible(proxy) 为 false ）， proxy.preventExtensions 才能返回 true ，否则会报错。

## 12、[Object.setPrototypeOf(obj, prototype)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)

**Object.setPrototypeOf()**  方法设置一个指定的对象的原型 ( 即, 内部[[Prototype]]属性）到另一个对象或  [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)。

- obj：要设置其原型的对象。
- prototype：该对象的新原型(一个对象 或 null)

如果对象的[[Prototype]]被修改成不可扩展(通过  [`Object.isExtensible()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)查看)，就会抛出  [`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError)异常。如果`prototype`参数不是一个对象或者[`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)(例如，数字，字符串，boolean，或者  [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined))，则什么都不做。否则，该方法将`obj`的`[[Prototype]]`修改为新的值。

ES6 中，setPrototypeOf(target, proto)拦截 Object.setPrototypeOf(target, proto)，返回一个布尔值。

## 13、对象属性的可枚举性和遍历

### 1 可枚举性

#### 1.1 Object.getOwnPropertyDescriptor()

解释：获取对西乡属性的描述对象。

```js
let obj = { foo: 123 }
console.log(Object.getOwnPropertyDescriptor(obj, 'foo'))
// {
//   configurable: true
//   enumerable: true
//   value: 123
//   writable: true
//   __proto__: Object
// }
```

> **enumerable**属性，称为可枚举性，如果为 false 时，就表示某些操作会忽略当前属性。
> 目前，有四个操作会忽略**enumerable**为 false 的属性。
> for...in 循环：只遍历对象自身的和继承的可枚举的属性。
> Object.keys()：返回对象自身的所有可枚举的属性的键名。**使用这个遍历对象！**
> JSON.stringify()：只串行化对象自身的可枚举的属性。
> Object.assign()： 忽略 enumerable 为 false 的属性，只拷贝对象自身的可枚举的属性

```js
Object.getOwnPropertyDescriptor(Object.prototype, 'toString').enumerable // false
Object.getOwnPropertyDescriptor([], 'length').enumerable // false
// toString和length属性的enumerable都是false，因此for...in不会遍历到这两个继承自原型的属性。
```

#### 1.2 Object.getOwnPropertyDescriptors()

`Object.getOwnPropertyDescriptors` 方法，返回指定对象所有自身属性（非继承属性）的描述对象。

```js
const obj = {
  foo: 123,
  get bar() {
    return 'abc'
  }
}
Object.getOwnPropertyDescriptors(obj)
```

上面代码中，`Object.getOwnPropertyDescriptors(obj) `方法返回一个对象，所有原对象的属性名都是该对象的属性名，对应的属性值就是该属性的描述对象。

## 14、对象实例的原型对象

如果一个对象本身部署了`__proto__`属性，该属性的值就是对象的原型。

### Object.setPrototypeOf()

```js
// 格式
Object.setPrototypeOf(object, prototype)
// 用法
const o = Object.setPrototypeOf({}, null);
// 该方法等同于下面的函数。
function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
}
```

例子：

```js
let proto = {}
let obj = { x: 10 }
Object.setPrototypeOf(obj, proto)
proto.y = 20
obj.x // 10
obj.y // 20
```

注意：

1. 如果第一个参数不是对象，会自动转为对象。但是由于返回的还是第一个参数，所以这个操作不会产生任何效果。
2. 由于 undefined 和 null 无法转为对象，所以如果第一个参数是 undefined 或 null，就会报错。

### Object.getPrototypeOf()

该方法与`Object.setPrototypeOf`方法配套，用于读取一个对象的原型对象。

```js
Object.getPrototypeOf(obj)
```

1. 如果参数不是对象，会被自动转为对象。
2. 如果参数是 undefined 或 null，它们无法转为对象，所以会报错。

### super 关键字

我们知道，this 关键字总是指向函数所在的**当前对象**，ES6 又新增了另一个类似的关键字**super**，指向当前对象的**原型对象**。

```js
const proto = { foo: 'hello' }
const obj = {
  find() {
    return super.foo
  }
}

Object.setPrototypeOf(obj, proto)
obj.find() // "hello"
// 上面代码中，对象obj的find方法之中，通过super.foo引用了原型对象proto的foo属性。
```

注意，super 关键字表示原型对象时，**只能用在对象的方法之中，用在其他地方都会报错。**

JavaScript 引擎内部，**super.foo**等同于**Object.getPrototypeOf(this).foo**（属性）或**Object.getPrototypeOf(this).foo.call(this)**（方法）。

例题：

```js
const proto = {
  x: 'hello',
  foo() {
    console.log(this.x)
  }
}

const obj = {
  x: 'world',
  foo() {
    super.foo()
  }
}

Object.setPrototypeOf(obj, proto)
obj.foo() // "world"
// 上面代码中，super.foo指向原型对象proto的foo方法，但是绑定的this却还是当前对象obj，因此输出的就是world。
```
