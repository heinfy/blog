# Set 和 Map

## Set

Set 本身是一个构造函数，用来生成 Set 数据结构。Set 数据结构类似于数组，但是成员的值都是唯一的，没有重复的值。

```js
const s = new Set();

console.log(typeof s); // object

// 通过add方法向 Set 结构加入成员
[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

console.log(s); // Set { 2, 3, 5, 4 }

for (let i of s) {
  console.log(i);
}
```

### 参数

```js
// 接受数组作为参数
const set = new Set([1, 2, 3, 4, 4]);
console.log(set); // [1, 2, 3, 4]
console.log(set.size); // 4

// 接受类似数组的对象作为参数
const set1 = new Set(...document.querySelectorAll('div'));

// 数组去重简单方法：
Array.from(new Set(set));
let arr = [...new Set(set)];
```

### Set 的方法

- `add(value)`：添加某个值，返回 Set 结构本身。

- `delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功

- `has(value)`：返回一个布尔值，表示该值是否为 Set 的成员

- `clear()`：清除所有成员，没有返回值

使用 Set 实现并集（Union）、交集（Intersect）和差集（Difference）:

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]); // Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x))); // set {2, 3}

// 差集
let difference = new Set([...a].filter(x => !b.has(x))); // Set {1}
```

## WeakSet

WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。

1. WeakSet 的成员只能是对象和 Symbol 值，而不能是其他类型的值。
2. WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

WeakSet 结构有以下三个方法。

- WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员，返回 WeakSet 结构本身。
- WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员，清除成功返回 true，如果在 WeakSet 中找不到该成员或该成员不是对象，返回 false。
- WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。

## Map

ES6 提供了 Map 数据结构，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。

```js
// 使用对象作为键
const m = new Map();
const o = {
  p: 'Hello World'
};

m.set(o, 'holle world!');
m.get(o); // "holle world!"

m.has(o);
m.delete(o);
m.has(o);
```

Map 也可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组。

```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size; // 2
map.has('name'); // true
map.get('name'); // "张三"
map.has('title'); // true
map.get('title'); // "Author"
```

### Map 的方法

- `map.size`
- `map.set(key, value)`
- `map.get(key)`： 读取 key 对应的键值，如果找不到 key，返回 undefined
- `map.has(key)`： 返回一个布尔值，表示某个键是否在当前 Map 对象之中
- `map.delete(key)`： 删除某个键，返回 true，如果删除失败，返回 false
- `map.clear()`： clear 方法清除所有成员，没有返回值

## WeakMap

WeakMap 结构与 Map 结构类似，也是用于生成键值对的集合。

WeakMap 与 Map 的区别有两点。

首先，WeakMap 只接受对象（null 除外）和 Symbol 值作为键名，不接受其他类型的值作为键名。其次，WeakMap 的键名所指向的对象，不计入垃圾回收机制。
