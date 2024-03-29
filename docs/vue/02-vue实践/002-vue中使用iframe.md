---
id: iframe
title: vue 组件中 iframe 通信
keywords: [Vue]
tags:
  - Vue
hide_title: true
sidebar_position: 2
description: vue 组件中 iframe 通信
custom_edit_url: null
---

注意：**vue 和 iframe 不能跨域**

```html
<!-- test.vue -->
<template>
  <div>
    <!-- http://localhost:8080/iframe.html 这个地址是 public/iframe.html -->
    <iframe
      class="iframe_box"
      ref="iframeRef"
      frameborder="0"
      src="http://localhost:8080/iframe.html"
      @load="iframeLoad"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        params: {
          type: 'sendDataToIframe',
          data: {
            name: 'father data'
          }
        }
      };
    },
    methods: {
      iframeLoad() {
        const iframeWindow = this.$refs.iframeRef.contentWindow;
        // 发送消息到iframe页面
        iframeWindow.postMessage(this.params, location.origin);

        // 接受iframe页面传递过来的消息
        iframeWindow.addEventListener('sendIframeDataToPage', function (event) {
          console.log('event', event.detail);
        });
      }
    }
  };
</script>

<style>
  .iframe_box {
    display: block;
    width: 500px;
    height: 500px;
    border: 1px solid #c95603;
  }
</style>
```

```html
<!-- iframe.html ** 可以把该页面放在 public/ 目录下 -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>iframe</title>
  </head>
  <body>
    <button id="btn">iframe传递数据给父组件</button>
    <script>
      window.addEventListener('message', function (event) {
        console.log('data', event.data);
      });

      // 添加事件监听器
      document.querySelector('#btn').addEventListener('click', function () {
        // 创建自定义事件，将数据放入detail字段
        const event = new CustomEvent('sendIframeDataToPage', { detail: 'iframe data' });
        // 触发事件
        window.dispatchEvent(event);
      });
    </script>
  </body>
</html>
```
