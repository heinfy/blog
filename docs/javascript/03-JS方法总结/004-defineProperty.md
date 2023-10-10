# Object.defineProperty

- 文档：[【mozilla defineProperty】](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- 学习视频：[从 0 到 1 学习「Object.defineProperty」](https://www.bilibili.com/video/BV12z4y1U7no)

## 定义

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

## 参数

`Object.defineProperty(obj, prop, descriptor)`

> obj：要定义属性的对象
> prop：要定义或修改的属性的名称或 Symbol
> descriptor：要定义或修改的属性描述符
> 返回值：被传递给函数的对象

## 描述

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

### 描述符默认值汇总

拥有布尔值的键 configurable、enumerable 和 writable 的默认值都是 false。
属性值和函数的键 value、get 和 set 字段的默认值为 undefined。

### 描述符可拥有的键值

如果一个描述符不具有 value、writable、get 和 set 中的任意一个键，那么它将被认为是一个数据描述符。如果一个描述符同时拥有 value 或 writable 和 get 或 set 键，则会产生一个异常。

## DEMO

> 造轮子时控制属性，不被外界随意访问篡改。

定义一个列表，设置列表中每项属性的是否允许篡改，删除等。

```js
// 模拟数据
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
