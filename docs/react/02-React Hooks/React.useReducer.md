# React.useReducer

useReducer 是 React 中的一个钩子函数，用于管理和处理组件的状态逻辑，特别适用于复杂的状态管理场景。它的工作方式类似于 Redux 中的 reducer，通过指定一个状态更新函数（reducer）来更新组件的状态。这个钩子函数可以将状态和状态更新逻辑分离，使代码更加清晰和可维护。

## 介绍

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);

// reducer = (state, action) => newState
```

使用 `useReducer` 还能给那些会触发深更新的组件做性能优化，因为可以**向子组件传递 dispatch 而不是回调函数。**

1. 指定初始 state

有两种不同初始化 useReducer state 的方式，你可以根据使用场景选择其中的一种。将初始 state 作为第二个参数传入 useReducer 是最简单的方法：

```js
const [state, dispatch] = useReducer(reducer, { count: initialCount });
```

2. 惰性初始化

你可以选择惰性地创建初始 state。为此，需要将 init 函数作为 useReducer 的第三个参数传入，这样初始 state 将被设置为 init(initialArg)。

这么做可以将用于计算 state 的逻辑提取到 reducer 外部，这也为将来对重置 state 的 action 做处理提供了便利：

```jsx
import React, { useReducer } from 'react';

// 该方法将返回 state 的 初始值
function init(initialCount) {
  return { count: initialCount + 100 };
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'reset', payload: initialCount })}>Reset</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}

export default () => <Counter initialCount={1} />;
```

3. 跳过 dispatch

如果 Reducer Hook 的返回值与当前 state 相同，React 将跳过子组件的渲染及副作用的执行。

需要注意的是，React 可能仍需要在跳过渲染前再次渲染该组件。不过由于 React 不会对组件树的“深层”节点进行不必要的渲染，所以大可不必担心。如果你在渲染期间执行了高开销的计算，则可以使用 useMemo 来进行优化。
