---
id: vue_017
title: keepAlive 和 activated
keywords: [Vue]
tags:
  - Vue
hide_title: true
sidebar_position: 17
description: Vue 的 keepAlive 和 activated
custom_edit_url: null
---

`<keep-alive>` 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。它自身不会渲染一个 DOM 元素，也不会出现在父组件链中，不会渲染到 DOM 树中。

它的作用是在内存中缓存组件（不让组件销毁），等到下次渲染是，还会保留在原来的状态。

当组件在 `<keep-alive>` 内被切换，它的 `activated` 和 `deactivated` 这两个生命周期钩子函数将会被对应执行。

使用：

```html
<keep-alive include="mainList">
  <router-view class="child"></router-view>
</keep-alive>
```

属性：

- `include` - 字符串或正则表达式。只有名称匹配的组件会被缓存。
- `exclude` - 字符串或正则表达式。任何名称匹配的组件都不会被缓存。
- `include` 和 `exclude` 属性允许组件有条件地缓存。二者都可以用逗号分隔字符串、正则表达式或一个数组来表示
- `max` - 数字。最多可以缓存多少组件实例，一旦这个数字达到了，在新实例被创建之前，已缓存组件中最久没有被访问的实例会被销毁掉。

组件匹配首先检查组件自身的 `name` 选项（**不是 route 的 name**），如果 `name` 选项不可用，则匹配它的局部注册名称 (父组件 `components` 选项的键值)。匿名组件不能被匹配。

设置了 `<keep-alive>` 缓存的组件，会新增 `activated` 和 `deactivate` 生命周期钩子：

`activated` 和 `deactivate` 只要页面切换、加载组件就会执行一次

第一次进入：`beforeRouterEnter -> created -> … -> activated-> … -> deactivated`
后续进入时：`beforeRouterEnter -> activated -> deactivated`

- [vue 中前进刷新、后退缓存用户浏览数据和浏览位置的实践](https://juejin.im/post/5b2ce07ce51d45588a7dbf76)

- [keep-alive 组件级缓存](https://www.cnblogs.com/yf-html/p/9353627.html)
