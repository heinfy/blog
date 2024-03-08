# DOM

## DOM 的基础操作

```js
//获取节点
document.getElementById();
document.getElementsByTagName();
document.getElementsByClassName();
document.getElementsByName();
document.querySelector(); // 可以传多种 'ul li.active'
document.querySelectorAll();

//操作元素
dom.getAttribute('attr')
dom.setAttribute('attr'，'value')
​dom.removeAttribute('attr'，'value')

//节点之间的关系
dom.parentNode
dom.childNodes （包括文本节点和元素节点）
dom.children （仅仅是元素节点）
dom.firstChild

// 获取第一个元素子节点对象，有兼容问题IE9以下不支持：
dom.firstElementChild
dom.lastChild

// 获取最后一个元素子节点对象，有兼容问题IE9以下不支持
dom.lastElementChild
dom.previousSibling

// 获取上一个同级的元素节点，有兼容问题IE9以下不支持
dom.previousElementSibling
dom.nextSibling

// 获取下一个同级的元素节点，有兼容问题IE9以下不支持
dom.nextElementSibling

父节点.appendChild(新的子节点);
父节点.insertBefore(新的节点, 旧的子节点)
父节点.removeChild(子节点)
父节点.replaceChild(新的节点, 旧的子节点)
```

## 页面的高度 API

```js
// 窗口的文档显示区的高度和宽度
window.innerheight;
window.innerWidth;

// 获取屏幕的高度和宽度
window.screen.height;
window.screen.width;

// 获取屏幕工作区域的高度和宽度
window.screen.availHeight;
window.screen.availWidth;

// 网页全文的高度和宽度
document.body.scrollHeight;
document.body.scrollWidth;

// 滚动条卷上去的高度和向右卷的宽度
document.body.scrollTop;
document.body.scrollLeft;

// 网页可见区域的高度和宽度（不加边线）
document.body.clientHeight;
document.body.clientWidth;

// 网页可见区域的高度和宽度（加边线）
document.body.offsetHeight;
document.body.offsetWidth;
```
