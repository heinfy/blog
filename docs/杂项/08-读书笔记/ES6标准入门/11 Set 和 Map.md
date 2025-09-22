## Set 

### 基本用法

Set类似于数组，但是成员的值都是唯一的，没有重复的值。

Set 本身是一个构造函数，用来生成 Set 数据结构。

```javascript
  const s = new Set()
  console.log(typeof s) // object
  // 通过add方法向 Set 结构加入成员，结果表明 Set 结构不会添加重复的值。
  [2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x))
  console.log(s) // Set { 2, 3, 5, 4 }
  console.log(...s) // 2, 3, 5, 4
  for (let i of s) { // for ... of ... 遍历set
    console.log(i)
  } // 2 3 5 4
```

#### `Set()` 的参数

```javascript
// 1 数接受数组作为参数
const set = new Set([1, 2, 3, 4, 4])
console.log([...set]); // [1, 2, 3, 4] 

// 2 数接受数组作为参数
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5])
console.log(items.size); // 5

// 3 是接受类似数组的对象作为参数
function divs () {
  return [...document.querySelectorAll('div')]
}

const set = new Set(divs())
console.log(set.size); // 5

// 类似于
divs().forEach(div => set.add(div))
set.size // 5
```


```javascript
// 数组去重简单方法：
[...new Set(array)]
Array.from(new Set(array))

// 字符串去重
[...new Set('ababbc')].join('')
```

**向 Set 加入值的时候，不会发生类型转换(NaN等于自身)**

### Set 实例的属性和方法

**Set 结构的实例有以下属性：**

Set.prototype.constructor：构造函数，默认就是Set函数。

Set.prototype.size：返回Set实例的成员总数。

**Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。**

**操作方法**

add(value)：添加某个值，返回 Set 结构本身。

delete(value)：删除某个值，返回一个布尔值，表示删除是否成功

has(value)：返回一个布尔值，表示该值是否为Set的成员

clear()：清除所有成员，没有返回值

**Array.from方法可以将 Set 结构转为数组。**

```javascript

const array = Array.from(new Set([1, 2, 3, 4, 5])) // 也是一个数组去重的好方法

```

**遍历成员**

keys()：返回键名的遍历器

values()：返回键值的遍历器

entries()：返回键值对的遍历器

forEach()：使用回调函数遍历每个成员

```js
let set = new Set(['1', '2', '3'])
 
// keys 和 values() 返回值相同， entries返回每一个数组的键名和键值都是键值
for (let item of set.keys()) { console.log(item) }
for (let item of set.values()) { console.log(item) }
for (let item of set.entries()) { console.log(item) }

set = new Set([1, 4, 9])

set.forEach((value, key) => {
  console.log(key + ' : ' + value)
})

// forEach方法的参数就是一个处理函数。该函数的参数与数组的forEach一致，依次为键值、键名、集合本身（上例省略了该参数）。
// 这里需要注意，Set 结构的键名就是键值（两者是同一个值），因此第一个参数与第二个参数的值永远都是一样的。

```

Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法。

这是因为`Set.prototype[Symbol.iterator] === Set.prototype.values`，这意味着，可以省略values方法，直接用for...of循环遍历 Set。

```js
let set = new Set(['red', 'green', 'blue']);

for (let x of set) {
  console.log(x);
}
```

**遍历的应用**

- 扩展运算符（...）内部使用for...of循环，所以也可以用于 Set 结构。
- 数组的map和filter方法也可以用于 Set 

```js
let set = new Set([1, 2, 3])

set = new Set([...set].map(x => x * 2))

// 返回Set结构：{2, 4, 6} 
 
let set = new Set([1, 2, 3, 4, 5])

set = new Set([...set].filter(x => (x % 2) == 0))

// 返回Set结构：{2, 4}
```

- **使用 Set 实现并集（Union）、交集（Intersect）和差集（Difference）。**

```js
let a = new Set([1, 2, 3])
let b = new Set([4, 3, 2])

// 并集
let union = new Set([...a, ...b]); // Set {1, 2, 3, 4} 
 
// 交集
let intersect = new Set([...a].filter(x => b.has(x))); // set {2, 3} 
 
// 差集
let difference = new Set([...a].filter(x => !b.has(x))); // Set {1}
```

**想在遍历操作中，同步改变原来的 Set 结构：**

```js
// 方法一 
let set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2)); // set的值是2, 4, 6 
 
// 方法二 
let set = new Set([1, 2, 3]); 
set = new Set(Array.from(set, val => val * 2)); // set的值是2, 4, 6
```

## Map 

### 含义和基本用法

JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。

为了解决这个问题，ES6 提供了 Map 数据结构，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值 对”的数据结构，Map 比 Object 更合适。

```js
// 使用对象作为键
const m = new Map();
const o = {
  p: 'Hello World'
};

m.set(o, 'holle world!')
m.get(o) // "holle world!" 

m.has(o) // true 
m.delete(o) // true 
m.has(o) // false
```
**Map 也可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组。**

```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2 
map.has('name') // true 
map.get('name') // "张三" 
map.has('title') // true 
map.get('title') // "Author"

// Map构造函数接受数组作为参数，实际上执行的是下面的算法。
const items = [
  ['name', '张三'],
  ['title', 'Author']
];

const map = new Map();

items.forEach(([key, value]) => map.set(key, value));
```
**如果对同一个键多次赋值，后面的值将覆盖前面的值。**

**如果读取一个未知的键，则返回undefined。**

**只有对同一个对象的引用，Map 结构才将其视为同一个键。**

```js
const map = new Map(); 
 
map.set(['a'], 555);

map.get(['a']) // undefined

// ，表面是针对同一个键，但实际上这是两个值，内存地址是不一样的
```
*Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。*

如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），

则只要两个值严格相等，Map 将其视为一个键，

比如0和-0就是一个键，布尔值true 和字符串true则是两个不同的键。

另外，undefined和null也是两个不同的键。

虽然NaN不严格相等于自身，但 Map 将其视为同一个键。

### 实例的属性和操作方法

**1 size 属性**
```js
const map = new Map();

map.set('foo', true);

map.set('bar', false);

map.size // 2
```

**set(key, value)**

set方法设置键名key对应的键值为value，然后返回整个 Map 结构。如果key已经有值，则键值会被更新，否则就新生成该键。

```js
const m = new Map(); 
 
m.set('edition', 6)        // 键是字符串

m.set(262, 'standard')     // 键是数值 

m.set(undefined, 'nah')    // 键是 undefined 

```

**get(key)**

get方法读取key对应的键值，如果找不到key，返回undefined。

**has(key)**

has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。

**delete(key)**

delete方法删除某个键，返回true。如果删除失败，返回false。

**clear()**

clear方法清除所有成员，没有返回值。

### 遍历方法

keys()：返回键名的遍历器。 
values()：返回键值的遍历器。 
entries()：返回所有成员的遍历器。 
forEach()：遍历 Map 的所有成员

```js
const map = new Map([
  ['F', 'no'],
  ['T',  'yes'],
]);

for (let item of map.entries()) {
  console.log(item[0], item[1]);
} // "F" "no" // "T" "yes" 
 
// 等同于
for (let [key, value] of map.entries()) {
  console.log(key, value); 
} // "F" "no" // "T" "yes" 
 
// 等同于使用map.entries() 
// map[Symbol.iterator] === map.entries  =>  true
for (let [key, value] of map) {
  console.log(key, value);
} // "F" "no" // "T" "yes" 
```

**Map 结构转为数组结构，比较快速的方法是使用扩展运算符（...）。**

```js
const map = new Map([   [1, 'one'],   [2, 'two'],   [3, 'three'], ]); 
 
[...map.keys()] // [1, 2, 3] 
 
[...map.values()] // ['one', 'two', 'three'] 
 
[...map.entries()] // [[1,'one'], [2, 'two'], [3, 'three']] 
 
[...map] // [[1,'one'], [2, 'two'], [3, 'three']] 
```

**结合数组的map方法、filter方法，可以实现 Map 的遍历和过滤（Map 本身没有map和filter方法）。**

```js
const map0 = new Map().set(1, 'a').set(2, 'b').set(3, 'c'); 
 
const map1 = new Map([...map0].filter(([k, v]) => k < 3) );
// 产生 Map 结构 {1 => 'a', 2 => 'b'}

const map2 = new Map([...map0].map(([k, v]) => [k * 2, '_' + v]));
// 产生 Map 结构 {2 => '_a', 4 => '_b', 6 => '_c'}
```

**此外，Map 还有一个forEach方法，与数组的forEach方法类似，也可以实现遍历。**
```js
map.forEach(function(value, key, map) {
  console.log("Key: %s, Value: %s", key, value);
}); 
```
forEach方法还可以接受第二个参数，用来绑定this。
```js
const reporter = {
  report: function(key, value) {
    console.log("Key: %s, Value: %s", key, value);
  }
}; 
 
map.forEach(function(value, key, map) {
  this.report(key, value); 
  }, reporter);
```
上面代码中，forEach方法的回调函数的this，就指向reporter。

### 与其他数据结构的互相转换

（1）Map 转为数组

```js
const myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);

[...myMap] // [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
```

（2）数组 转为 Map

```js
new Map([ [true, 7], [{foo: 3}, ['abc']] ])
// Map { true => 7, Object {foo: 3} => ['abc']  } 
```

（3）Map 转为对象

```js
// 如果所有 Map 的键都是字符串，它可以转为对象。
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
} 
 
const myMap = new Map().set('yes', true).set('no', false);

strMapToObj(myMap) // { yes: true, no: false }
```

（4）对象转为 Map
```js
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
} 
 
objToStrMap({yes: true, no: false})

// Map {"yes" => true, "no" => false} 
```

（5）Map 转为 JSON
Map 转为 JSON 要区分两种情况。一种情况是，Map 的键名都是字符串，这时可以选择转为对象 JSON。

```js
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}

let myMap = new Map().set('yes', true).set('no', false);

strMapToJson(myMap) // '{"yes":true,"no":false}'
```

另一种情况是，Map 的键名有非字符串，这时可以选择转为数组 JSON。
```js
function mapToArrayJson(map) {
  return JSON.stringify([...map]);
} 
 
let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);

mapToArrayJson(myMap) // '[[true,7],[{"foo":3},["abc"]]]'
```

（6）JSON 转为 Map
JSON 转为 Map，正常情况下，所有键名都是字符串。

```js
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
} 
 
jsonToStrMap('{"yes": true, "no": false}')

// Map {'yes' => true, 'no' => false}

```
但是，有一种特殊情况，整个 JSON 就是一个数组，且每个数组成员本身，又是一个有两个成员的数组。这时，它可以一一对应地转为 Map。这往往是数 组转为 JSON 的逆操作。

```js
function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
} 
 
jsonToMap('[[true,7],[{"foo":3},["abc"]]]')

// Map {true => 7, Object {foo: 3} => ['abc']}
```
