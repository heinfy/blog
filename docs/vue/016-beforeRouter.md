---
id: vue_016
title: Router 家族
keywords: [Vue]
tags:
  - Vue
hide_title: true
sidebar_position: 16
description: Vue 的 Router 家族
custom_edit_url: null
---

组件中的 beforeRoute 函数：

- `beforeRouteEnter(to, from, next) {}`
- `beforeRouteUpdate(to, from, next) {}`
- `beforeRouteLeave(to, from, next) {}`

全局中的 before 函数

- `router.beforeEach((to, from, next) => {}`
- `router.beforeResolve((to, from, next) => {}`
- `router.afterEach((to, from) => {}`

进入一个页面触发的函数：

`beforeEach => beforeRouteEnter => beforeResolve => afterEach => created => mounted => beforeRouteLeave`

- [Vue 导航守卫 beforeRouteEnter，beforeRouteUpdate，beforeRouteLeave 详解](https://blog.csdn.net/qq_43196107/article/details/90235110)
- [vue 组件独享守卫钩子函数参数详解（beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave）](https://www.cnblogs.com/lhl66/p/9195901.html)
- [路由守卫 beforeEach,beforeResolve,afterEach](https://www.jianshu.com/p/e5e0d5d4e689)
