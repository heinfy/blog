# React.useCallback

`useCallback` 是 `React` 中的一个钩子函数，用于优化函数的性能。

它用于**避免在每次渲染时都创建新的函数实例**，特别是在将函数作为 props 传递给子组件时，可以有效地避免不必要的渲染。这在性能敏感的场景下特别有用。

## 介绍

```js
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

返回一个 memoized 回调函数。

把内联回调函数及依赖项数组作为参数传入 useCallback，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 shouldComponentUpdate）的子组件时，它将非常有用。

`useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`。

## 测试案例

存在父子组件，子组件获取父组件的方法，点击子组件的按钮，触发传递过来的方法，更新父组件的属性，并显示在 UI 上。

```jsx
import React, { useState, useCallback } from 'react';
import './app.css';

const Child = ({ onChange }) => {
  console.log('子组件更新啦！');
  return (
    <div className='child'>
      这是子组件：
      <button onClick={onChange}>count2 + 2</button>
    </div>
  );
};

const Parent = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const handleOnChange = useCallback(() => {
    console.log('handleOnChange 重新渲染了');
    setCount2(count2 + 2);
  }, [count2]);
  return (
    <div className='parent'>
      <div>
        count1: {count1}， count2: {count2}
      </div>
      <button onClick={() => setCount1(count1 + 1)}>count1 + 1</button>
      <Child onChange={handleOnChange} />
    </div>
  );
};

const App = () => <Parent />;

export default App;
```

点击 子组件 `count2 + 2` 的时候， handleOnChange 方法会更新；
点击 父组件 `count1 + 1` 的时候， handleOnChange 被 useCallback 缓存了，不会更新。

总结： **useCallback 是用来缓存组件的方法的，只有在依赖项发生改变时，才会触发。**
