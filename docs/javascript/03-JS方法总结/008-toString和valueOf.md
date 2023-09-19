# toString 和 valueOf

## 转换规则

### toString

`toString()` 作用是返回 `object` 的字符串表示，`JavaScript` 中 `object` 默认的 `toString()` 方法返回
字符串 `[object Object]`。

注意，基本数据类的 toString() 方法，是由基本包装类型提供。

| 对象     | 返回值                                                                        |
| -------- | ----------------------------------------------------------------------------- |
| Array    | 以逗号分割的字符串，如`[1,2]`的`toString`返回值为`1,2`，跳过`null，undefined` |
| Boolean  | `True`                                                                        |
| Date     | 可读的时间字符串，如 `Tue Oct 15 2019 12:20:56 GMT+0800 (中国标准时间)`       |
| Function | 声明函数的`js`源代码字符串                                                    |
| Number   | 数字值                                                                        |
| Object   | `[object Object]`                                                             |
| String   | 字符串                                                                        |

### valueOf

`valueOf()`函数的作用是返回该`object`自身。

| 对象     | valueOf 返回值       |
| -------- | -------------------- |
| Array    | 数组本身             |
| Boolean  | 布尔值               |
| Date     | 返回毫秒形式的时间戳 |
| Function | 函数本身             |
| Number   | 数字值               |
| Object   | 对象本身             |
| String   | 字符串值             |

1. 对象转换为布尔值：`直接转换为true（包装类型也一样），不调用valueOf和toString`
2. 对象转换为数字：对象转换为数字会依次调用`valueOf`和`toString`方法： 1. 如果对象具有`valueOf`方法
   且返回原始值(`string、number、boolean、undefined、null`)，则将该原始值转换为数字(转换失败会返
   回`NaN`)，并返回这个数字 2. 如果对象具有`toString`方法且返回原始值
   (`string、number、boolean、undefined、null`)，则将该原始值转换为数字(转换失败会返回`NaN`)，并返回
   这个数字 3. 转换失败，抛出`TypeError`

3. 对象转换为字符串：调用`toString`方法

## number 相关

将非 number 类型的值转换为 number 类型

- 一种是隐式转换,如进行`(\*、/)`操作时,会自动其余类型的值转为 number 类型
- 一种是显示转换-调用`Number()、parseInt()、parseFloat()`方法转换
- `Number()`：
- 如果是`boolean`值，`true`和`false`将分别被替换为 1 和 0
- 如果是数字值，只是简单的传入和返回
- 如果是`null`值，返回 0
- 如果是`undefined`，返回`NaN`
- 如果是字符串，遵循下列规则：

  - 如果字符串中只包含数字，则将其转换为十进制数值，即”1“会变成 1，”123“会变成 123，而”011“会变成
    11（前导的 0 被忽略）
  - 如果字符串中包含有效的浮点格式，如”1.1“，则将其转换为对应的浮点数（同样，也会忽略前导 0）
  - 如果字符串中包含有效的十六进制格式，例如”0xf“，则将其转换为相同大小的十进制整数值
  - 如果字符串是空的，则将其转换为 0
  - 如果字符串中包含除了上述格式之外的字符，则将其转换为`NaN`

- 如果是对象，则调用对象的`valueOf()`方法，再调用对象的`toString()`方法，然后再依次按照前面的规则转
  换返回的字符串值。

`parseInt(value,radius)`第一个参数是需要转换的值，第二个参数是转换进制；

`parseFloat()`转换规则基本与`parseInt()`一致，只有如下不同点

- `parseFloat()`遇到浮动数据时，浮点有效(但是只有第一个.有效)，如"10.1"会被转为 10.1；'10.1.1'会被转
  为 10.1
- `parseFloat()`只会默认处理为 10 进制，而且会忽略字符串前面的 0，所以不会有在默认情况下转为 8 进制
  的情

## 对象 String()转换字符串

```js
/* 1.先调用对象的toString方法
2.判断该方法的返回值是否为基础数据类型（Number，String，Boolean，Undefined，ull）
3.若返回值为基础数据类型，则转换规则按照相应数据类型的转换规则对其进行转换
4.若返回值不为基础数据类型，则在该返回值的基础上继续调用valueOf方法
5.判断valueOf的返回值是否为基础数据类型
6.判断是否为基础数据类型，若是基础数据类型则进行操作3
7.若仍旧不为基础数据类型则报错 */

let b = { name: 'houfee' };
console.log(String(b)); // [object Object]
let c = [];
console.log(String(c)); // 空字符串
let d = {};
console.log(String(d)); // [object Object]
```

`String`与`Number`的区别则在于

- `Number`是先调用`valueOf()`再调用`toString ()`
- 而`String`是先调用`toString()`再调用`valueOf()`

`Number()`先转换为原始类型，再转化为字符串形式

`String()`先转换为字符串形式，再转化为原始类型

## 面试题

```js
console.log(Number({})); // NaN、
console.log(String({})); // [object Object]
console.log(Boolean({})); // true

console.log(Number([])); // 0
console.log(String([])); // 空字符串
console.log(Boolean([])); // true

console.log({} + {}); // [object Object][object Object]
console.log({} + []); // [object Object]
console.log([] + {}); // [object Object]
console.log([] + []); // 空字符串
```
