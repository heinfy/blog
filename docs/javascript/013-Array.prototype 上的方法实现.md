# ES5 Array.prototype 上的方法实现

## Array.prototype.push

该方法向数组尾部添加元素，返回值为数组的长度，并且原数组会发生变化（栈方法-后进先出）

```js
Array.prototype._push = function (...rest) {
  for (let index = 0; index < rest.length; index++) {
    const element = rest[index];
    this[this.length] = element;
  }
  return this.length;
};
```

## Array.prototype.pop

该方法删除数组尾部元素，返回值删除的元素，并且原数组会发生变化（栈方法-后进先出）

```js
Array.prototype._pop = function () {
  const element = this[this.length - 1];
  this.length = this.length - 1;
  return element;
};
```

## Array.prototype.unshift

该方法向数组开头添加元素，返回值为数组的长度，并且原数组会发生变化（队列方法-后进先出）

```js
Array.prototype._unshift = function (...rest) {
  let allLen = this.length + rest.length;
  for (let index = allLen - 1; index >= 0; index--) {
    if (index > rest.length - 1) {
      this[index] = this[index - rest.length];
    } else {
      this[index] = rest[index];
    }
  }
  return this.length;
};
```

## Array.prototype.shift

删除并返回数组的第一个元素，并且原数组会发生变化（队列方法-后进先出）

```js
Array.prototype._shift = function () {
  const element = this[0];
  for (let index = 0; index < this.length - 1; index++) {
    this[index] = this[index + 1];
  }
  this.length = this.length - 1;
  return element;
};
```

## Array.prototype.reverse

颠倒数组中元素的顺序。返回颠倒后的数组 【原数组会发生变化】-后进先出）

```js
Array.prototype._reserve = function () {
  const len = this.length - 1;
  const half = Math.floor(this.length / 2);
  for (let index = 0; index < half; index++) {
    let temp = this[index];
    this[index] = this[len - index];
    this[len - index] = temp;
    temp = null;
  }
  return this;
};
```

## Array.prototype.sort

- 默认排序顺序是根据字符串 Unicode 编码

```js
let arr = [8, 6, 7, 9, 1, -1, 4];
let sortDesc = function (x, y) {
  return y - x;
};
// 默认升序排列
Array.prototype._sort = function (fn = (x, y) => x - y) {
  for (let i = 0; i < this.length; i++) {
    for (let j = i; j < this.length; j++) {
      if (fn(this[i], this[j]) > 0) {
        let t = this[i];
        this[i] = this[j];
        this[j] = t;
      }
    }
  }
  return this;
};
console.log(arr._sort(sortDesc));
```

## Array.prototype.cancat

返回新的数组

```js
Array.prototype._cancat = function (...rest) {
  let newArr = [];
  for (let index = 0; index < this.length; index++) {
    const element = this[index];
    newArr.push(this[index]);
  }
  for (let index = 0; index < rest.length; index++) {
    const element = rest[index];
    console.log(element);
    newArr.push(rest[index]);
  }
  return newArr;
};
```

## Array.prototype.slice

从已有的数组中返回选定的元素。【截取后，不会改变原数组，而是返回新的数组】

```js
Array.prototype._cancat = function (...rest) {
  let newArr = [];
  for (let index = 0; index < this.length; index++) {
    const element = this[index];
    newArr.push(this[index]);
  }
  for (let index = 0; index < rest.length; index++) {
    const element = rest[index];
    console.log(element);
    newArr.push(rest[index]);
  }
  return newArr;
};
```

## Array.prototype.splice

向/从数组中添加/替换项目，然后返回被替换出来的项目。【原数组会发生变化】

```js
// 待续
Array.prototype._splice = function (idx, len, ...rest) {};
```
