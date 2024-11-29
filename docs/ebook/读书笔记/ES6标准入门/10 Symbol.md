## 概述

​	为了减少对象的属性名冲突，ES6引入新的原始数据类型Symbol，JS的第七种数据类型。

```javascript
let s = Symbol()
console.log(s) // Symbol()

```

- Symbol函数前不使用new命令，因为生成的Symbol是一个原始类型的值，不是对象，那么，也就不能添加属性（类似于字符串的数据类型）
- Symbol函数乐意接受一个字符串作为参数，表示Symbol实例的描述，主要是为了在控制台显示，或者转化为字符串为了区分（注意，相同参数返回值是不相同的！）

```javascript
let s1 = Symbol('s1')
let s2 = Symbol('s2')
let s3 = Symbol('s2')
console.log(s1,s2) // Symbol(s1) Symbol(s2)
console.log(s1.toString(),s2.toString()) // Symbol(s1) Symbol(s2)
console.log(s2 == s3) // false
console.log(s2 === s3) // false

```



## 作为属性名的Symbol

​	Symbol值可以作为标识符用于对象的属性名，保证不会出现同名的属性。这对于一个对象有多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。

```javascript
let mySymbol = Symbol()
/** 第一种写法 */
let a1 = {}
a1[mySymbol] = 'holle！'
/**第二种写法 */
let a2 = {
  [mySymbol]: 'holle!'
}
/**第三种写法 */
let a3 = {}
Object.defineProperty(a3, mySymbol, { value: 'holle!'})

console.log(a1[mySymbol]) // holle！
console.log(a2[mySymbol]) // holle！
console.log(a3[mySymbol]) // holle！
```



**注意：Symbol值作为对象的属性名不能使用点运算符，点后面是字符串，不是Symbol类型！同理。在对象的内部，使用Symbol值定义属性时，Symbol值必须放在方括号中**



## Symbol定义常量

​	常量使用Symbol值的最大的好处就是，其他任何值都不可能有相同的值了。

```javascript
let log = {}
log.levels = {
  DEBUG: Symbol('debug'),
  INFO: Symbol('info'),
  WARN: Symbol('warn')
}

console.log(log.levels.DEBUG, log.levels.INFO) // Symbol(debug) Symbol(info)
```



## 消除魔术字符串

魔术字符串是指，在代码中多次出现、与代码形成强耦合的某一个具体字符串或数值。风格良好的代码，应该尽量消除魔术字符串，而又含义清晰的变量代替。

```javascript
/* 字符串Triangle就是一个魔术字符串。它多次出现，与代码形成“强耦合”，不利于将来的修改和维护。 */
function getArea(shape, options) {
  let area = 0;
  switch (shape) {
    case 'Triangle': // 魔术字符串
      area = .5 * options.width * options.height;
      break; /* ... more code ... */
  }
  return area;
}

getArea('Triangle', {
  width: 100,
  height: 100
}); // 魔术字符串

```



常用的消除魔术字符串的方法，就是把它写成一个变量。

```javascript
const shapeType = {
  triangle: 'Triangle'
};

function getArea(shape, options) {
  let area = 0;
  switch (shape) {
    case shapeType.triangle:
      area = .5 * options.width * options.height;
      break;
  }
  return area;
}

getArea(shapeType.triangle, {
  width: 100,
  height: 100
});

```



我们把Triangle写成shapeType对象的triangle属性，这样就消除了强耦合。

可以发现shapeType.triangle等于哪个值并不重要，只要确保不会跟其他shapeType属性的值冲突即可。

```javascript
const shapeType = {
  triangle: Symbol()
};
```



