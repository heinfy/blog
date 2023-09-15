# React.useTransition

**useTransition：** 返回一个状态值表示过渡更新任务的等待状态，以及一个启动该过渡更新任务的函数。

> 问：什么是过渡更新任务？
>
> 答：过渡任务是对比紧急更新任务所产生的。
>
> 紧急更新任务指，输入框、按钮等任务需要在视图上立即做出响应，让用户立马能够看到效果的任务。
>
> 但有时，更新任务不一定那么紧急，或者说需要去请求数据，导致新的状态不能够立马更新，需要一个
> `loading...` 的状态，这类任务称为过渡任务。

我们再来举个比较常见的例子帮助理解紧急更新任务和过渡更新任务。

当我们有一个 `input` 输入框，这个输入框的值要维护一个很大列表（假设列表有 1w 条数据），比如说过滤、
搜索等情况，这时有两种变化：

1. input 框内的变化；
2. 根据 input 的值，1w 条数据的变化。

input 框内的变化是实时获取的，也就是受控的，此时的行为就是紧急更新任务。而这 1w 条数据的变化，就会有
过滤、重新渲染的情况，此时这种行为被称为过渡更新任务。

**基本使用：**

```ts
const [isPending, startTransition] = useTransition();
```

**Result：**

- isPending：布尔值，过渡状态的标志，为 true 时表示等待状态；
- startTransition：可以将里面的任务变成过渡更新任务。

**基本用法：**

```tsx
import { useState, useTransition } from 'react';
import { Input } from 'antd';

const Index: React.FC<any> = () => {
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState('');
  const [list, setList] = useState<string[]>([]);

  return (
    <>
      <div>大家好，我是小杜杜，一起玩转Hooks吧！</div>
      <Input
        value={input}
        onChange={e => {
          setInput(e.target.value);
          startTransition(() => {
            const res: string[] = [];
            for (let i = 0; i < 10000; i++) {
              res.push(e.target.value);
            }
            setList(res);
          });
        }}
      />
      {isPending ? <div>加载中...</div> : list.map((item, index) => <div key={index}>{item}</div>)}
    </>
  );
};

export default Index;
```

**效果：**

![img](assets/1c00e8c209274d39a9c9583bd14b7582tplv-k3u1fbpfcp-jj-mark1890000q75.avis)

从上述的代码可以看到，我们通过 input 去维护了 1w 条数据，通过 isPending 的状态来控制是否展示完成。

可以看出，useTransition 是为了处理大量数据而存在的，那么有些小伙伴可能会问，这种情况不应该用防抖吗？
为什么还会出现 useTransition 呢？

实际上防抖的本质是 `setTimeout`，也就是减少了渲染的次数，而 useTransition 并没有减少其渲染的次数，至
于具体的区别，在之后的源码篇中专门介绍，这里我们只要清楚 useTransition 的用法即可。
