# React Hooks 入门

参看：

- [React Hooks 免费视频教程](https://www.bilibili.com/video/BV1y4411Q7yH)
- [React Hooks 免费视频教程(共 11 集)](http://jspang.com/detailed?id=50)

## class 和 hooks 对比

1. class 计数器组件：

```jsx
import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  render() {
    return (
      <div>
        <h1>{this.state.count}</h1>
        <button onClick={this.addCount.bind(this)}>+1</button>
      </div>
    );
  }
  addCount() {
    console.log(this);
    this.setState({
      count: this.state.count + 1
    });
  }
}

export default App;
```

2. hooks 计数器组件：

```jsx
import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>You clicked {count} times</h1>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

export default App;
```

## useState 的介绍

> useState 是 react 自带的一个 hook 函数，它的作用是用来声明状态变量。
> useState 不能放在判断语句中

代码如上

## useEffect 代替生命周期函数

```js
import React, { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(`useEffect 周期触发了 you click ${count} times`);
  });
  return (
    <div>
      <h1>You clicked {count} times</h1>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

export default App;
```

- React 首次渲染和之后的每次渲染都会调用一遍`useEffect`函数，而之前我们要用两个生命周期函数分别表示首次渲染(componentDidMonut)和更新导致的重新渲染(componentDidUpdate)。
- useEffect 中定义的函数的执行不会阻碍浏览器更新视图，也就是说这些函数时异步执行的，而`componentDidMonut`和`componentDidUpdate`中的代码都是同步执行的。个人认为这个有好处也有坏处吧，比如我们要根据页面的大小，然后绘制当前弹出窗口的大小，如果时异步的就不好操作了。

## useEffect 实现 componentWillUnmonunt 生命周期

### useEffect 解绑副作用

因为`Hooks`叫它副作用，所以`componentWillUnmount`也可以理解成解绑副作用。

```jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

// 组件一
function Index() {
  useEffect(() => {
    console.log('1， useEffect=>进入了 Index  页面');
    return () => {
      console.log('2， 离开了  Index  页面');
    };
  });
  return <h1>Index 组件</h1>;
}

// 组件二
function List() {
  useEffect(() => {
    console.log('3， useEffect=>进入了 List  页面');
  });
  return <h1>List Page 组件</h1>;
}

// 默认渲染组件一
function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(`4，useEffect 周期触发了 you click ${count} times`);
  });
  return (
    <div>
      <h1>You clicked {count} times</h1>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <Router>
        <ul>
          <li>
            {' '}
            <Link to='/'>首页</Link>{' '}
          </li>
          <li>
            <Link to='/list/'>列表</Link>{' '}
          </li>
        </ul>
        <Route
          path='/'
          exact
          component={Index}
        />
        <Route
          path='/list/'
          component={List}
        />
      </Router>
    </div>
  );
}

export default App;
```

- 当页面首次渲染时，只会触发`1 4`
- 当点击`+1`的时候，然后触发`2 1 4`
- 当切换组件时，触发`2 3`
- 当切换组件后，点击`+1`，触发`3 4`

总结：

1. 父组件更新时，此时子组件必定重新渲染
2. 子组件切换时，此时触发`useEffect`的`return`函数，相当于`componentWillUnmonunt`

### useEffect 的第二个参数

那到底要如何实现类似`componentWillUnmount`的效果那?

这就需要请出`useEffect`的第二个参数，它是一个数组，数组中可以写入很多状态对应的变量，意思是当状态值发生变化时，我们才进行解绑。

但是当传空数组`[]`时，就是当组件将被销毁时才进行解绑，这也就实现了`componentWillUnmount`的生命周期函数。

```jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

// 组件一
function Index() {
  useEffect(() => {
    console.log('1， useEffect=>进入了 Index  页面');
    return () => {
      console.log('2， 离开了  Index  页面');
    };
    // 传入空数组  就是当组件将被销毁时才进行解绑
  }, []);
  return <h1>Index 组件</h1>;
}

// 组件二
function List() {
  useEffect(() => {
    console.log('3， useEffect=>进入了 List  页面');
  });
  return <h1>List Page 组件</h1>;
}

// 默认渲染组件一
function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(`4，useEffect 周期触发了 you click ${count} times`);
    // 意思是当状态值发生变化时，我们才进行解绑 componentDidUpdate
  }, [count]);
  return (
    <div>
      <h1>You clicked {count} times</h1>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <Router>
        <ul>
          <li>
            {' '}
            <Link to='/'>首页</Link>{' '}
          </li>
          <li>
            <Link to='/list/'>列表</Link>{' '}
          </li>
        </ul>
        <Route
          path='/'
          exact
          component={Index}
        />
        <Route
          path='/list/'
          component={List}
        />
      </Router>
    </div>
  );
}

export default App;
```

总结：

- 第二个参数不传，相当于`componentDidMount` `componentDidUpdate` `componentWillUnmonunt`的集合
- 第二个参数传`[]`，相当于`componentWillUnmonunt`
- 第二个参数传`[count]`，某一个状态，相当于`componentDidUpdate`，只有这个状态发生改变时触发

### useContext 让父子传值变的简单

```jsx
import React, { useState, createContext, useEffect, useContext } from 'react';

// 创建一个 共享的数的上下文
const CountContext = createContext();

// 子组件
function Child() {
  // 子组件获取父组件的传递的值
  let count = useContext(CountContext);
  useEffect(() => {
    console.log('1');
  }); // 相当于 shouldUpdate 做了优化
  return <h1>这是子组件 == {count}</h1>;
}

// 父组件
function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>You clicked {count} times</h1>
      <button onClick={() => setCount(count + 1)}>+1</button>
      {/* 通过 CountContext.Provider 父子传值 */}
      <CountContext.Provider value={count}>
        <Child></Child>
      </CountContext.Provider>
    </div>
  );
}

export default App;
```

## useReducer 介绍和简单使用

那`reducer`其实就是一个函数，这个函数接收两个参数，一个是状态，一个用来控制业务逻辑的判断参数。我们举一个最简单的例子。

```jsx
import React, { useReducer } from 'react';

function ReducerDemo() {
  // useReducer(callback, 默认值)
  const [count, dispatch] = useReducer((state, action) => {
    switch (action) {
      case 'add':
        return state + 1;
      case 'sub':
        return state - 1;
      default:
        return state;
    }
  }, 0);
  return (
    <div>
      <h1>现在的分数是{count}</h1>
      <button onClick={() => dispatch('add')}>Increment</button>
      <button onClick={() => dispatch('sub')}>Decrement</button>
    </div>
  );
}

export default ReducerDemo;
```

## useReducer 代替 redux 小案例

通过`color`状态共享组件包裹`Button`和`Area`组件，达到状态共享

- `color`状态共享组件提供`createContext`方法创建`ColorContext`，达到父子组件传值，通过`useReducer(reducer, 默认值)`得到`color, dispatch`达到状态管理
- `Area`引入`ColorContext`，通过`useContext（ColorContext）`获取默认颜色
- `Button`引入`useContext`，通过`useContext（ColorContext）`获取`dispatch`，通过点击事件更新颜色

```jsx
// color.js
// 颜色管理
import React, { createContext, useReducer } from 'react';

export const ColorContext = createContext();

export const UPDATE_COLOR = 'UPDATE_COLOR';

const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_COLOR:
      return action.color;
    default:
      return state;
  }
};

export const Color = props => {
  const [color, dispatch] = useReducer(reducer, 'blue');
  return <ColorContext.Provider value={{ color, dispatch }}>{props.children}</ColorContext.Provider>;
};
```

```jsx
// Button.js
import React, { useContext } from 'react';
import { ColorContext, UPDATE_COLOR } from './color';
function Button() {
  const { dispatch } = useContext(ColorContext);
  return (
    <div>
      <button
        onClick={() => {
          dispatch({ type: UPDATE_COLOR, color: 'red' });
        }}
      >
        红色
      </button>
      <button
        onClick={() => {
          dispatch({ type: UPDATE_COLOR, color: 'yellow' });
        }}
      >
        黄色
      </button>
    </div>
  );
}

export default Button;
```

```jsx
// Area.js
import React, { useContext } from 'react';
import { ColorContext } from './color';

function Area() {
  const color = useContext(ColorContext);
  return <h1 style={color}>字体颜色为{color.color}</h1>;
}

export default Area;
```

```jsx
// App.js

import React from 'react';

import { Color } from './color/color';
import Area from './color/Area';
import Button from './color/Button';

function App() {
  return (
    <div>
      <Color>
        <Area></Area>
        <Button></Button>
      </Color>
    </div>
  );
}

export default App;
```

## useMome 解决子组件重复执行的问题

`useMemo`主要用来解决使用 React hooks 产生的无用渲染的性能问题。使用 function 的形式来声明组件，失去了`shouldCompnentUpdate`（在组件更新之前）这个生命周期，也就是说我们没有办法通过组件更新前条件来决定组件是否更新。而且在函数组件中，也不再区分`mount`和`update`两个状态，这意味着函数组件的每一次调用都会执行内部的所有逻辑，就带来了非常大的性能损耗。

```jsx
import React, { useState, useMemo } from 'react';

// 父组件
function App() {
  const [xiaohong, setXiaohong] = useState('小红');
  const [zhiling, setZhiling] = useState('志玲');
  return (
    <div>
      <button onClick={() => setXiaohong(new Date().getTime())}>小红</button>
      <button onClick={() => setZhiling(new Date().getTime() + '志玲')}>志玲</button>
      <ChildComponent
        name={xiaohong}
        age={19}
      >
        {zhiling}
      </ChildComponent>
    </div>
  );
}

// 子组件
function ChildComponent({ name, age, children }) {
  // 初次渲染会触发，然后当 name 变化是才会触发子组件更新
  function changeXiaohong(name) {
    console.log('子组件 == 小红来了');
    return name + '小红向我们走来了';
  }
  // 使用 useMemo(回调, [变量]) 来控制 子组件 的渲染状态
  const actionXiaohong = useMemo(() => changeXiaohong(name), [name]);
  return (
    <>
      <div>{actionXiaohong}</div>
      <div>{children}</div>
    </>
  );
}

export default App;
```

## useRef 获取 DOM 和保存变量

```jsx
import React, { useRef, useState, useEffect } from 'react';

// 父组件
function App() {
  // 获取DOM
  const inputEl = useRef(null);
  const [text, setText] = useState('候飞');
  const textRef = useRef();
  useEffect(() => {
    // 保存变量
    textRef.current = text;
    console.log('textRef.current', textRef.current);
  });
  const onButtonClick = () => {
    inputEl.current.value = '心智';
    console.log(inputEl);
  };
  return (
    <div>
      <input
        type='text'
        ref={inputEl}
      />
      <button onClick={onButtonClick}>在input上显示文字</button>
      <ChildComponent />
      <br />
      <input
        type='text'
        value={text}
        onChange={e => {
          setText(e.target.value);
        }}
      />
    </div>
  );
}

// 子组件
function ChildComponent() {
  return (
    <>
      <div>小红</div>
      <div>18岁</div>
    </>
  );
}

export default App;
```

## 自定义 Hooks 函数

自定义 Hooks 函数偏向于功能，而组件偏向于界面和业务逻辑。

```jsx
import React, { useCallback, useState, useEffect } from 'react';

function useWinSize() {
  const [size, setSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  });
  const onResize = useCallback(() => {
    setSize({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    });
  }, []);
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  });
  return (
    <div>
      {size.width} * {size.height}
    </div>
  );
}

export default useWinSize;
```
