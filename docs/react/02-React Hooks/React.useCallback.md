# React.useCallback

`React.useCallback` 是 React 中的一个 Hook，它用于优化性能，特别是在处理子组件的回调函数时非常有用。

在 React 中，每当一个组件重新渲染时，其内部的所有函数都会被重新创建。如果一个函数作为 prop 传递给子组件，而且父组件每次重新渲染时都会创建这个函数，那么子组件可能会不必要地重新渲染，因为它检测到的函数引用总是不同的，即使函数的实际逻辑并没有改变。

`React.useCallback` 的作用就是在渲染之间“记住”函数。它返回一个 `memoized`（记忆化）版本的回调函数，该函数仅在其依赖项发生变化时才会更改。这意味着，只有当依赖项发生变化时，`useCallback` 才会返回一个新的函数引用，否则它会返回缓存的函数引用。这样做可以确保在组件重新渲染时，相同的回调函数引用被传递给子组件，从而避免不必要的子组件渲染。

## 介绍

```js
// 返回一个 memoized 回调函数
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

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

点击 子组件 `count2 + 2` 的时候， handleOnChange 方法会更新；点击父组件 `count1 + 1` 的时候，handleOnChange 被 useCallback 缓存了，不会更新。

总结： **useCallback 是用来缓存组件的方法的，只有在依赖项发生改变时才会触发。**
