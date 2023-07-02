# React.forwardRef

- [React.forwardRef](https://zh-hans.reactjs.org/docs/react-api.html#reactforwardref)

## 介绍

React.forwardRef 会创建一个 React 组件，这个组件能够将其接受的 ref 属性转发到其组件树下的另一个组件中。这种技术并不常见，但在以下两种场景中特别有用：

- [转发 refs 到 DOM 组件](https://zh-hans.reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
- [在高阶组件中转发 refs](https://zh-hans.reactjs.org/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

React.forwardRef 接受渲染函数作为参数。React 将使用 props 和 ref 作为参数来调用此函数。此函数应返回 React 节点。

```jsx
import React, { useRef, useEffect, forwardRef } from 'react';

/**
 * forwardRef 接受 RC 组件，并将 调用时的 ref 属性绑定到自己组件
 * 内部的元素/组件上
 */
const FancyButton = forwardRef((props, ref) => {
  console.log('props', props);
  return (
    <div>
      <p>{props.name}</p>
      <button
        ref={ref}
        className='FancyButton'
      >
        {props.children}
      </button>
    </div>
  );
});

const App = () => {
  const ref = useRef();
  useEffect(() => {
    // 在副作用中可以获取ref绑定子组件的元素
    console.log('ref', ref);
  }, []);
  return (
    <FancyButton
      name={'houfeii'}
      ref={ref}
    >
      <div>哈哈这是 children1</div>
      <div>哈哈这是 children2</div>
    </FancyButton>
  );
};

export default App;
```

**总结： forwardRef 的目的就是为父组件获取子组件的 dom。**
