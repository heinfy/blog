# React.useLayoutEffect

- [React.useLayoutEffect](https://zh-hans.reactjs.org/docs/hooks-reference.html#uselayouteffect)
- [React—攻克 Hooks 之 useLayoutEffect](https://zhuanlan.zhihu.com/p/147173241)

## 介绍

在 React 中，`useEffect` 和 `useLayoutEffect` 都是钩子函数，用于处理副作用操作，但它们在执行的时机上
有一些区别。**主要的区别在于它们对页面渲染的阶段不同。**

1. `useEffect`： 这个钩子函数在组件渲染完成后执行，不会阻塞页面的绘制，而是会在浏览器绘制完成后异步
   执行。它适用于大多数情况下的副作用操作，如数据获取、订阅、定时器等。

2. `useLayoutEffect`： **这个钩子函数也会在组件渲染完成后执行，但会在浏览器绘制之前同步执行。这意味
   着它会阻塞页面的绘制，因此需要谨慎使用。**`useLayoutEffect` 通常用于需要在页面绘制之前立即执行的
   副作用操作，例如测量 DOM 元素的尺寸。

以下是一个用代码说明这两个钩子函数区别的示例：

```jsx
import React, { useState, useEffect, useLayoutEffect } from 'react';

function ExampleComponent() {
  const [count, setCount] = useState(0);

  // useEffect 示例
  useEffect(() => {
    console.log('useEffect 执行');
    document.title = `Count: ${count}`;
  }, [count]);

  // useLayoutEffect 示例
  useLayoutEffect(() => {
    console.log('useLayoutEffect 执行');
    // 模拟一个需要同步执行的测量操作
    const element = document.getElementById('my-element');
    if (element) {
      const width = element.clientWidth;
      console.log('useLayoutEffect 元素 width:', width);
    }
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <div id='my-element'>My Element</div>
    </div>
  );
}

export default ExampleComponent;
```

## useLayoutEffect 和 useEffect 的区别

布局副作用：

- useEffect 在浏览器渲染完成后执行
- useLayoutEffect 在浏览器渲染前执行

特点：

- useLayoutEffect 总是比 useEffect 先执行
- useLayoutEffect 里面的任务最好影响了 Layout（布局）
