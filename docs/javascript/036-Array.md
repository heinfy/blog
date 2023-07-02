### Array

#### ES5

- 检测数组

```js
let arr = [1, 2, 3, 4];
Array.isArray(arr);
arr instanceof Array;
```

- 转换方法

```js
arr.toLocaleString();
arr.toString();
arr.valueOf();
```

- 栈方法（后进先出）

```js
arr.push(item1,item2,....,itemx); // 添加元素，返回值为数组的长度，并且原数组会发生变化
arr.pop(item1,item2,....,itemx);  // 删除并返回数组的最后一个元素，原数组会发生变化
```

- 队列方法（先进先出）

```js
arr.unshift(newelement1,newelement2,....,newelementX); // 向数组的开头添加一个或更多元素，并返回新的长度。【原数组会发生变化】
arr.shift(); // 删除并返回数组的第一个元素 【原数组会发生变化】
```

- 反转和排序

```js
// 颠倒数组中元素的顺序。返回颠倒后的数组 【原数组会发生变化】
arr.reverse();

// 对数组的元素进行排序
arr.sort(); // 默认排序顺序是根据字符串 Unicode 编码

arr.sort(function (a, b) {
  return a - b; // 升序（从小到大）
});
arr.sort(function (a, b) {
  return b - a; // 降序（从大到小）
});
```

- 操作方法

```js
// 数组拼接
arr.concat(arr01,arr02,...) // 返回新的数组

// 数组拼接
arr.join(separator);

// 从已有的数组中返回选定的元素。【截取后，不会改变原数组，而是返回新的数组】
arr.slice(start,end); // 只有 start，将会截取到数组末尾
// 如果 start 的值为负数，假如数组长度为 length，则表示从 length+start 的位置开始复制，
// 此时参数 end 如果有值，只能是比 start 大的负数，否则将返回空数组。
[1,2,3].slice(-1); // [3]

// 向/从数组中添加/替换项目，然后返回被替换出来的项目。【原数组会发生变化】
arr.splice(index, howmany, item1, ..., itemX)
// 参数：
// index 从哪个索引位置开始删 数字
// howmany 替换几个 数字
// item1,.....,itemX 替换的数据（可以是多个） 可选
```

- 位置方法

```js
// 返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1
数组名.indexOf(searchElement);
// 返回指定元素在数组中的最后一个的索引，如果不存在则返回 -1。从数组的后面向前查找
数组名.lastIndexOf(searchElement);
```

#### ES6

```js
// 数组遍历
array.forEach(function (value, index, currentArray) {});

// 过滤出符合筛选条件的元素，返回一个新的数组
array.filter(function (value, index, currentArray) {
  return 条件;
});

// 验证数组中的每一个元素是否都符合指定的条件,返回布尔值
array.every(function (value, index, currentArray) {
  return 条件;
});

// 验证数组中的元素，是否有符合指定条件的，返回布尔值
array.some(function (value, index, currentArray) {
  return 条件;
});

// 遍历数组中的每一个元素，更改后存入一个新的数组中，返回一个新的数组
array.map(function (value, index, currentArray) {
  return 操作;
});
```

扩展运算符 `...`

`copyWithin()` 复制数组项

```js
// 数组实例的copyWithin()方法会在当前数组内部将指定位置的成员复制到其他位置（会覆盖原成员）,返回新数组
// Array.prototype.copyWithin(target, start = 0, end = this.length)
// target 可选，从该位置替换数据
// start 可选，从该位置读取数据，默认是0
// end 可选，到该位置前停止读取数据，默认等于数组长度。如果是负值，表示倒数
```

`find() 和 findIndex()`

```js
// .find() 找出第一个符合条件的数组成员，参数是一个回调函数
// 所有数组成员一次执行该回调函数，直到找到第一个返回为true的成员，然后返回该成员
// 如果么有符合从条件的成员，则返回undefined。 findIndex() 返回 索引
```

- `fill()` 给定值填充到一个数组中，返回值为新数组
- `entries() keys() values()` -- 用于遍历数组
- `includes()` 方法返回的是一个布尔值，表示数组是否包含给定的值
- `Array.from()` 将类数组对象转化为真正的数组
- `Array.of()` 将一组值转化为数组

##### Array.reduce

```js
Array.reduce(callback(previousValue, currentValue, index, array)[, initialValue])
```

- `callback[previousValue]` - 上一次调用回调返回的值，或者是提供的初始值（initialValue）
- `callback[currentValue]` - 数组中当前被处理的元素
- `callback[index]` - 当前元素在数组中的索引
- `callback[array]` - 调用 reduce 的数组
- `initialValue` - 初始值

```js
// 计算数组中每个元素出现的次数
array.reduce((pre, cur) => (pre[cur] ? pre[cur]++ : (pre[cur] = 1), pre), {});

// 数组去重
array.reduce((pre, cur) => (pre.includes(cur) ? pre : [...pre, cur]), []);

// 将二维数组转化为一维
array.reduce((pre, cur) => [...pre, ...cur], []);

// 将多维数组转化为一维
arr.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? newArr(cur) : cur), []);

// 对象里的属性求和
arr.reduce((prev, cur) => cur.score + prev, 0);
```

#### 数组的空位

空位不是`undefined`

```js
console.log(Array(3)); // [empty × 3]
```

- `forEach()`、`filter()`、`every()` 和 `some()` 都会跳过空位
- `map()` 会跳过空位，但是会保留这个值
- `join()` 和 `toString()` 会将空位视为 `undefined`
- 而 `undefined` 和 `null` 会被处理成空字符串
- `ES6` 明确将空位转化为 `undefined`
