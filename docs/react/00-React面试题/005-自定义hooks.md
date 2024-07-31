# 自定义 hooks

## usePrevious

`ref.current` 的改变不会引起视图更新。`useRef` 是 React 中用于访问 DOM 节点或存储任意可变值的 hook，其值在整个组件生命周期内保持不变，但它的变化不会触发组件重新渲染。

### 解释：

1. **`useRef` 的特性**：
   - `useRef` 创建的 `ref` 对象在组件的整个生命周期内保持不变。
   - `ref.current` 属性是一个可变的容器，可以存储任何值，但它的变化不会导致组件重新渲染。
2. **与 `useState` 的区别**：
   - `useState` 创建的状态变量发生变化时，组件会重新渲染。
   - `useRef` 创建的 `ref` 对象发生变化时，组件不会重新渲染。

```js
import { useRef, useEffect } from 'react';

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default usePrevious;
```

```js
// ahooks 实现
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = void 0;
var _react = require('react');
var defaultShouldUpdate = function defaultShouldUpdate(a, b) {
  return !Object.is(a, b);
};
function usePrevious(state, shouldUpdate) {
  if (shouldUpdate === void 0) {
    shouldUpdate = defaultShouldUpdate;
  }
  var prevRef = (0, _react.useRef)();
  var curRef = (0, _react.useRef)();
  if (shouldUpdate(curRef.current, state)) {
    prevRef.current = curRef.current;
    curRef.current = state;
  }
  return prevRef.current;
}
var _default = usePrevious;
exports['default'] = _default;
```
