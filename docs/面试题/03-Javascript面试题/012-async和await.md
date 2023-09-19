# async await 的原理是什么?

- [co 模块](https://github.com/tj/co/blob/master/index.js)

`async` 和 `await` 是用于处理异步操作的 JavaScript 关键字。它们的原理涉及到 JavaScript 的事件循环和
Promise 对象。下面是它们的原理简要概述：

1. 异步函数（`async function`）：

   - 当你在函数前面加上 `async` 关键字时，它会告诉 JavaScript 解析器这是一个异步函数。
   - 异步函数总是返回一个 Promise 对象。

2. `await`关键字：

   - `await` 用于等待一个 Promise 对象解决（即完成）。
   - 在使用 `await` 关键字时，函数会暂停执行，直到等待的 Promise 对象状态变为 resolved（解决）或
     rejected（拒绝）。
   - 在等待期间，事件循环可以处理其他任务，确保 JavaScript 应用程序保持响应性。

3. 事件循环（Event Loop）：

   - JavaScript 是单线程的，但它可以处理异步操作，这是通过事件循环来实现的。
   - 事件循环是一种机制，它允许 JavaScript 在等待异步操作完成时执行其他任务。
   - 当一个异步操作完成后，它会将相关的回调函数推入消息队列（Callback Queue）中。
   - 事件循环会不断地检查消息队列，如果队列中有任务，就会执行它们。

综合起来，`async` 和 `await` 的原理允许你以更直观的方式编写异步代码，而不必使用回调函数或者手动处理
Promise 链。它们使得异步代码更易于理解和维护，同时仍然保持了 JavaScript 的单线程执行模型和事件循环机
制。这样，你可以在异步操作完成时方便地处理结果，而不必担心回调地狱（Callback Hell）或复杂的 Promise
链。
