# React.forwardRef

## 介绍

在React中，`React.forwardRef`是一个函数，它允许组件将ref传递给其子组件。

通常，当你在函数组件中需要访问子组件的DOM节点或实例时，你可以使用ref。**但是，在使用函数组件时，ref不能直接传递给函数组件，因为函数组件没有实例。**这时候，`React.forwardRef`就派上用场了。

`React.forwardRef`接受一个渲染函数，该函数接收`props`和`ref`作为参数，并返回组件的React元素。通过这种方式，你可以将ref从父组件传递到函数组件内部的子组件。

```jsx
import React, { useRef, useEffect, forwardRef } from 'react';

// forwardRef 接受 RC 组件，并将 调用时的 ref 属性绑定到自己组件内部的元素/组件上
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

**总结： forwardRef 的目的就是获取函数组件的 dom 引用。**

## 链接

- [React.forwardRef](https://zh-hans.reactjs.org/docs/react-api.html#reactforwardref)
- [转发 refs 到 DOM 组件](https://zh-hans.reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
- [在高阶组件中转发 refs](https://zh-hans.reactjs.org/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)
