---
id: svg
title: vue和nuxt中使用svg
keywords: [Vue]
tags:
  - Vue
hide_title: true
sidebar_position: 1
description: vue和nuxt中使用svg
custom_edit_url: null
---

## vue 使用 svg 图标

### 安装依赖

```bash
npm install svg-sprite-loader -S
```

### 配置 vue.config

```js
// vue.config.js
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // ...
  chainWebpack(config) {
    // 配置 svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();
  }
  // ...
};
```

### 创建 SvgIcon 组件

```vue
<!-- src\components\SvgIcon\index.vue -->
<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    v-on="$listeners"
  />
  <svg
    v-else
    :class="svgClass"
    aria-hidden="true"
    v-on="$listeners"
  >
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass);
    },
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return `svg-icon ${this.className}`;
      }
      return 'svg-icon';
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      };
    }
  }
};
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
```

### 在 vue 中生成 icon

```bash
src
  ├─icons
  │  │  index.js
  │  └─svg
  │     button.svg
```

```js
// src\icons\index.js
import Vue from 'vue';
import SvgIcon from '@/components/SvgIcon';

// 注册为全局组件
Vue.component('svg-icon', SvgIcon);

// 引入所有svg文件，svg文件在 src\icons\svg 目录下
const req = require.context('./svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);
```

### 引入

```js
// src\main.js
import '@/icons';
```

### 使用

```vue
<svg-icon icon-class="component" />
<svg-icon icon-class="button" />
<svg-icon icon-class="input" />
```

## nuxt 使用 svg 图标

### 安装依赖

```bash
npm install svg-sprite-loader -S
```

### 配置 nuxt.config

```js
// nuxt.config.js
const path = require('path');

module.exports = {
  // ...
  build: {
    extend(config, ctx) {
      // 排除 nuxt 原配置的影响,Nuxt 默认有vue-loader,会处理svg,img等
      // 找到匹配.svg的规则,然后将存放svg文件的目录排除
      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'));
      svgRule.exclude = [path.resolve(__dirname, 'assets/icons/svg')];
      //添加 loader 规则
      config.module.rules.push({
        test: /\.svg$/, //匹配.svg
        include: [path.resolve(__dirname, 'assets/icons/svg')], // 将存放svg的目录加入到loader处理目录
        use: [{ loader: 'svg-sprite-loader', options: { symbolId: 'icon-[name]' } }]
      });
    },
    analyze: true
  }
  // ...
};
```

### 创建 SvgIcon 组件

```vue
<!-- components\SvgIcon.vue -->
<template>
  <client-only>
    <div
      v-if="isExternal"
      :style="styleExternalIcon"
      class="svg-external-icon svg-icon"
      v-on="$listeners"
    />
    <svg
      v-else
      :class="svgClass"
      aria-hidden="true"
      v-on="$listeners"
    >
      <use :xlink:href="iconName" />
    </svg>
  </client-only>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass);
    },
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return `svg-icon ${this.className}`;
      }
      return 'svg-icon';
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      };
    }
  }
};
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
```

### 在 plugins 中生成 icon 插件

```bash
aseets
  └─icons
      │    button.svg
      │    cascader.svg
```

```js
// plugins\svg-icon.js
import Vue from 'vue';
import SvgIcon from '@/components/SvgIcon'; // Nuxt 默认@指向根目录

// 注册组件
Vue.component('svg-icon', SvgIcon);
// 预请求svg组件(通过之前的svg-sprite-loader加载)
const req = require.context('@/assets/icons/svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);
```

### 在 nuxt.config 中使用 plugin

```js
// nuxt.config.js
module.exports = {
  // ...
  plugins: [
    {
      src: '@/plugins/svg-icon.js',
      ssr: false
    }
  ]
  // ...
};
```

### 使用

```html
<svg-icon icon-class="component" />
<svg-icon icon-class="button" />
<svg-icon icon-class="input" />
```

## 参考

- [Nuxt JS 使用 svg-sprite-loader 和 自定义 VUE 组件 处理 svg 图标](https://zhuanlan.zhihu.com/p/75171152?utm_id=0)
- [在 Vue 中使用 svg](https://blog.csdn.net/MFWSCQ/article/details/123365794)
