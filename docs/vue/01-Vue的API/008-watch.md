---
id: watch
title: watch
keywords: [Vue]
tags:
  - Vue
hide_title: true
sidebar_position: 8
description: watch
custom_edit_url: null
---

```html
<template>
  <div>{{ testWatch }}</div>
</template>

<script>
  export default {
    data() {
      return {
        testWatch: 'old string',
        testWatch1: {
          a: 'old string'
        }
      };
    },
    watch: {
      // 第一种
      testWatch: function (val, oldVal) {
        console.log('testWatch: %s, old: %s', val, oldVal)
      },
      // 第二种，指向 methods 的方法
      testWatch: 'someMethod'
      // 第三种，在 data 中初次赋值也可以监听到
      testWatch:  {
        handler: function (val, oldVal) {
          console.log('testWatch: %s, old: %s', val, oldVal)
        },
        // 或 handler: 'someMethod',
        immediate: true // 初次赋值监听
      },
      // 第四种，深度监听，监听对象的某个属性
      'testWatch1.a': {
        handler: function (val, oldVal) {
          console.log('testWatch.a: %s, old: %s', val, oldVal)
        },
        deep: true
      },
      // 第五种，传入回调数组，它们会被逐一调用
      testWatch: [
        'someMethod',
        function handle2(val, oldVal) {
          /* ... */
        },
        {
          handler: function handle3(val, oldVal) {
            /* ... */
          }
          /* ... */
        }
      ]
    },
    mounted() {
      setInterval(() => {
        this.testWatch = 'new string';
        this.testWatch1.a = 'new string----';
      }, 4000);
    },
    methods: {
      someMethod(n, o) {
        console.log('someMethod', n, o);
      }
    }
  };
</script>
```
