---
id: beforeRoute
title: beforeRoute
keywords: [Vue]
tags:
  - Vue
hide_title: true
sidebar_position: 1
description: Vue 的 beforeRoute
custom_edit_url: null
---

组件内守卫：

- `beforeRouteEnter(to, from, next) {}`
- `beforeRouteUpdate(to, from, next) {}`
- `beforeRouteLeave(to, from, next) {}`

全局守卫

- `router.beforeEach((to, from, next) => {}`
- `router.beforeResolve((to, from, next) => {}`
- `router.afterEach((to, from) => {}`

路由独享守卫

- `beforeEnter((to, from, next) => {}`

```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // 在进入路由前进行一些逻辑处理
        // 比如验证用户权限
        if (userAuthenticated()) {
          next(); // 继续路由导航
        } else {
          next('/login'); // 重定向到登录页面
        }
      }
    }
    // 其他路由配置项...
  ]
});
```

进入一个页面触发的函数：

`beforeEach => beforeRouteEnter => beforeResolve => afterEach => created => mounted => beforeRouteLeave`

## 链接

- [Vue 导航守卫 beforeRouteEnter，beforeRouteUpdate，beforeRouteLeave 详解](https://blog.csdn.net/qq_43196107/article/details/90235110)
- [vue 组件独享守卫钩子函数参数详解（beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave）](https://www.cnblogs.com/lhl66/p/9195901.html)
- [路由守卫 beforeEach,beforeResolve,afterEach](https://www.jianshu.com/p/e5e0d5d4e689)
