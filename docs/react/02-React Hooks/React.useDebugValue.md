# React.useDebugValue

`useDebugValue` 是 `React` 中的一个钩子函数，它用于在开发工具中显示有关自定义钩子的自定义标签和值，以便在开发过程中更好地理解和调试自定义钩子。

使用 `useDebugValue` 可以为自定义钩子提供额外的调试信息，这对于理解钩子的行为和用途非常有帮助。它不会影响实际运行时的代码，仅在开发工具中提供额外的信息。

## 介绍

`useDebugValue(value, (status) => {})`

- value：判断的值；
- callback：可选，这个函数只有在 Hook 被检查时才会调用，它接受 debug 值作为参数，并且会返回一个格式化的显示值。

以下是一个简单的示例，展示了如何在自定义钩子中使用 `useDebugValue`：

```jsx
import { useState, useEffect, useDebugValue } from 'react';

// 自定义钩子，用于获取窗口的宽度和高度
function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // 计算窗口尺寸的副作用
  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 使用 useDebugValue 显示调试信息
  useDebugValue('Window Dimensions', windowDimensions);

  return windowDimensions;
}

// 使用自定义钩子
function App() {
  const dimensions = useWindowDimensions();

  return (
    <div>
      <p>Window Width: {dimensions.width}</p>
      <p>Window Height: {dimensions.height}</p>
    </div>
  );
}

export default App;
```

在这个示例中，`useWindowDimensions` 是一个自定义钩子，用于获取窗口的宽度和高度。通过 `useDebugValue`，我们在开发工具中显示了一个自定义标签 "Window Dimensions" 和窗口尺寸的值，这样在调试时可以更方便地查看钩子的状态。

需要注意的是，`useDebugValue` 主要用于开发过程中，为了更好地调试和理解自定义钩子。在实际应用中，它不会影响代码的行为或性能。
