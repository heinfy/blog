# hash 和 history

## hash

```html
<ul>
  <li><a href="#/">/</a></li>
  <li><a href="#/page1">/page1</a></li>
  <li><a href="#/page2">/page2</a></li>
</ul>
<div class="content-div"></div>
```

```js
// 创建路由类
class RouterClass {
  constructor() {
    this.routes = {}; // 记录路径标识符对应的 cb
    this.currentUrl = ''; // 记录hash只为方便执行 cb
    window.addEventListener('load', () => this.render());
    window.addEventListener('hashchange', () => this.render());
  }

  // 初始化
  static init() {
    window.Router = new RouterClass();
  }

  // 注册路由 和 回调 @param - path - 路径
  // @param - cb - 回调
  route(path, cb) {
    // 将路径及其对应的方法添加到 this.routes 对象中
    this.routes[path] = cb || function () {};
  }

  // 记录当前 hash，执行cb
  render() {
    this.currentUrl = location.hash.slice(1) || '/';
    this.routes[this.currentUrl](); // 默认页面
  }
}

// 调用方法，监听 load 和 hashchange 事件
RouterClass.init();
// 过去div 并 给div中添加数据
const ContentDom = document.querySelector('.content-div');
const changeContent = content => (ContentDom.innerHTML = content);

// 调用方法
Router.route('/', () => changeContent('默认页面'));
Router.route('/page1', () => changeContent('page1页面'));
Router.route('/page2', () => changeContent('page2页面'));
```

## history

### api

```js
history.pushState(); // 追加一条新的历史记录
// history.pushState('状态对象：历史记录的标题', '标题：历史记录的描述', url)

history.replaceState(); // 替换当前的历史记录为一条新的记录
// history.replaceState('历史记录的标题', '历史记录的描述', url)

window.onpopstate; //  事件 历史切换事件
```

### pushState

假设在`http://mozilla.org/foo.html`中执行了以下 js 代码：

```js
let stateObj = { foo: 'bar' };
history.pushState(stateObj, 'page 2', 'bar.html');
```

这将使浏览器地址栏显示为``http://mozilla.org/bar.html`，但是并不会导致浏览器加载`bar.html`，甚至不会
检查`bar.html`是否存在。

假设用户又访问了`http://google.com`，然后点击了返回按钮，此时地址栏现实的是
``http://mozilla.org/bar.html`，`history.state`中包含了`stateObj`的一份拷贝。页面此时展现
为`bar.html`。切页面被重新加载了，所以`popstate`事件将不会被触发。

如果我们再次点击返回按钮，页面 URL 会变为`http://mozilla.org/foo.html`，文档对象 document 会触发另外
一个 `popstate` 事件，这一次的事件对象`state object`为`null`。

这里也一样，返回并不改变文档的内容，尽管文档在接收 `popstate` 事件时可能会改变自己的内容，其内容仍与
之前的展现一致。

### replaceState

`replaceState()` 是**修改了当前的历史记录项而不是新建一个。 注意这并不会阻止其在全局浏览器历史记录中
创建一个新的历史记录项。**

假设`http://mozilla.org/foo.html`执行了如下 JavaScript 代码：

```js
let stateObj = { foo: 'bar' };
history.pushState(stateObj, 'page 2', 'bar.html');
```

然后，假设`http://mozilla.org/bar.html`执行了如下 JavaScript：

```js
history.replaceState(stateObj, 'page 3', 'bar2.html');
```

这将会导致地址栏显示`http://mozilla.org/bar2.html`,但是浏览器并不会去加载`bar2.html` 甚至都不需要检
查 `bar2.html` 是否存在。

假设现在用户重新导向到了`http://www.microsoft.com`，然后点击了回退按钮。这里，地址栏会显
示`http://mozilla.org/bar2.html`。假如用户再次点击回退按钮，地址栏会显
示`http://mozilla.org/foo.html`，完全跳过了`bar.html`。

### popstate 事件

每当活动的历史记录项发生变化时， `popstate` 事件都会被传递给 window 对象。如果当前活动的历史记录项是
被 `pushState` 创建的，或者是由 `replaceState` 改变的，那么 `popstate`事件的状态属性 `state` 会包含
一个当前历史记录状态对象的拷贝。

### demo

```html
<ul>
  <li><a href="/">/</a></li>
  <li><a href="/page1">page1</a></li>
  <li><a href="/page2">page2</a></li>
</ul>
<div class="content-div"></div>
```

```js
class RouterClass {
  constructor(path) {
    this.routes = {};
    history.replaceState({ path }, null, path);
    this.routes[path] && this.routes[path]();
    window.addEventListener('popstate', e => {
      const path = e.state && e.state.path;
      this.routes[path] && this.routes[path]();
    });
  }

  static init() {
    window.Router = new RouterClass(location.pathname);
  }
  route(path, cb) {
    this.routes[path] = cb || function () {};
  }

  //  触发路由对应回调
  go(path) {
    history.pushState({ path }, null, path);
    this.routes[path] && this.routes[path]();
  }
}

RouterClass.init();
const ul = document.querySelector('ul');
const ContentDom = document.querySelector('.content-div');
const changeContent = content => (ContentDom.innerHTML = content);

Router.route('/', () => changeContent('默认页面'));
Router.route('/page1', () => changeContent('page1页面'));
Router.route('/page2', () => changeContent('page2页面'));

ul.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    Router.go(e.target.getAttribute('href'));
  }
});
```
