# Observer (观察者)模式

Observer 是一种设计模式，其中，一个对象(称为 subject)维持一系列依赖于它(观察者)的对象，将有关状态的任何变更自动通知给它们。

当一个目标需要告诉观察者发生了什么有趣的事情，它会向观察者广播一个通知(可以包括与通知主题相关的特定数据)。

当我们不再希望某个特定的观察者获得其注册目标发出的改变通知时，该目标可以将它从观察者列表中删除。

实现 Observer 模式:

- `Subject` (日标)：维护一系列的观察者，方便添加或删除观察者

- `Observer` (观蔡者)：为那些在目标状态发生改变时需获得通知的对象提供一个更新接口

- `ConcreteSubject` (具体目标)：状态发生改变时，向 Observer 发出通知，储存 ConcreteObserver 的状态

- `ConcreteObserver` (具体观察者)：存储一个指向 ConcreteSubject 的引用，实现 Observer 的更新接口，以使自身状态与目标的状态保持一致

来模拟一个目标可能拥有的一系列依赖 Observer：

```js
// 模拟一个目标可能拥有的一系列依赖 Observer
function ObserverList() {
  this.observerList = [];
}

ObserverList.prototype.Add = function (obj) {
  return this.observerList.push(obj);
};

ObserverList.prototype.Empty = function () {
  this.observerList = [];
};

ObserverList.prototype.Count = function () {
  return this.observerList.length;
};

ObserverList.prototype.Get = function (index) {
  if (index > -1 && index < this.observerList.length) {
    return this.observerList[index];
  }
};

ObserverList.prototype.Insert = function (obj, index) {
  var pointer = -1;
  if (index === 0) {
    this.observerList.unshift(obj);
  } else if ((index = this.observerList.length)) {
    this.observerList.push(obj);
    pointer = index;
  }
  return pointer;
};

ObserverList.prototype.IndexOf = function (obj, startIndex) {
  var i = startIndex,
    pointer = -1;
  while (i < this.observerList.length) {
    if (this.observerList[i] === obj) {
      pointer = i;
    }
    i++;
  }
  return pointer;
};

ObserverList.prototype.RemoveIndexAt = function (index) {
  if (index === 0) {
    this.observerList.unshift();
  } else if (index === this.observerList.length - 1) {
    this.observerList.pop();
  }
};

// extend 扩展对象
function extend(obj, extension) {
  for (const key in obj) {
    extension[key] = obj[key];
  }
}
```

模拟目标(Subject)和在观察者列表上添加、删除或通知观察者：

```js
// 模拟目标 Subject
function Subject() {
  this.observers = new ObserverList();
}

Subject.prototype.AddObserver = function (observer) {
  this.observers.Add(observer);
};

Subject.prototype.RemoveOberver = function (observer) {
  this.observers.RemoveIndexAt(this.observers.IndexOf(observer, 0));
};

Subject.prototype.Notify = function (context) {
  var observerCount = this.observers.Count();
  for (let i = 0; i < observerCount; i++) {
    this.observers.Get(i).Update(context);
  }
};

// 定义一个框架来创建新的 Observer。这里的Update 功能将在后面的自定义行为
function Observer() {
  this.Update = function () {
    // ...
  };
}
```

## demo

- 用于向页面添加新可见 checkbox 的按钮
- 控制 checkbox，将充当一个目标，通知其他 checkbox 需要进行检查
- 用于添加新 checkbox 的容器

定义 ConcreteSubject 和 ConcreteObserver 处理程序，以便向页面添加新观察者并实现更新界面。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="./observer.js"></script>
    <title>Observer</title>
  </head>
  <body>
    <button id="addNewObserver">Add New Observer checkbox</button>
    <input
      type="checkbox"
      id="mainCheckbox"
    />
    <div id="observersContainer"></div>

    <script>
      var controlCheckbox = document.getElementById('mainCheckbox'),
        addBtn = document.getElementById('addNewObserver'),
        container = document.getElementById('observersContainer');

      // 具体目标 Concreate Subject
      // 利用 Subject 扩展 controlCheckbox
      extend(new Subject(), controlCheckbox);

      console.log('被观察的目标', controlCheckbox);

      // 点击 Subject 会触发通知到观察者上
      controlCheckbox['onclick'] = new Function('controlCheckbox.Notify(controlCheckbox.checked)');

      // 添加新的观察者
      addBtn['onclick'] = AddNewObserver;

      // 具体观察者 Concrete Observer
      function AddNewObserver() {
        // 创建需要添加新的checkbox
        var check = document.createElement('input');
        check.type = 'checkbox';

        // 利用 Observer 类扩展 checkbox
        extend(new Observer(), check);

        // 重写自定义更新行为
        check.Update = function (value) {
          this.checked = value;
        };

        // 为主 subject 的观察者列表添加新的观察者
        controlCheckbox.AddObserver(check);

        // 将观察者附件到容器中
        container.appendChild(check);
      }
    </script>
  </body>
</html>
```

## 发布/订阅模式

```js
var pubsub = {};
(function (q) {
  // 回调函数存放的数组
  var topics = {},
    subUid = -1;
  // 发布或广播事件，包含特定的 topic 名称和参数(比如传递的数据)
  q.publish = function (topic, args) {
    if (!topics[topic]) {
      return false;
    }
    var subscribers = topics[topic],
      len = subscribers ? subscribers.length : 0;
    while (len--) {
      subscribers[len].func(topic, args);
    }
    return this;
  };
  // 通过特定的名称和回调函数订阅事件，topic/event 触发时执行事件
  q.subscribe = function (topic, func) {
    if (!topics[topic]) {
      topics[topic] = [];
    }
    var token = (++subUid).toString();
    topics[topic].push({
      token: token,
      func: func
    });
    return token;
  };
  // 基于订阅上的标记引用，通过特定 topic 取消订阅
  q.unsubscribe = function (token) {
    for (var m in topics) {
      if (topics[m]) {
        for (var i = 0, j = topics[m].length; i < j; i++) {
          if (topics[m][i].token === token) {
            topics[m].splice(i, 1);
            return token;
          }
        }
      }
    }
    return this;
  };
})(pubsub);

// 简单的消息记录器记承所有通过订者接收到的主题(topie)和数器
var messagelogger = function (topics, data) {
  console.log('Logging' + topics + ' => ' + JSON.stringify(data));
};
var topicName = 'inbox/newMessage';
//订阅者监听订阅的 topic;一旦该topc广播一个通知，订着数调用回调函数
var subscription = pubsub.subscribe(topicName, messagelogger);
// 发布者负责发布程序感兴趣的 topic或通知，例如:
pubsub.publish(topicName, 'hello world!');
// 或者
pubsub.publish(topicName, ['test', 'a', 'b', 'c']);
// 或者
pubsub.publish(topicName, { sender: 'hello@google.com', body: 'Hey again!' });
// 如果订阅者不想被通知了，也可以取消订阅
pubsub.unsubscribe('0');
//一旦取消订阅，下面的代码执行后将不会记录消息，因为订阅者不再进行监听了
pubsub.publish(topicName, 'Hello! are you still there?');
```

### 用户界面通知

接下来，假设我们有一个负责显示实时股票信息的 Web 应用程序。

该应用程序有一个显示股票统计的网格和一个显示最后更新点的计数器。当数据模型改变时，应用程序需要更新网格和计数器。在这种情况下，目标(它将发布主题/通知)就是数据模型，观察者就是网格和计数器。

当观察者接收到 Model(模型)自身已经改变的通知时，则可以相应地更新自己。

在我们的实现中，订阅者会监听 newDataAvailable 这个 topic 以探测是否有新的股票信息。如果新通知发布到这个 topic，它将触发 gridUpdate 向包含股票信息的网格添加一个新行。它还将更新一个 last updated 计数器来记录最后一次添加的数据。

```js
var pubsub = {};
(function (q) {
  // 回调函数存放的数组
  var topics = {},
    subUid = -1;
  // 发布或广播事件，包含特定的 topic 名称和参数(比如传递的数据)
  q.publish = function (topic, args) {
    if (!topics[topic]) {
      return false;
    }
    var subscribers = topics[topic],
      len = subscribers ? subscribers.length : 0;
    while (len--) {
      subscribers[len].func(topic, args);
    }
    return this;
  };
  // 通过特定的名称和回调函数订阅事件，topic/event 触发时执行事件
  q.subscribe = function (topic, func) {
    if (!topics[topic]) {
      topics[topic] = [];
    }
    var token = (++subUid).toString();
    topics[topic].push({
      token: token,
      func: func
    });
    return token;
  };
  // 基于订阅上的标记引用，通过特定 topic 取消订阅
  q.unsubscribe = function (token) {
    for (var m in topics) {
      if (topics[m]) {
        for (var i = 0, j = topics[m].length; i < j; i++) {
          if (topics[m][i].token === token) {
            topics[m].splice(i, 1);
            return token;
          }
        }
      }
    }
    return this;
  };
})(pubsub);

// 使用传递给订阅者的数据 data 更新网格
gridUpdate = function (topic, data) {
  if (data !== 'undefined') {
    addGridRow(data);
    updateCounter(data);
  }
};

//在newDataAvailable topic上创建一个订阅
var subscriber = pubsub.subscribe('newDataAvailable', gridUpdate);

//返回稍后界面上要用到的当前本地时间
getCurrentTime = function () {
  var date = new Date(),
    m = date.getMonth() + 1,
    d = date.getDate(),
    y = date.getFullYear(),
    t = date.toLocaleDateString().toLowerCase();
  return m + '/' + d + '/' + y + ' ' + t;
};

// 向网格组件上添加新数据行
function addGridRow(data) {
  console.log('向网格组件上添加新数据行 => ' + JSON.stringify(data));
}

//更新网格上的最新更新时间
function updateCounter(data) {
  console.log('更新时间: ' + getCurrentTime() + ' => ' + JSON.stringify(data));
}

//下面的代码描绘了数据层，一般应该使用 ajax 请求获取最新的数据后，告知程序有最新数据
//发布者更新gridUpdate topic来展示新数据项
pubsub.publish('newDataAvailable', {
  summary: 'Apple made $5 billion',
  identifier: 'APPL',
  ustockPrice: 570.91
});

pubsub.publish('newDataAvailable', {
  summary: 'Microsoft made $20 million',
  identifier: 'MSFT',
  stockPrice: 30.85
});
```

### 框架中的 demo

- on()：负责注册事件的监听器，指定事件触发时的回调函数。
- emit()：负责触发事件，可以通过传参使其在触发的时候携带数据 。
- off()：负责监听器的删除。

```js
class myEventEmitter {
  constructor() {
    this.eventMap = {};
  }
  on(type, handler) {
    if (!(handler instanceof Function)) {
      throw new Error('哥 你错了 请传一个函数');
    }
    if (!this.eventMap[type]) {
      this.eventMap[type] = [];
    }
    this.eventMap[type].push(handler);
  }
  emit(type, params) {
    if (this.eventMap[type]) {
      this.eventMap[type].forEach((handler, index) => {
        handler(params);
      });
    }
  }
  off(type, handler) {
    if (this.eventMap[type]) {
      this.eventMap[type].splice(this.eventMap[type].indexOf(handler) >>> 0, 1);
    }
  }
}

const myEvent = new myEventEmitter();

const testHandler = function (params) {
  console.log(`test事件被触发了，testHandler 接收到的入参是${params}`);
};

// 监听 test 事件
myEvent.on('test', testHandler);

// 在触发 test 事件的同时，传入希望 testHandler 感知的参数
myEvent.emit('test', 'newState');
```
