##### 属性描述符

JavaScript 中的属性描述符（Property Descriptor）是一个包含对象属性相关信息的数据结构，它可以用来定义和控制属性的行为和特性。每个对象属性都有一个相关的属性描述符，可以通过 `Object.getOwnPropertyDescriptor()` 方法来获取该属性的描述符。

##### `Object.defineProperty()`

Object.defineProperty()` 是 JavaScript 中一个非常重要的方法，它可以用来定义对象属性的行为和特性。具体来说，它可以用来实现以下功能：

1. 定义新的对象属性或修改已有属性的特性：通过 `Object.defineProperty()` 方法，我们可以重新定义一个对象的已有属性或者创建一个新的属性，并指定该属性的特性（例如是否可读写、是否可枚举、是否可删除等）。
2. 实现数据绑定或拦截器：通过在属性描述符中定义 `get` 和 `set` 访问器方法，我们可以实现数据绑定或拦截器，即在属性值被获取或设置时执行一些自定义逻辑。
3. 禁止对象扩展或密封：通过属性描述符的 `configurable` 属性，我们可以禁止对象的扩展或密封，从而防止新属性的添加、已有属性的删除或属性特性的修改。

需要注意的是，`Object.defineProperty()` 方法只能对对象的直接属性进行操作，而不能对对象的原型链属性进行操作。如果想要对整个对象或对象的原型链进行操作，可以使用其他方法，例如 `Object.defineProperties()`、`Object.create()`、`Object.setPrototypeOf()` 等。

##### 如何判断对象上是否包含某个属性

1. `in` 操作符：`in` 操作符会检查属性是否在对象及其原型链中。

2. `Object.hasOwnProperty()` 方法只会检查属性是否在对象上，不会检查原型链。

3. `Object.getPrototypeOf()` 方法可以用来获取一个对象的原型对象。如果一个属性不在对象自身的属性列表中，可以使用该方法来判断该属性是否在原型链上。

4. `Object.prototype.hasOwnProperty.call()` 方法

`Object.prototype.hasOwnProperty.call()` 方法可以用来判断一个属性是否在对象的原型链上。具体做法是使用 `call()` 方法将 `Object.prototype.hasOwnProperty()` 方法绑定到对象上，并将属性名作为参数传入该方法。

```js
const obj = {};
console.log(Object.prototype.hasOwnProperty.call(obj, 'toString')); // true
```

##### 遍历对象属性的方法

1. `for...in` 循环：使用 `for...in` 循环可以遍历对象自身及其原型链上的所有可枚举属性，因此需要使用 `Object.hasOwnProperty()` 方法来判断属性是否是对象自身的属性。

```js
const obj = { a: 1, b: 2 };
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key, obj[key]);
  }
}
```

2. `Object.keys()` 方法：`Object.keys()` 方法可以返回一个数组，该数组包含对象自身的所有可枚举属性的属性名。因此，可以使用该方法来遍历对象自身的属性。

```js
const obj = { a: 1, b: 2 };
Object.keys(obj).forEach(key => {
  console.log(key, obj[key]);
});
```

3. `Object.getOwnPropertyNames()` 方法：`Object.getOwnPropertyNames()` 方法可以返回一个数组，该数组包含对象自身的所有属性的属性名，无论它们是否可枚举。因此，可以使用该方法来遍历对象自身的所有属性。

```js
const obj = { a: 1, b: 2 };
Object.getOwnPropertyNames(obj).forEach(key => {
  console.log(key, obj[key]);
});
```

需要注意的是，以上方法都只能遍历对象自身的属性，不能遍历对象原型链上的属性。如果需要遍历对象原型链上的属性，可以使用 `for...in` 循环，并结合 `Object.hasOwnProperty()` 方法来判断属性是否是对象自身的属性。

##### `Object` 对象上的方法

JavaScript 中 `Object` 对象上有很多方法，下面是一些常用的方法：

1. `Object.assign(target, ...sources)`：将一个或多个源对象的所有可枚举属性复制到目标对象，并返回目标对象。
2. `Object.create(proto, [propertiesObject])`：使用指定的原型对象和可选的属性对象创建一个新对象。
3. `Object.defineProperty(obj, prop, descriptor)`：将一个属性添加到对象或修改现有属性的特性。
4. `Object.defineProperties(obj, props)`：将多个属性添加到对象或修改现有属性的特性。
5. `Object.entries(obj)`：返回一个给定对象自身可枚举属性的键值对数组。
6. `Object.freeze(obj)`：冻结一个对象，使其不可修改，包括属性和原型。
7. `Object.fromEntries(iterable)`：将一个键值对数组转换为一个对象。
8. `Object.getOwnPropertyDescriptor(obj, prop)`：返回指定对象上一个自有属性对应的属性描述符。
9. `Object.getOwnPropertyDescriptors(obj)`：返回指定对象上所有自有属性对应的属性描述符。
10. `Object.getOwnPropertyNames(obj)`：返回一个数组，包含指定对象所有自有属性的名称。
11. `Object.getOwnPropertySymbols(obj)`：返回一个数组，包含指定对象所有自有 Symbol 类型属性的 Symbol 值。
12. `Object.getPrototypeOf(obj)`：返回指定对象的原型。
13. `Object.is(value1, value2)`：比较两个值是否相等，与 `===` 运算符不同，`Object.is()` 方法认为 `NaN` 和 `-0` 是不同的。
14. `Object.keys(obj)`：返回一个数组，包含指定对象所有自有可枚举属性的名称。
15. `Object.preventExtensions(obj)`：阻止一个对象扩展，使其不能添加新属性。
16. `Object.seal(obj)`：封闭一个对象，使其不能添加新属性，同时将所有现有属性设置为不可配置。
17. `Object.setPrototypeOf(obj, proto)`：设置一个对象的原型为另一个对象或 `null`。
18. `Object.values(obj)`：返回一个数组，包含指定对象所有自有可枚举属性的值。
19. `Object.isExtensible()` 方法判断一个对象是否是可扩展的（是否可以在它上面添加新的属性），返回值：表示给定对象是否可扩展的一个 Boolean。
