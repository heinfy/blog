# React.useSyncExternalStore

**useSyncExternalStore：** 会通过强制的同步状态更新，使得外部 `store` 可以支持并发读取。

**注意：** 这个 Hooks 并不是在日常开发中使用的，而是给第三方库 `redux`、`mobx` 使用的，因为在 React v18 中，主推的 Concurrent（并发）模式可能会出现状态不一致的问题（比如在 `react-redux 7.2.6` 的版本），所以官方给出 useSyncExternalStore 来解决此类问题。

简单地说，useSyncExternalStore 能够让 React 组件在 Concurrent 模式下安全、有效地读取外接数据源，在组件渲染过程中能够检测到变化，并且在数据源发生变化的时候，能够调度更新。

当读取到外部状态的变化，会触发强制更新，以此来保证结果的一致性。

**基本使用：**

```tsx
const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
```

**Params：**

- subscribe：订阅函数，用于注册一个回调函数，当存储值发生更改时被调用。 此外，useSyncExternalStore 会通过带有记忆性的 getSnapshot 来判断数据是否发生变化，如果发生变化，那么会强制更新数据；
- getSnapshot：返回当前存储值的函数。必须返回缓存的值。如果 getSnapshot 连续多次调用，则必须返回相同的确切值，除非中间有存储值更新；
- getServerSnapshot：返回服务端（`hydration` 模式下）渲染期间使用的存储值的函数。

**Result：**

- state：数据源，用于渲染 `UI 层`的数据源。

**基本用法：**

```tsx
// @ts-nocheck
import { useSyncExternalStore } from 'react';
import { combineReducers, createStore } from 'redux';

const reducer = (state: number = 1, action: any) => {
  switch (action.type) {
    case 'ADD':
      return state + 1;
    case 'DEL':
      return state - 1;
    default:
      return state;
  }
};

/* 注册reducer,并创建store */
const rootReducer = combineReducers({ count: reducer });
const store = createStore(rootReducer, { count: 1 });

const Index: React.FC<any> = () => {
  //订阅
  const state = useSyncExternalStore(store.subscribe, () => store.getState().count);

  return (
    <>
      <div>数据源： {state}</div>
      <button
        type='primary'
        onClick={() => store.dispatch({ type: 'ADD' })}
      >
        加1
      </button>
      <button
        style={{ marginLeft: 8 }}
        onClick={() => store.dispatch({ type: 'DEL' })}
      >
        减1
      </button>
    </>
  );
};

export default Index;
```

**效果：**当我们点击按钮后，会触发 store.subscribe（订阅函数），执行 getSnapshot 后得到新的 count，此时 count 发生变化，就会触发更新。
