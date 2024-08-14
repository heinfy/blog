# vuex

## action 和 mutation

### 用法

在 `Vuex` 中，`actions` 和 `mutations` 是两种用于管理状态的核心概念，它们之间有以下区别：

1. Mutation：
   - `Mutation` 是一种更改 `Vuex` 中状态的方式。
   - `Mutation` 是同步的操作。
   - `Mutation` 中通常用于执行简单的状态更改，例如修改某个状态的值。
   - `Mutation` 是唯一可以修改 `Vuex` 中状态的地方。
   - 在组件中调用 `Mutation` 必须使用 `commit` 方法。

```js
mutations: {
  increment(state) {
    state.count++
  }
}

```

1. Action：
   - `Action` 类似于 `Mutation`，用于提交 `Mutation` 来改变状态。
   - `Action` 可以包含异步操作。
   - `Action` 中通常用于处理异步逻辑、封装一系列的 `Mutation` 操作、或者触发多个 `Mutation`。
   - `Action` 通过 `dispatch` 方法触发。

```js
actions: {
  incrementAsync({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

1. 异步操作：
   - `Mutation` 应该是同步函数，而 `Action` 可以是异步函数。
   - 在 `Action` 中执行异步操作，例如发起 HTTP 请求、定时器等。
   - 异步操作完成后，`Action` 可以提交 `Mutation` 来更新状态。

总的来说，`Mutation` 用于同步地更改状态，而 `Action` 则用于处理异步逻辑、封装多个 `Mutation` 操作、或者触发异步操作来提交 `Mutation`。在实践中，一般情况下，推荐将异步操作放在 `Action` 中处理，而不是直接放在组件中处理，这样能够更好地分离关注点，使代码更加清晰和易于维护。

### 原理

在 Vuex 源码中，Action 和 Mutation 的原理涉及到 Vuex 的 Store、Dispatcher、Watcher 等模块，以下是它们的基本原理：

**Mutation 的原理：**

1. **Store：** Vuex 的核心是 Store，它包含了应用中的状态 (State)，以及一些用于修改状态的方法 (Mutations)。
2. **Mutation：** Mutation 是用于修改状态的方法，它必须是同步函数。在 Vuex 内部，当调用 `commit` 方法提交一个 Mutation 时，实际上是通过 Dispatcher 将 Mutation 提交给 Store。
3. **Dispatcher：** Dispatcher 是一个简单的事件管理器，它负责管理 Action 和 Mutation 的分发。当你在组件中调用 `commit` 方法提交一个 Mutation 时，实际上是通过 Dispatcher 触发了相应的 Mutation。
4. **Watcher：** Watcher 是 Vuex 内部用于响应式地监视状态变化的模块。当一个 Mutation 被提交后，Watcher 会通知 Store 中的状态发生了变化，从而触发相应的更新。

**Action 的原理：**

1. **Action：** Action 用于提交异步操作和封装一系列的 Mutation 操作。Action 必须是一个函数，它接受一个与 Store 实例具有相同方法和属性的 context 对象，使它可以与 Store 实例进行交互。
2. **Store：** 当你在组件中调用 `dispatch` 方法来触发一个 Action 时，实际上是通过 Dispatcher 将 Action 提交给 Store。
3. **Dispatcher：** 类似于 Mutation，Dispatcher 负责管理 Action 的分发。当你在组件中调用 `dispatch` 方法提交一个 Action 时，实际上是通过 Dispatcher 触发了相应的 Action。
4. **Watcher：** Watcher 同样监视 Action 的执行情况。当一个 Action 被触发后，Watcher 会监视其执行过程，如果 Action 执行完成后有需要更新的 Mutation，Watcher 会通知 Store 进行状态的更新。

#### 总结：

在 Vuex 的源码中，Action 和 Mutation 的基本原理都是通过 Dispatcher 来分发和触发的。Mutation 是用于同步修改状态的方法，而 Action 则是用于提交异步操作和封装一系列 Mutation 操作的函数。Watcher 则负责监听状态的变化，确保状态的更新能够及时地反映到视图中。这些模块之间相互配合，形成了 Vuex 状态管理的基本原理。

## 如何知道Vuex 中的状态变化？

在 Vuex 中，你可以通过订阅 Store 的变化来获取状态的变化。Vuex 提供了一种监听状态变化的机制，让你可以在状态发生变化时执行一些特定的逻辑。这可以通过 `store.subscribe()` 方法来实现，它接受一个回调函数作为参数，在状态发生变化时会调用这个回调函数。

```js
// 引入 Vuex 和创建的 store
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

// 创建一个 Vuex Store 实例
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})

// 订阅状态变化
store.subscribe((mutation, state) => {
  console.log('状态变化了！新的状态是：', state)
})

// 在组件中触发 Mutation 来改变状态
store.commit('increment')
```

在上面的示例中，我们创建了一个 Vuex Store 实例，然后通过 `store.subscribe()` 方法订阅了状态变化。当我们在组件中触发了一个 Mutation 来改变状态时，`store.subscribe()` 中的回调函数会被调用，并且会输出新的状态。这样就可以在状态发生变化时执行一些自定义的逻辑了。

需要注意的是，订阅状态变化的回调函数会接收两个参数：一个是表示发生了哪个 Mutation 的对象，另一个是表示最新的状态的对象。
