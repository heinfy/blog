# string

- `str.toString('进制')`
- `str.charAt(index)` 或 `str[index]`：返回索引对应的字符
- `str.concat(str1,str2,str3...)`
- `str.indexOf()` 或 `str.lastIndexOf()`; // 返回索引或-1
- `str.trim()`： 去除字符串两边的空格
- `str.toUpperCase()`：转换大写
- `str.toLowerCase()`：转换小写
- `str.replace(oldStr,newStr)`：字符串替换
- `str.split('...')`： 把一个字符串分割成字符串数组
- `for···of···`： 字符串的遍历器接口
- `includes() startsWith() endsWith()`
- `padStart()  padEnd()`： 字符串补全
- `repeat(num)`： 将源字符串复制 num 遍，返回新的字符串

## 截取

```js
// 字符串.slice(start, end); // 前包后不包
// slice() substring() substr() 第一个参数是开始位置，
// slice() substring() 第二个参数是结束位置
// substr() 第二个参数是 返回的长度
let str = abcdefg;
console.log(str.slice(2, 4)); // cd
console.log(str.substring(2, 4)); // cd
console.log(str.substr(2, 4)); // cdef
```
