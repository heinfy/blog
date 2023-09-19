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
