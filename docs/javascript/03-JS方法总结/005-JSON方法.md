# JSON.stringify

```js
/*
 * JSON.stringify(value[, replacer [, space]])
 * value：json对象/数组
 * replacer：
 * ① 函数：在序列化过程中，被序列化的值每个属性都会经过该函数的转换和处理
 * ② 如果该参数时一个数组，则只有包含这个数组中的属性名才会被序列，化到最终的json字符串中
 *
 * space：指定缩进用的空白字符串
 * 如果参数是个数字，它代表有多少的空格；上限为10。该值若小于1，则意味着没有空格
 * 如果该参数为字符串(字符串的前十个字母)，该字符串将被作为空格
 * 如果该参数没有提供（或者为null）将没有空格
 */
var obj = {
  name: 'Janny',
  age: 23,
  stars: ['Joe', 'Rose'],
  friends: {
    name: 'zjj',
    age: 29,
    stars: ['Janny', 'jshsd']
  }
};
// 注意，它是一个递归调用的过程
var c = JSON.stringify(
  obj,
  (key, value) => {
    console.log('key', key);
    console.log('value', value);
    return typeof value === 'string' ? value.toUpperCase() : value;
  },
  ''
);
console.log('c', c);
```

# JSON.parse

```js
/*
 * JSON.parse(text[, reviver]) 返回值：Object类型, 对应给定JSON文本
 * text: 要被解析成JavaScript值的字符串
 * reviver: 转换器, 如果传入该参数(函数)，可以用来修改解析生成的原始值，调用时机在parse函数返回之前。
 */
const a = JSON.parse('{"p": 5}', function (k, v) {
  if (k === '') return v; // 如果到了最顶层，则直接返回属性值，
  return v * 2; // 否则将属性值变为原来的 2 倍。
}); // { p: 10 }

const b = JSON.parse(
  '{"name":"JANNY","age":23,"stars":["HHH","EEE"],"friends":{"name1":"ZJJ","age1":29,"stars1":["JANNY","JSHSD"]}}',
  function (k, v) {
    console.log(k, v);
    return v;
  }
);
console.log(b);
```
