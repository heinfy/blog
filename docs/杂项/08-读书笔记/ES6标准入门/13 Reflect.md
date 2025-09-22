# Reflect

## 1. 概述 

-  将 Object 对象的一些明显属于语言内部的方法（比如 Object.defineProperty ），放到 Reflect 对象上。 
- 修改某些 Object 方法的返回结果，让其变得更合理。比如， Object.defineProperty(obj, name, desc) 在无法定义属性时，会抛出一个错误，而 Reflect.defineProperty(obj, name, desc) 则会返回 false 。 
- 让 Object 操作都变成函数行为。某些 Object 操作是命令式，比如 name in obj 和 delete obj[name] ，而 Reflect.has(obj, name) 和 Reflect.deleteProperty(obj, name) 让它们变成了函数行为。 
- Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法。

```js
// 老写法
Function.prototype.apply.call(Math.floor, undefined, [8.75]) // 8

// 新写法
Reflect.apply(Math.floor, undefined, [20.5]) // 20
```



## 2. 静态方法

**Reflect**对象一共哟13个静态方法：

```javascript
Reflect.apply(target, thisArg, args)
Reflect.construct(target, args)
Reflect.get(target, name, receiver)
Reflect.set(target, name, value, receiver)
Reflect.defineProperty(target, name, desc)
Reflect.deleteProperty(target, name)
Reflect.has(target, name)
Reflect.ownKeys(target)
Reflect.isExtensible(target)
Reflect.preventExtensions(target)
Reflect.getOwnPropertyDescriptor(target, name)
Reflect.getPrototypeOf(target)
Reflect.setPrototypeOf(target, prototype)
```

### 1.Reflect.get(target, name, receiver)

Reflect.get 方法查找并返回 target 对象的 name 属性，如果没有该属性，则返回 undefined 。

```js
var obj = {
    name: 'houfee',
    age: 24,
    get func() {
        return this.name + this.age
    }
}
console.log(Reflect.get(obj, 'name')) // houfee
console.log(Reflect.get(obj, 'age')) // 24
console.log(Reflect.get(obj, 'func')) // houfee24
```

如果 name 属性部署了读取函数（getter），则读取函数的 this 绑定 receiver 。

**改变this指向**

```js
var obj = {
    name: 'houfee',
    age: 24,
    get func() {
        return this.name + this.age
    }
}
var obj2 = {
    name: 'houyue',
    age: 14,
}
console.log(Reflect.get(obj, 'name')) // houfee
console.log(Reflect.get(obj, 'age')) // 24
console.log(Reflect.get(obj, 'func', obj2)) // houyue14
```

如果第一个参数不是对象， Reflect.get 方法会报错。



### 2.Reflect.set(target, name, value, receiver)

Reflect.set 方法设置 target 对象的 name 属性等于 value 。

```js
var obj = {
    name: 'houfee',
    set func(value) {
        return this.name = value
    }
}
var obj2 = {
    name: 'houyue'
}
console.log(Reflect.set(obj, 'name', 'houyue')) // true
console.log(Reflect.set(obj, 'func', 'houyue')) // true
console.log(obj) // {name: "houyue", age: 24}
```

如果 name 属性设置了赋值函数，则赋值函数的 this 绑定 receiver 。

```js
var obj = {
    name: 'houfee',
    set func(value) {
        return this.name = value
    }
}
var obj2 = {
    name: 'zhangsan'
}
console.log(Reflect.set(obj, 'func', 'houyue', obj2)) // true
console.log(obj) // {name: "houfee"}
console.log(obj2) // {name: "houyue"}
```

注意，如果 Proxy 对象和 Reflect 对象联合使用，前者拦截赋值操作，后者完成赋值的默认行为，而且传入了 receiver ，那么 Reflect.set 会触发 Proxy.defineProperty 拦截。

**Proxy** 和 **Reflect** 配合使用：

```js
let p = {
    a: 'a'
};
let handler = {
    set(target, key, value, receiver) {
        console.log('set');
        Reflect.set(target, key, value, receiver)
    },
    defineProperty(target, key, attribute) {
        console.log('defineProperty');
        Reflect.defineProperty(target, key, attribute);
    }
};
let obj = new Proxy(p, handler);
obj.a = 'A';
// set
// defineProperty
```

上面代码中， Proxy.set 拦截里面使用了 Reflect.set ，而且传入了 receiver ，导致触发 Proxy.defineProperty 拦截。这是因为 Proxy.set 的receiver 参数总是指向当前的 Proxy 实例（即上例的 obj ），而 Reflect.set 一旦传入 receiver ，就会将属性赋值到 receiver 上面（即 obj ），导致触发 defineProperty 拦截。如果 Reflect.set 没有传入 receiver ，那么就不会触发 defineProperty 拦截。

```js
let p = {
    a: 'a'
};
let handler = {
    set(target, key, value, receiver) {
        console.log('set');
        Reflect.set(target, key, value)
    },
    defineProperty(target, key, attribute) {
        console.log('defineProperty');
        Reflect.defineProperty(target, key, attribute);
    }
};
let obj = new Proxy(p, handler);
obj.a = 'A'; // set
```

如果第一个参数不是对象， Reflect.set 会报错。



### 3.Reflect.has(obj, name)

Reflect.has 方法对应 name in obj 里面的 in 运算符。

```js
var myObject = {
    foo: 1,
};
// 旧写法
console.log('foo' in myObject); // true
// 新写法
console.log(Reflect.has(myObject, 'foo')); // true
```

该方法返回一个布尔值。如果删除成功，或者被删除的属性不存在，返回 true ；删除失败，被删除的属性依然存在，返回 false 。



### 4. Reflect.deleteProperty(obj, name)

Reflect.deleteProperty 方法等同于 delete obj[name] ，用于删除对象的属性。

```js
const myObj = {
    foo: 'bar'
};
// 旧写法
delete myObj.foo;
// 新写法
Reflect.deleteProperty(myObj, 'foo');
```

该方法返回一个布尔值。如果删除成功，或者被删除的属性不存在，返回 true ；删除失败，被删除的属性依然存在，返回 false 。

### 5. Reflect.construct(target, args)

Reflect.construct 方法等同于 new target(...args) ，这提供了一种不使用 new ，来调用构造函数的方法。

```js
function Func(name) {
    this.name = name
}
// new 的写法
const instance = new Func('张三')
// Reflect.construct 的写法
const instance = Reflect.construct(Func, ['张三'])
```



### 6. Reflect.getPrototypeOf(obj)

Reflect.getPrototypeOf 方法用于读取对象的 __proto__ 属性，对应 Object.getPrototypeOf(obj) 。

```js
function Func(name) {
    this.name = name
}
// new 的写法
const instance = new Func('张三')
Object.getPrototypeOf(instance) === Func.prototype
// Reflect.construct 的写法
const instance = Reflect.construct(Func, ['张三'])
Reflect.getPrototypeOf(instance) === Func.prototype
```

Reflect.getPrototypeOf 和 Object.getPrototypeOf 的一个区别是：

如果参数不是对象， Object.getPrototypeOf 会将这个参数转为对象，然后再运行，而 Reflect.getPrototypeOf 会报错。



### 7. Reflect.setPrototypeOf(obj, newProto)

Reflect.setPrototypeOf 方法用于设置对象的 __proto__ 属性，返回第一个参数对象，对应bject.setPrototypeOf(obj, newProto) 。

```js
function Func(name) {
    this.name = name
}
function Age(age) {
    this.age = age
}
// new 的写法 将 Age 挂载到 instance 实例的原型上
var instance = new Func('张三')
Object.setPrototypeOf(instance, Age.prototype)
// Reflect.construct 的写法
var instance = Reflect.construct(Func, ['张三'])
Reflect.setPrototypeOf(instance, Age.prototype)
```

如果第一个参数不是对象， Object.setPrototypeOf 会返回第一个参数本身，而 Reflect.setPrototypeOf 会报错。

如果第一个参数是 undefined 或 null ， Object.setPrototypeOf 和 Reflect.setPrototypeOf 都会报错。



### 8. Reflect.apply(func, thisArg, args)

Reflect.apply 方法等同于 Function.prototype.apply.call(func, thisArg, args) ，用于绑定 this 对象后执行给定函数。
一般来说，如果要绑定一个函数的 this 对象，可以这样写 fn.apply(obj, args) ，但是如果函数定义了自己的 apply 方法，就只能写成 Function.prototype.apply.call(fn, obj, args) ，采用 Reflect 对象可以简化这种操作。

```js
const ages = [11, 33, 12, 54, 18, 96];
// 旧写法
const youngest = Math.min.apply(Math, ages);
const oldest = Math.max.apply(Math, ages);
const type = Object.prototype.toString.call(youngest);
// 新写法
const youngest = Reflect.apply(Math.min, Math, ages);
const oldest = Reflect.apply(Math.max, Math, ages);
const type = Reflect.apply(Object.prototype.toString, youngest, []);
```



### 9.  Reflect.defineProperty(target, propertyKey, attributes)

Reflect.defineProperty 方法基本等同于 Object.defineProperty ，用来为对象定义属性。未来，后者会被逐渐废除，请从现在开始就使用 Reflect.defineProperty 代替它。

```js
function MyDate() {
    /*…*/
}
// 旧写法
Object.defineProperty(MyDate, 'now', {
    value: () => Date.now()
});
// 新写法
Reflect.defineProperty(MyDate, 'now', {
    value: () => Date.now()
});
```

如果 Reflect.defineProperty 的第一个参数不是对象，就会抛出错误，比如 Reflect.defineProperty(1, 'foo') 。



### 10. Reflect.getOwnPropertyDescriptor(target, propertyKey)

Reflect.getOwnPropertyDescriptor 基本等同于 Object.getOwnPropertyDescriptor ，用于得到指定属性的描述对象，将来会替代掉后者。

```js
var myObject = {};
Object.defineProperty(myObject, 'hidden', {
    value: true,
    enumerable: false,
});
// 旧写法
var theDescriptor = Object.getOwnPropertyDescriptor(myObject, 'hidden');
// 新写法
var theDescriptor = Reflect.getOwnPropertyDescriptor(myObject, 'hidden');
```

Reflect.getOwnPropertyDescriptor 和 Object.getOwnPropertyDescriptor 的一个区别是，如果第一个参数不是对象，
Object.getOwnPropertyDescriptor(1, 'foo') 不报错，返回 undefined ，

而 Reflect.getOwnPropertyDescriptor(1, 'foo') 会抛出错误，表示参数非法。



### 11.Reflect.isExtensible (target)

Reflect.isExtensible 方法对应 Object.isExtensible ，返回一个布尔值，表示当前对象是否可扩展。

```js
const myObject = {};
// 旧写法
Object.isExtensible(myObject) // true
// 新写法
Reflect.isExtensible(myObject) // true
```

如果参数不是对象， Object.isExtensible 会返回 false ，因为非对象本来就是不可扩展的，而 Reflect.isExtensible 会报错。



### 12. Reflect.preventExtensions(target)

Reflect.preventExtensions 对应 Object.preventExtensions 方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。

```js
var myObject = {};
// 旧写法
Object.preventExtensions(myObject) // Object {}
// 新写法
Reflect.preventExtensions(myObject) // true
```

如果参数不是对象， Object.preventExtensions 在 ES5 环境报错，在 ES6 环境返回传入的参数，而 Reflect.preventExtensions 会报错。



### 13. Reflect.ownKeys (target)

Reflect.ownKeys 方法用于返回对象的所有属性，基本等同于 Object.getOwnPropertyNames 与 Object.getOwnPropertySymbols 之和。

```js
var myObject = {
    foo: 1,
    bar: 2,
    [Symbol.for('baz')]: 3,
    [Symbol.for('bing')]: 4,
};
// 旧写法
Object.getOwnPropertyNames(myObject)
// ['foo', 'bar']
Object.getOwnPropertySymbols(myObject)
//[Symbol(baz), Symbol(bing)]
Reflect.ownKeys(myObject)
// ['foo', 'bar', Symbol(baz), Symbol(bing)]
```



## 3. 实例：使用 Proxy 实现观察者模式

观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行。

```js
const person = observable({
    name: '张三',
    age: 20
});

function print() {
    console.log(`${person.name}, ${person.age}`)
}
observe(print);
person.name = '李四'; // 输出 // 李四, 20
```



上面代码中，数据对象 person 是观察目标，函数 print 是观察者。一旦数据对象发生变化， print 就会自动执行。

下面，使用 Proxy 写一个观察者模式的最简单实现，即实现 observable 和 observe 这两个函数。思路是 observable 函数返回一个原始对象的 Proxy 代理，拦截赋值操作，触发充当观察者的各个函数。

```js
const queuedObservers = new Set();
const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {
    set
});

function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    queuedObservers.forEach(observer => observer());
    return result;
}
```

上面代码中，先定义了一个 Set 集合，所有观察者函数都放进这个集合。然后， observable 函数返回原始对象的代理，拦截赋值操作。拦截函数 set 之中，会自动执行所有观察者。

