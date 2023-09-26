# bind、call 和 apply 方法实现

```js
var obj = { name: '石榴' };
var type = '水果';
```

## bind

```js
Function.prototype.myBind = function (context, ...rest) {
  context = context || window;
  let args = rest;
  let symbol = Symbol('__call__');
  context[symbol] = this;
  return function () {
    return context[symbol](...rest);
  };
};
function sayHi(type) {
  console.log(`这是${type}——${this.name}`);
}
let fn = sayHi.myBind(obj, type);
fn();
```

## call

```js
Function.prototype.myCall = function (context, ...rest) {
  context = context || window;
  let args = rest;
  let symbol = Symbol('__call__');
  context[symbol] = this;
  let result = context[symbol](...rest);
  delete context[symbol];
  return result;
};
function sayHi(type) {
  console.log(`这是${type}——${this.name}`);
}
sayHi.myCall(obj, type);
```

## apply

```js
Function.prototype.myApply = function (context, ...rest) {
  context = context || window;
  let args = rest;
  let symbol = Symbol('__apply__');
  context[symbol] = this;
  let result = context[symbol](...rest);
  delete context[symbol];
  return result;
};
function sayHi(type) {
  console.log(`这是${type}——${this.name}`);
}
sayHi.myApply(obj, type);
```
