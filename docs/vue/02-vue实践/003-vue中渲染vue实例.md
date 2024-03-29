---
id: instance
title: vue中渲染vue实例
keywords: [Vue]
tags:
  - Vue
hide_title: true
sidebar_position: 3
description: Vue 实例中渲染新 Vue 实例
custom_edit_url: null
---

```html
<!-- ParentComponent.vue -->
<template>
  <div>
    <h2>父组件 => {{ messageFromParent }}</h2>
    <button @click="renderChildInstance">渲染子组件实例</button>
    <div ref="childContainer"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import ChildComponent from './ChildComponent.vue';

  export default {
    data() {
      return {
        messageFromParent: '来自父组件的值'
      };
    },
    methods: {
      renderChildInstance() {
        // 创建一个新的Vue实例，并挂载到子容器中
        new Vue({
          render: h =>
            h(ChildComponent, {
              props: {
                message: this.messageFromParent
              },
              on: {
                childEvent: this.handleChildEvent
              }
            })
        }).$mount(this.$refs.childContainer);
      },
      handleChildEvent(dataFromChild) {
        this.messageFromParent = dataFromChild;
      }
    }
  };
</script>
```

```html
<!-- ChildComponent.vue -->
<template>
  <div>
    <h2>子组件</h2>
    <p>接受父组件传递的值: {{ message }}</p>
    <button @click="sendMessageToParent">发送子组件的数据给父组件</button>
  </div>
</template>

<script>
  export default {
    props: {
      message: String
    },
    methods: {
      sendMessageToParent() {
        // 向父组件派发自定义事件，并传递数据
        this.$emit('childEvent', '来着子组件的值');
      }
    }
  };
</script>
```
