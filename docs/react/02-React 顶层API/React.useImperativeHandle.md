# React.useImperativeHandle

## 介绍

```jsx
useImperativeHandle(ref, createHandle, [deps]);
```

- ref：接受 useRef 或 forwardRef 传递过来的 ref；
- createHandle：处理函数，返回值作为暴露给父组件的 ref 对象；
- deps：依赖项，依赖项如果更改，会形成新的 ref 对象。

`useImperativeHandle` 是 `React` 中的一个钩子函数，用于向父组件暴露子组件的某些功能，允许在父组件中
调用子组件的特定方法或访问子组件的 DOM 节点。

通常情况下，React 鼓励通过 props 和回调函数来实现组件间的通信，但在某些情况下，可能需要直接操作子组
件，这时可以使用 useImperativeHandle。

## useImperativeHandle 和 forwardRef 联用

### 案例一

父组件能够调用子组件的方法来改变子组件的状态：

```jsx
import React, { forwardRef, useImperativeHandle, useState } from 'react';

// 子组件
const ChildComponent = forwardRef((props, ref) => {
  const [count, setCount] = useState(0);

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    increment: () => {
      setCount(count + 1);
    },
    getCount: () => {
      return count;
    }
  }));

  return (
    <div>
      <p>子组件的值: {count}</p>
    </div>
  );
});

// 父组件
function ParentComponent() {
  const childRef = React.createRef();

  const handleIncrement = () => {
    childRef.current.increment();
  };

  const handleGetCount = () => {
    const count = childRef.current.getCount();
    console.log('通过 ref 获取子组件的值:', count);
  };

  return (
    <div>
      <ChildComponent ref={childRef} />
      <button onClick={handleIncrement}>父组件调用子组件的方法 count + 1</button>
      <button onClick={handleGetCount}>父组件调用子组件的方法获取 count 值</button>
    </div>
  );
}

export default ParentComponent;
```

### 案例二

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

这个原理就是: 我们执行的这个 focus 本质是 useImperativeHandle 里面的 focus,然后我们在子组件里面再定
义一个 useRef,在子组件把 inputRef 赋给 input,相当于子组件内部先获取了这个 focus,然后在父组件再调用。
