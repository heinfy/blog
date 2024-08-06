# Proxy 的工作原理

`Proxy` 通过两个参数创建：

1. **目标对象**：你要代理的对象。
2. **处理器对象**：一个包含捕获器（trap）的对象，这些捕获器定义了代理的行为。

捕获器是方法，这些方法会在对目标对象执行特定操作时被调用。

捕获器是方法，这些方法会在对目标对象执行特定操作时被调用。

### 示例代码

以下是一个简单的示例，展示了如何使用 `Proxy` 来监听对象的属性读写操作：

```js
const target = {
    message1: "hello",
    message2: "everyone"
};

const handler = {
    get: function(obj, prop) {
        console.log(`Getting property '${prop}'`);
        return obj[prop];
    },
    set: function(obj, prop, value) {
        console.log(`Setting property '${prop}' to '${value}'`);
        obj[prop] = value;
        return true;
    }
};

const proxy = new Proxy(target, handler);

// 读取属性
console.log(proxy.message1); // Getting property 'message1' -> hello

// 写入属性
proxy.message2 = "world";    // Setting property 'message2' to 'world'
console.log(proxy.message2); // Getting property 'message2' -> world
```

### 常用的捕获器

`Proxy` 提供了多种捕获器，每个捕获器对应一种操作。以下是一些常用的捕获器：

- **get**：拦截属性访问。

```js
get(target, property, receiver) {
    // target: 目标对象
    // property: 被访问的属性名
    // receiver: 代理对象
}
```

- **set**：拦截属性设置。

```js
set(target, property, value, receiver) {
    // target: 目标对象
    // property: 被设置的属性名
    // value: 新值
    // receiver: 代理对象
}
```

- **has**：拦截 `in` 操作符。

```js
has(target, property) {
    // target: 目标对象
    // property: 被检查的属性名
}
```

- **deleteProperty**：拦截 `delete` 操作。

```js
deleteProperty(target, property) {
    // target: 目标对象
    // property: 被删除的属性名
}
```

- **ownKeys**：拦截 `Object.getOwnPropertyNames` 和 `Object.getOwnPropertySymbols`。

```js
ownKeys(target) {
    // target: 目标对象
}
```

- **apply**：拦截函数调用。

```js
apply(target, thisArg, argumentsList) {
    // target: 被调用的函数
    // thisArg: 函数的 this 绑定
    // argumentsList: 调用时的参数列表
}
```

### 监听数据变化的实际应用

可以使用 `Proxy` 实现对对象或数组的深度监听，以便在数据变化时进行特定操作（如自动更新 UI、记录日志等）。以下是一个监听嵌套对象变化的示例：

```js
function createReactiveObject(target) {
    return new Proxy(target, {
        get(target, property, receiver) {
            const value = Reflect.get(target, property, receiver);
            if (typeof value === 'object' && value !== null) {
                return createReactiveObject(value); // 深度监听嵌套对象
            }
            return value;
        },
        set(target, property, value, receiver) {
            const result = Reflect.set(target, property, value, receiver);
            console.log(`Property '${property}' set to '${value}'`);
            return result;
        }
    });
}

const obj = createReactiveObject({
    name: 'John',
    details: {
        age: 30,
        location: 'NY'
    }
});

// 访问属性
console.log(obj.name);       // John
console.log(obj.details.age); // 30

// 修改属性
obj.name = 'Doe';            // Property 'name' set to 'Doe'
obj.details.age = 31;        // Property 'age' set to '31'
```

在这个示例中，`createReactiveObject` 函数会递归地为嵌套对象创建 `Proxy`，从而实现深度监听。

### 总结

`Proxy` 提供了一种灵活的方式来拦截和自定义 JavaScript 对象的基本操作。通过使用 `Proxy`，我们可以轻松实现对数据变化的监听，并在数据发生变化时执行特定的逻辑。这对于构建响应式应用程序和框架（如 Vue.js、MobX 等）非常有用。

## 监听属性的添加

`Proxy` 可以通过捕获器 `set` 来监听属性的添加、修改和删除。当你向对象中添加一个新属性时，`set` 捕获器会被触发，从而允许你在属性被添加时执行自定义逻辑。

此外，`Proxy` 还提供了 `defineProperty` 和 `deleteProperty` 捕获器，可以更精确地拦截和处理属性的添加和删除操作。

### 通过 `set` 捕获器监听属性的添加

以下示例展示了如何使用 `Proxy` 的 `set` 捕获器来监听属性的添加：

```js
const handler = {
    set(target, property, value, receiver) {
        if (!target.hasOwnProperty(property)) {
            console.log(`Adding new property '${property}' with value '${value}'`);
        } else {
            console.log(`Setting property '${property}' to '${value}'`);
        }
        target[property] = value;
        return true;
    }
};

const target = {};
const proxy = new Proxy(target, handler);

proxy.existing = 1;   // Adding new property 'existing' with value '1'
proxy.existing = 2;   // Setting property 'existing' to '2'
proxy.newProp = 3;    // Adding new property 'newProp' with value '3'
```

### 综合示例

以下示例结合了 `set`、`defineProperty` 和 `deleteProperty` 捕获器，展示了如何全面监听属性的添加、修改和删除：

```js
const handler = {
    set(target, property, value, receiver) {
        if (!target.hasOwnProperty(property)) {
            console.log(`Adding new property '${property}' with value '${value}'`);
        } else {
            console.log(`Setting property '${property}' to '${value}'`);
        }
        target[property] = value;
        return true;
    },
    defineProperty(target, property, descriptor) {
        console.log(`Defining new property '${property}' with value '${descriptor.value}'`);
        Object.defineProperty(target, property, descriptor);
        return true;
    },
    deleteProperty(target, property) {
        if (property in target) {
            console.log(`Deleting property '${property}'`);
            delete target[property];
            return true;
        }
        return false;
    }
};

const target = {};
const proxy = new Proxy(target, handler);

// 添加属性
proxy.newProp = 42; // Adding new property 'newProp' with value '42'

// 修改属性
proxy.newProp = 100; // Setting property 'newProp' to '100'

// 定义属性
Object.defineProperty(proxy, 'anotherProp', {
    value: 200,
    writable: true,
    enumerable: true,
    configurable: true
}); // Defining new property 'anotherProp' with value '200'

// 删除属性
delete proxy.newProp; // Deleting property 'newProp'
```

通过上述示例，可以全面监控对象属性的添加、修改和删除操作，确保对对象变化的实时响应。这种机制在构建响应式系统（如 Vue.js）时非常有用。