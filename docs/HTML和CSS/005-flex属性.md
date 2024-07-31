# flex 属性

`flex: 1;` 是一个简写属性，用于设置一个 Flexbox 容器内的项目（也就是 Flex 项目）的增长因子、缩减因子和基础大小。它可以简化以下三个属性的设置：

1. `flex-grow`
2. `flex-shrink`
3. `flex-basis`

具体来说：

- `flex-grow` 定义项目的增长因子，表示在剩余空间中项目可以增长的比例。`1` 表示如果有剩余空间，项目将按比例增长以填充该空间。
- `flex-shrink` 定义项目的缩减因子，表示如果空间不足，项目将按比例缩小。`1` 表示如果空间不足，项目将按比例缩小以适应该空间。
- `flex-basis` 定义项目在分配多余空间之前占据的主轴空间。`0` 表示项目的初始大小为 0。

因此，`flex: 1;` 实际上是 `flex-grow: 1; flex-shrink: 1; flex-basis: 0;` 的简写形式。这意味着项目将按比例增长以填充其容器中的剩余空间，并在需要时按比例缩小。

## 布局

1. sider 宽度固定或可响应式, 占据整个屏幕高度, 内容超出可滚动
2. 右侧内容至少占据一屏, header 吸顶 & 高度不固定, content 自适应, footer 不限制
3. 滚动元素为整个 body

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        display: flex;
        min-height: 100vh;
        overflow-y: auto;
      }

      .sider {
        width: 200px; /* 固定宽度，可以调整 */
        background-color: #f0f0f0;
        overflow-y: auto;
        height: 100vh;
        position: sticky;
        top: 0;
      }

      .container {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .header {
        position: sticky;
        top: 0;
        background-color: #ccc;
        z-index: 1;
        width: 100%;
      }

      .content {
        flex: 1;
        height: 40000px;
        background-color: #fff;
        overflow-y: auto;
      }

      .footer {
        background-color: #ccc;
      }
    </style>
  </head>
  <body>
    <div class="sider">menu</div>
    <div class="container">
      <header class="header">header</header>
      <div class="content">content</div>
      <footer class="footer">footer</footer>
    </div>
  </body>
</html>
```

