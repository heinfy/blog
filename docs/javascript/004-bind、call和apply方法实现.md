# bind、call 和 apply 方法实现

```js
var obj = { name: '石榴' };
var type = '水果';

function sayHi(type) {
  console.log(`这是${type}——${this.name}`);
}
```

## bind

```js
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
```

## call

```js
Function.prototype._call = function (context, ...rest) {
  let ctx = context || window;
  let symbol = Symbol('__call__');
  ctx[symbol] = this;
  let res = ctx[symbol](...rest);
  delete ctx[symbol];
  return res;
};

sayHi._call(obj, type);
```

## apply

```js
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
