# React.useInsertionEffect

**useInsertionEffect：** 与 useEffect 一样，但它在所有 DOM 突变之前同步触发。

**注意：**

- useInsertionEffect 应限于 css-in-js 库作者使用。在实际的项目中优先考虑使用 useEffect 或
  useLayoutEffect 来替代；
- 这个钩子是为了解决 `CSS-in-JS` 在渲染中注入样式的性能问题而出现的，所以在我们日常的开发中并不会用
  到这个钩子，但我们要知道如何去使用它。

**基本使用：**

```ts
useInsertionEffect(callback, deps);
```

**基本用法：**

```tsx
import { useInsertionEffect } from 'react';

const Index: React.FC<any> = () => {
  useInsertionEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .css-in-js{
        color: blue;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div>
      <div className='css-in-js'>大家好，我是小杜杜，一起玩转Hooks吧！</div>
    </div>
  );
};

export default Index;
```

**效果：**

![img](assets/0faddc177bb74af39f5c809f999ed45ctplv-k3u1fbpfcp-jj-mark1890000q75.avis)

**执行顺序：** 在目前的版本中，React 官方共提供三种有关副作用的钩子，分别是
useEffect、useLayoutEffect 和 useInsertionEffect，我们一起来看看三者的执行顺序：

```tsx
const Index: React.FC<any> = () => {
  useEffect(() => console.log('useEffect'), []);

  useLayoutEffect(() => console.log('useLayoutEffect'), []);

  useInsertionEffect(() => console.log('useInsertionEffect'), []);

  return <div>大家好，我是小杜杜，一起玩转Hooks吧！</div>;
};

export default Index;
```

**效果：**

![img](assets/6ace9b2e6c3145b3b51d996af1b2b5detplv-k3u1fbpfcp-jj-mark1890000q75.avis)

从效果上来看，可知三者的执行的顺序为：useInsertionEffect > useLayoutEffect > useEffect。
