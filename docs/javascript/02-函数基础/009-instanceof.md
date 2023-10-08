# instanceof

instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

它的语法是 `object instanceof constructor`，其中 object 是要检查的对象，constructor 是要检查的构造函
数。instanceof 运算符返回一个布尔值。

```js
function Car(make, model) {
  this.make = make;
  this.model = model;
}

var myCar = new Car('Toyota', 'Corolla');

console.log(myCar instanceof Car); // 输出 true，因为 myCar 是 Car 的实例
console.log(myCar instanceof Object); // 输出 true，因为所有对象都是 Object 的实例
```

## instanceof 和 typeof 的区别

- typeof 是一个操作符，用于检查一个变量的数据类型。它返回一个表示变量类型的字符串。typeof 对于大多数
  基本数据类型（如字符串、数字、布尔值）和函数是有效的，但它在处理复杂数据类型（如数组、对象和
  null）时有限制。

主要区别：

- `typeof` 用于检查数据类型，而 `instanceof` 用于检查对象的继承关系。
- `typeof` 返回表示数据类型的字符串，而 `instanceof` 返回一个布尔值。
- `typeof` 对于大多数基本数据类型和函数都有效，但在处理复杂数据类型时（如数组、对象等）的结果可能不
  如预期。
- `instanceof` 主要用于检查对象的实例关系，通常在面向对象编程中使用。
