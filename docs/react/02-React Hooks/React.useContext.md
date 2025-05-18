# React.useContext

在 React 库中，使用 React.createContext() 方法来创建一个上下文（context），用于在组件树中进行数据传递。

> **类组件只能通过 Consumer 接受数据**
>
> **函数组件能通过 Consumer 和 useContext 接受数据**

1. 通过 `React.createContext()` 创建上下文；
2. 通过 `<Privider value={value}>` 包裹组件
3. 通过 `useContext()` 使用上下文的值

demo：

```jsx
import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();
const { Provider, Consumer } = ThemeContext;

export default class Parent extends React.Component {
  render() {
    return (
      <Provider value={'green'}>
        <h1>Parent</h1>
        <Son />
      </Provider>
    );
  }
}

class Son extends React.Component {
  render() {
    return (
      <>
        <h2>Son</h2>
        <GrandSon1 />
        <GrandSon2 />
        <GrandSon3 />
      </>
    );
  }
}

class GrandSon1 extends React.Component {
  render() {
    return (
      <>
        <h3>GrandSon1</h3>
        <Consumer>{data => <span>呼伦贝尔的颜色是{data}</span>}</Consumer>
      </>
    );
  }
}

const GrandSon2 = () => {
  let theme = useContext(ThemeContext);
  return (
    <>
      <h3>GrandSon2</h3>
      <span>呼伦贝尔的颜色是{theme}</span>
    </>
  );
};

const GrandSon3 = () => {
  return (
    <>
      <h3>GrandSon3</h3>
      <Consumer>{data => <span>呼伦贝尔的颜色是{data}</span>}</Consumer>
    </>
  );
};
```

## 链接

- [useContext](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecontext)
