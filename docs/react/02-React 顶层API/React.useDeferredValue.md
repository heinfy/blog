# useDeferredValue

seDeferredValue：可以让状态滞后派生，与 useTransition 功能类似，推迟屏幕优先级不高的部分。

在一些场景中，渲染比较消耗性能，比如输入框。输入框的内容去调取后端服务，当用户连续输入的时候会不断地
调取后端服务，其实很多的片段信息是无用的，这样会浪费服务资源， React 的响应式更新和 JS 单线程的特性
也会导致其他渲染任务的卡顿。而 useDeferredValue 就是用来解决这个问题的。

> 问：useDeferredValue 和 useTransition 怎么这么相似，两者有什么异同点？
>
> 答：useDeferredValue 和 useTransition 从本质上都是标记成了过渡更新任务，不同点在于
> useDeferredValue 是将原值通过过渡任务得到新的值， 而 useTransition 是将紧急更新任务变为过渡任务。
>
> 也就是说，useDeferredValue 用来处理数据本身，useTransition 用来处理更新函数。

**基本使用：**

```ts
const deferredValue = useDeferredValue(value);
```

**Params：**

- value：接受一个可变的值，如`useState`所创建的值。

**Result：**

- deferredValue：返回一个延迟状态的值。

**基本用法：**

```tsx
import { useState, useDeferredValue } from 'react';
import { Input } from 'antd';

const getList = (key: any) => {
  const arr = [];
  for (let i = 0; i < 10000; i++) {
    if (String(i).includes(key)) {
      arr.push(<li key={i}>{i}</li>);
    }
  }
  return arr;
};

const Index: React.FC<any> = () => {
  //订阅
  const [input, setInput] = useState('');
  const deferredValue = useDeferredValue(input);
  console.log('value：', input);
  console.log('deferredValue：', deferredValue);

  return (
    <>
      <div>大家好，我是小杜杜，一起玩转Hooks吧！</div>
      <Input
        value={input}
        onChange={(e: any) => setInput(e.target.value)}
      />
      <div>
        <ul>{deferredValue ? getList(deferredValue) : null}</ul>
      </div>
    </>
  );
};

export default Index;
```

**效果：**

![img](assets/a58cbd54cd4248d2a118b3cb47ec64a0tplv-k3u1fbpfcp-jj-mark1890000q75.avis)

上述的功能类似于搜索，从 1w 个数中找到输入框内的数。

> 问：什么场景下使用`useDeferredValue` 和 `useTransition` ？
>
> 答：通过上面的两个例子介绍我们知道，useDeferredValue 和 useTransition 实际上都是用来处理数据量大的
> 数据，比如，百度输入框、散点图等，都可以使用。它们并不适用于少量数据。
>
> 但在这里更加推荐使用 useTransition，因为 useTransition 的性能要高于 useDeferredValue，除非像一些第
> 三方的 Hooks 库，里面没有暴露出更新的函数，而是直接返回值，这种情况下才去考虑使用
> useDeferredValue。
>
> 这两者可以说是一把双刃剑，在数据量大的时候使用会优化性能，而数据量低的时候反而会影响性能。
