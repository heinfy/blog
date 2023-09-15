# React.useRef

## createRef 和 useRef

测试案例： 点击按钮获取输入框焦点

```jsx
import React, { createRef, useRef } from 'react';

const Com1 = () => {
  const inputEl = createRef();
  console.log('Com1 createRef', inputEl);
  const btnClick = () => {
    inputEl.current.focus();
    console.log('Com1 btnClick', inputEl);
  };
  return (
    <div>
      <button onClick={btnClick}>createRef 点击获取焦点</button>
      <input
        type='text'
        ref={inputEl}
      />
    </div>
  );
};

const Com2 = () => {
  const inputEl = useRef();
  console.log('Com2 useRef', inputEl);
  const btnClick = () => {
    inputEl.current.focus();
    console.log('Com2 btnClick', inputEl);
  };
  return (
    <div>
      <button onClick={btnClick}>useRef 点击获取焦点</button>
      <input
        type='text'
        ref={inputEl}
      />
    </div>
  );
};

const App = () => (
  <>
    <Com1 />
    <br />
    <Com2 />
  </>
);

export default App;
```

从上面的例子看, createRef 和 useRef 的作用完全一样, 那为什么 react 要设计一个新的 hook ? 难道只是会
了加上 use , 统一 hook 规范么?

1. createRef 与 useRef 的区别

官网的定义如下:

useRef returns a mutable ref object whose .current property is initialized to the passed argument
(initialValue). The returned object will persist for the full lifetime of the component

> 换句人话说 , useRef 在 react hook 中的作用, 正如官网说的, 它像一个变量, 类似于 this , 它就像一个盒
> 子, 你可以存放任何东西. createRef 每次渲染都会返回一个新的引用，而 useRef 每次都会返回相同的引用。

```jsx
import React, { createRef, useRef, useState } from 'react';

const App = () => {
  const [renderIdx, setRenderIdx] = useState(1);
  const refFormUseRef = useRef();
  const refFormCreateRef = createRef();
  if (!refFormUseRef.current) {
    refFormUseRef.current = renderIdx;
  }
  if (!refFormCreateRef.current) {
    refFormCreateRef.current = renderIdx;
  }
  return (
    <>
      <div>当前索引： {renderIdx}</div>
      <div>
        <b>refFormUseRef</b> value: {refFormUseRef.current}
      </div>
      <div>
        <b>refFormCreateRef</b> value: {refFormCreateRef.current}
      </div>
      <button onClick={() => setRenderIdx(renderIdx + 1)}>re-render</button>
    </>
  );
};
```

总结：每次 hooks 渲染时， createRef 都会重新创建并被赋值， useRef 和 useState 是保存在 hooks 组件内
部的变量，不会在组件重新渲染时再次创建。

区别：

- useRef 仅能用在 FunctionComponent，createRef 仅能用在 ClassComponent。
- createRef 并没有 Hooks 的效果，其值会随着 FunctionComponent 重复执行而不断被初始化：

```js
function App() {
  // 错误用法，永远也拿不到 ref
  const valueRef = React.createRef();
  return <div ref={valueRef} />;
}
```

上述 valueRef 会随着 App 函数的 Render 而重复初始化，这也是 Hooks 的独特之处，虽然用在普通函数中，但
在 React 引擎中会得到超出普通函数的表现，比如初始化仅执行一次，或者引用不变。

2. 何时使用 useRef

测试代码：

```jsx
import React, { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(1);
  const showAlert = () => {
    setTimeout(() => {
      alert(count);
    }, 3000);
  };
  return (
    <>
      <div>当前索引： {count}</div>
      <button onClick={() => setCount(count + 1)}>点击 + 1</button>
      <button onClick={showAlert}>3s后展示alert</button>
    </>
  );
};
```

界面上 count 的实时状态？ 还是在点击 button 时 count 的快照？

快照：当点击 +1 到 2 时，点击 3s 后展示 alert，然后在点击 +1 到 6，最后显示 alert 为 2。

原因：当更新状态时，hooks 组件重新渲染，每一次渲染都会拿到独立的 count，并重新渲染 showAlert ，这样
每一个 showAlert 里面都是他自己的 count。

3. 如何让点击的时候弹出实时的 count？

```jsx
import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [count, setCount] = useState(1);
  const countUseRef = useRef(count);
  // 主要是通过 useEffect 每次更新重新给 current 赋值
  // 因为 useRef 每次都会返回同一个引用, 所以在 useEffect 中修改的时候 ,
  // 在 alert 中也会同时被修改. 这样子, 点击的时候就可以弹出实时的 count 了.
  useEffect(() => {
    console.log('useEffect 执行了');
    countUseRef.current = count;
  });
  const showAlert = () => {
    setTimeout(() => {
      alert(countUseRef.current);
    }, 3000);
  };
  return (
    <>
      <div>当前索引： {count}</div>
      <button onClick={() => setCount(count + 1)}>点击 + 1</button>
      <button onClick={showAlert}>3s后展示alert</button>
    </>
  );
};
export default App;
```

4. 获取上一次的索引

```jsx
import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [count, setCount] = useState(1);
  const preCountUseef = useRef(count);
  // 主要是通过 useEffect 每次更新重新给 current 赋值
  useEffect(() => {
    console.log('useEffect 执行了');
    preCountUseef.current = count;
  });
  console.log('这个先执行！');
  return (
    <>
      <div>上一个索引： {preCountUseef.current}</div>
      <div>当前索引： {count}</div>
      <button onClick={() => setCount(count + 1)}>点击 + 1</button>
    </>
  );
};
export default App;
```

原因： hooks 组件在更新时，先更新 UI，后执行副作用！

## 总结

useRef 不仅仅是用来管理 DOM ref 的，它还相当于 this , 可以存放任何变量.

useRef 可以很好的解决闭包带来的不方便性.你可以在各种库中看到它的身影, 比如 react-use 中的
useInterval , usePrevious ……

值得注意的是，当 useRef 的内容发生变化时,它不会通知您。更改.current 属性不会导致重新呈现。因为他一直
是一个引用 .

## 链接

- [你不知道的 useRef](https://zhuanlan.zhihu.com/p/105276393)
- [React.useRef and React.createRef: The Difference](https://blog.bitsrc.io/react-useref-and-react-createref-the-difference-afedb9877d0f)
