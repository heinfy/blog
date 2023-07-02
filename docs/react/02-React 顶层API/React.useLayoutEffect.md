# React.useLayoutEffect

- [React.useLayoutEffect](https://zh-hans.reactjs.org/docs/hooks-reference.html#uselayouteffect)
- [React—攻克 Hooks 之 useLayoutEffect](https://zhuanlan.zhihu.com/p/147173241)

## 介绍

其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。

尽可能使用标准的 useEffect 以避免阻塞视觉更新。

## useLayoutEffect 和 useEffect 的区别

布局副作用：

- useEffect 在浏览器渲染完成后执行
- useLayoutEffect 在浏览器渲染前执行

特点：

- useLayoutEffect 总是比 useEffect 先执行
- useLayoutEffect 里面的任务最好影响了 Layout（布局）
