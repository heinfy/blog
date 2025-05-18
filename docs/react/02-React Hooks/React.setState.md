# React.setState

在 React Hooks 中，`setCount(count + 1)` 和 `setCount(v => v + 1)` 都可以用来更新状态，但它们之间存在一些区别。

1. **`setCount(count + 1)`**:
   - 这种方式是直接将新的状态值传递给 `setCount` 函数。它会使用当前状态值 `count` 加上 `1` 来计算新的状态值。
   - 当多个 `setCount` 调用在同一个渲染周期内发生时，React 可能会对这些更新进行批处理，导致可能只进行一次渲染。因此，在此情况下，多个 `setCount(count + 1)` 调用可能只导致一次更新。
2. **`setCount(v => v + 1)`**:
   - 这种方式是使用函数形式来更新状态。`setCount` 接收一个函数作为参数，该函数的返回值将被用作新的状态值。
   - 使用函数形式来更新状态时，React 会保证在函数中获取到的状态值是最新的。这意味着不需要担心在更新状态时获取到旧的状态值。
   - 因为每次 `setCount` 调用都是一个新的函数，React 会将每次调用都视为独立的更新，所以即使多次调用 `setCount(v => v + 1)`，每次都会触发更新。

因此，主要的区别在于更新的精确性和性能方面。如果更新依赖于当前状态的值，或者需要保证获取到的状态值是最新的，推荐使用函数形式的 `setCount(v => v + 1)`。如果更新是独立的，并且不依赖于当前状态的值，可以直接使用 `setCount(count + 1)`。

## 闭包和 setState

```js
import { useState, useEffect } from 'react';

export default () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('count:', count);
      setCount(count + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div>自定义Hooks：useLatestt</div>
      <div>count: {count}</div>
    </>
  );
};
```

> 这段代码会每隔一秒打印当前的 count 值。但是 count 值会一直是 0，不会增加。

这是因为在`useEffect`中传入了空数组作为第二个参数，表示 `effect` 仅在组件挂载时执行一次。而在`setInterval`的回调函数中，`count`是一个闭包变量，它保留了`useEffect`执行时的值，即始终是 0。因此，虽然`setCount(count + 1)`在每次执行时会增加 count 的值，但由于闭包的作用，`count`的值始终是 0，导致打印出来的 `count` 值也一直是 0。
