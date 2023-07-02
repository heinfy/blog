# React.useContext

- [useContext](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecontext)

作用：层级组件传值

1. 通过 `React.createContext()` 创建上下文；
2. 通过 `<xxx.Privider value={value}>` 包裹组件
3. 通过 `useContext()` 使用上下文的值

demo：

```jsx
import React, { useContext } from 'react';

const themes = {
  light: {
    foreground: 'red',
    background: 'green'
  },
  dark: {
    foreground: 'yellow',
    background: 'pink'
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  console.log(theme);
  return <button style={{ fontSize: 20, background: theme.background, color: theme.foreground }}>I am styled by theme context!</button>;
}

export default App;
```
