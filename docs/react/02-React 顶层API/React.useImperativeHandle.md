# React.useImperativeHandle

## 介绍

```jsx
useImperativeHandle(ref, createHandle, [deps]);
```

useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值。在大多数情况下，应当避免使用 ref 这样的命令式代码。useImperativeHandle 应当与 forwardRef 一起使用：

看一个 forwardRef 案例：

```js
import React, { useRef, useEffect, forwardRef } from 'react';

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

当我们在父组件里面点击这个聚焦 button 的时候，会调用子组件里面 input 的聚焦。

下面我们用 useImperativeHandle 给它改造一下：

```jsx
import React, { useRef, forwardRef, useImperativeHandle } from 'react';

const RefInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        inputRef.current.focus();
      }
    }),
    [inputRef]
  );
  return (
    <input
      type='text'
      ref={inputRef}
    ></input>
  );
});

const App = () => {
  const inputRef = useRef();
  return (
    <div>
      <RefInput ref={inputRef} />
      <button onClick={e => inputRef.current.focus()}>聚焦</button>
    </div>
  );
};

export default App;
```

这个原理就是: 我们执行的这个 focus 本质是 useImperativeHandle 里面的 focus,然后我们在子组件里面再定义一个 useRef,在子组件把 inputRef 赋给 input,相当于子组件内部先获取了这个 focus,然后在父组件再调用。
