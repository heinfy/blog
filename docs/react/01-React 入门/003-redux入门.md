# redux 入门

[Redux 中文文档](https://www.redux.org.cn/)

## 1.自述

作用：集中式管理 react 应用中多个组件共享的状态。

```bash
npm install --save redux
npm install --save react-redux
npm install --save-dev redux-devtools
```

### 要点

应用中所有的 state 都以一个对象树的形式储存在一个单一的 store 中。

惟一改变 state 的办法是触发 action，一个描述发生什么的对象。

为了描述 action 如何改变 state 树，你需要编写 reducers（reducer 只是一个接收 state 和 action，并返回新的 state 的函数）。

## 2.介绍

三大原则：

1. 单一数据源：
   > 整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。
2. State 是只读的
   > 唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。
3. 使用纯函数来执行修改
   > 为了描述 action 如何改变 state tree ，你需要编写 reducers。

## 3.基础

### Action

Action 是把数据从应用传到 store 的有效载荷。它是 store 数据的唯一来源。
一般来说你会通过 store.dispatch() 将 action 传到 store。

Action 本质上是 JavaScript 普通对象。我们约定，action 内必须使用一个字符串类型的 type 字段来表示将要执行的动作。
多数情况下，type 会被定义成字符串常量。当应用规模越来越大时，建议使用单独的模块或文件（actionTypes）来存放 action。

**我们应该尽量减少在 action 中传递的数据**

#### Action 创建函数

Action 创建函数 就是生成 action 的方法。“action” 和 “action 创建函数” 这两个概念很容易混在一起，使用时最好注意区分。

Redux 中只需把 action 创建函数的结果传给 dispatch() 方法即可发起一次 dispatch 过程。

```js
dispatch(addTodo(text));
dispatch(completeTodo(index));
```

或者创建一个 被绑定的 action 创建函数 来自动 dispatch：

```js
const boundAddTodo = text => dispatch(addTodo(text));
const boundCompleteTodo = index => dispatch(completeTodo(index));

// 然后直接调用它们：

boundAddTodo(text);
boundCompleteTodo(index);
```

store 里能直接通过 store.dispatch() 调用 dispatch() 方法，但是多数情况下你会使用 react-redux 提供的 connect() 帮助器来调用。bindActionCreators() 可以自动把多个 action 创建函数 绑定到 dispatch() 方法上。

demo:

```js
/*
 * action 类型
 */

export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

/*
 * 其它的常量
 */

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
};

/*
 * action 创建函数
 */

export function addTodo(text) {
  return { type: ADD_TODO, text };
}

export function toggleTodo(index) {
  return { type: TOGGLE_TODO, index };
}

export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter };
}
```

### Reducer

Reducers 指定了应用状态的变化如何响应 actions 并发送到 store 的，记住 actions 只是描述了有事情发生了这一事实，并没有描述应用如何更新 state。

#### 设计 State 结构

以 todo 应用为例，需要保存两种不同的数据：

当前选中的任务过滤条件；
完整的任务列表。

```js
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
```

#### Action 处理

确定了 state 对象的结构，就可以开始开发 reducer。reducer 就是一个纯函数，接收旧的 state 和 action，返回新的 state。

保持 reducer 纯净非常重要。永远不要在 reducer 里做这些操作：

- 修改传入参数；
- 执行有副作用的操作，如 API 请求和路由跳转；
- 调用非纯函数，如 Date.now() 或 Math.random()。

**只要传入参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用，没有 API 请求、没有变量修改，单纯执行计算。**

以指定 state 的初始状态作为开始。Redux 首次执行时，state 为 undefined，此时我们可借机设置并返回应用的初始 state。

```js
import { VisibilityFilters } from './actions';

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
};

function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      });
    default:
      return state;
  }
}
```

> 不要修改 state。 使用 Object.assign() 新建了一个副本。
>
> 在 default 情况下返回旧的 state。遇到未知的 action 时，一定要返回旧的 state。

#### 处理多个 action

```js
import { ADD_TODO, TOGGLE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters } from './actions';

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
};

function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      });
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      });
    default:
      return state;
  }
}
```

如上，不直接修改 state 中的字段，而是返回新对象。新的 todos 对象就相当于旧的 todos 在末尾加上新建的 todo。而这个新的 todo 又是基于 action 中的数据创建的。

最后，TOGGLE_TODO 的实现也很好理解：

```js
case TOGGLE_TODO:
  return Object.assign({}, state, {
    todos: state.todos.map((todo, index) => {
      if (index === action.index) {
        return Object.assign({}, todo, {
          completed: !todo.completed
        })
      }
      return todo
    })
  })
```

#### 拆分 Reducer

查看：[Reducer](https://www.redux.org.cn/docs/basics/Reducers.html)

### Store

**store** 就是把它们联系到一起的对象。Store 有以下职责：

- 维持应用的 state；
- 提供 [`getState()`](https://www.redux.org.cn/docs/api/Store.html#getState) 方法获取 state；
- 提供 [`dispatch(action)`](https://www.redux.org.cn/docs/api/Store.html#dispatch) 方法更新 state；
- 通过 [`subscribe(listener)`](https://www.redux.org.cn/docs/api/Store.html#subscribe) 注册监听器;
- 通过 [`subscribe(listener)`](https://www.redux.org.cn/docs/api/Store.html#subscribe) 返回的函数注销监听器。

根据已有的 reducer 来创建 store 是非常容易的。在[前一个章节](https://www.redux.org.cn/docs/basics/Reducers.html)中，我们使用 [`combineReducers()`](https://www.redux.org.cn/docs/api/combineReducers.html) 将多个 reducer 合并成为一个。现在我们将其导入，并传递 [`createStore()`](https://www.redux.org.cn/docs/api/createStore.html)。

```js
import { createStore } from 'redux';
import todoApp from './reducers';
let store = createStore(todoApp);
```

[`createStore()`](https://www.redux.org.cn/docs/api/createStore.html) 的第二个参数是可选的, 用于设置 state 初始状态。这对开发同构应用时非常有用，服务器端 redux 应用的 state 结构可以与客户端保持一致, 那么客户端可以将从网络接收到的服务端 state 直接用于本地数据初始化。

```js
let store = createStore(todoApp, window.STATE_FROM_SERVER);
```

#### 发起 Actions

略

### 数据流

严格的单向数据流是 Redux 架构的设计核心。

Redux 应用中数据的生命周期遵循下面 4 个步骤：

1. **调用** [`store.dispatch(action)`](https://www.redux.org.cn/docs/api/Store.html#dispatch)。
2. **Redux store 调用传入的 reducer 函数。**
3. **根 reducer 应该把多个子 reducer 输出合并成一个单一的 state 树。**
4. **Redux store 保存了根 reducer 返回的完整 state 树。**
