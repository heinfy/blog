# 函数中的 this 指向

## 构造函数中的 this 指向

```javascript
function Foo() {
  console.log(this); // Foo
  console.log(Foo); // Foo
  console.log(Foo === this); // false
}
let a = new Foo();
console.log(a);
```

- **在构造函数（new）中，this 指向构造函数返回的实例对象， Foo 还是指向原构造函数。**

## 普通函数中的 this 指向

```javascript
function bar() {
  console.log(this); // window
  console.log(bar); // bar
  console.log(bar === this); // false
}
bar();
```

- **在普通函数中，函数内的 this 指向函数调用的作用域， bar 仍然指向普通函数。**

## 箭头函数中的 this 指向

```javascript
var name = '字符串';
var obj = {
  name: '对象',
  sayHi: () => {
    console.log(`这是一个${this.name}`);
  }
};
let sayHi = () => {
  console.log(`这是一个${this.name}`);
};
obj.sayHi(); // 这是一个字符串
sayHi.apply(obj); // 这是一个字符串
```

**箭头函数的`this`在编译时就确定的，它捕获其所在上下文的`this`的值，而不是在运行时绑定的。这就意味着
箭头函数的`this`永远指向它所在外层作用域的`this`，无论如何调用它，`this`都不会改变**

## this 指向

```javascript
function Foo() {
  try {
    console.log(this); // Foo 实例
    this.a(); // 外部2
  } catch (error) {
    console.log(error);
  }
  Foo.a = function () {
    console.log('内部2');
  };
  Foo.prototype.a = function () {
    console.log('内部3');
  };
  return Foo;
}

Foo.a = function () {
  console.log('外部1');
};

Foo.prototype.a = function () {
  console.log('外部2');
};

Foo.a(); // 外部1
var obj = new Foo();
obj.a(); // 内部2
Foo.a(); // 内部2
```
