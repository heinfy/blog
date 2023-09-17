---
id: MongooDB
title: MongooDB
description: MongooDB
keywords: [Liunx]
tags:
  - Liunx
hide_title: true
sidebar_position: 2
custom_edit_url: null
---

参考资料：

- [MONGODB 手册](https://docs.mongodb.com/manual/)
- [Express 教程 3：使用数据库 (Mongoose)](https://developer.mozilla.org/zh-CN/docs/Learn/Server-side/Express_Nodejs/mongoose)
- [mongoose guide](http://www.mongoosejs.net/docs/guide.html)

## MongooDB 的基础语法

### 基本操作

`CMD` 输入 `mongo` 进入数据库操作

```bash
show dbs #  显示所有数据库
use test # 进入test数据库
db # 当前所处的数据库
show collections # 显示数据库中所有的集合，当集合中没有数据时不会显示该集合
```

### CRUD

向数据库中插入文档：

```bash
db.<collecetion>.insert(document)
# 向test数据库中插入stus集合中插入一个新的学生对象
db.stus.insert(
  {name: "小明", gender: "男"}
)
# 向test数据库中插入teather集合中插入2个新的老师对象
db.teather.insert([
  {name: "马云", gender: "男"},
  {name: "马化腾", gender: "男"}
])
db.stus.insertOne() # 插入一个
db.stus.insertMany() # 插入多个
```

读取数据库中插入的文档：

`db.<collection>.find(query, projection)`

| 参数         | 类型     | 说明                                                                                               |
| :----------- | :------- | :------------------------------------------------------------------------------------------------- |
| `query`      | document | 可选的。使用查询操作符指定选择筛选器。若要返回集合中的所有文档，请省略此参数或传递一个空文档({})。 |
| `projection` | document | 可选的。指定要在文档中返回与查询筛选器匹配的字段。要返回匹配文档中的所有字段，请省略此参数。       |

```bash
# 读取集合所有数据
db.<collection>.find(query, projection) # 或
db.<collection>.find({})

# 按条件查询：
db.stus.find({name: "白骨精"}) # 返回的是数组
db.stus.findOne({gender: "女", name: "白骨精" }) # 返回的是对象

# 读取集合的文档符合条件的数量
db.stus.find({name: "白骨精"}).count()
db.stus.find().count()
```

```bash
# 向 bios 集合插入如下文档
{
    "_id" : <value>,
    "name" : { "first" : <string>, "last" : <string> },       // embedded document
    "birth" : <ISODate>,
    "death" : <ISODate>,
    "contribs" : [ <string>, ... ],                           // Array of Strings
    "awards" : [
        { "award" : <string>, year: <number>, by: <string> }  // Array of embedded documents
        ...
    ]
}

# 全部查询
db.bios.find() # 查询所有数据
# 标准查询
db.bios.find( { _id: 5 } ) # 查询_id 为5的数据
db.bios.find( { "name.last": "Hopper" } ) # 查询 name 对象下的 last 属性值为 Hopper 的所有数据
# 使用运算符的查询
db.bios.find(
   { _id: { $in: [ 5, ObjectId("507c35dd8fada716c89d0013") ] } }
) # 使用$in操作符返回id等于5或ObjectId的bios集合中的文档(“507c35dd8fada716c89d0013”)
db.bios.find( { birth: { $gt: new Date('1950-01-01') } } ) # 查询 生日大于 new Date('1950-01-01') 的文档
db.bios.find(
   { "name.last": { $regex: /^N/ } }
) # 查询 name 对象下的 last 属性值符合 /^N/表达式 的所有数据

# 查询范围

# 查询 生日大于 new Date('1940-01-01') 小于 new Date('1960-01-01' 的文档
db.bios.find( { birth: { $gt: new Date('1940-01-01'), $lt: new Date('1960-01-01') } } )

# 查询 生日大于 new Date('1920-01-01') 并且 death 为 false 的文档
db.bios.find( {
   birth: { $gt: new Date('1920-01-01') },
   death: { $exists: false }
} )

# 查询精确匹配嵌入的文档
db.bios.find(
    { name: { first: "Yukihiro", last: "Matsumoto" } }
) # 查询 name 对象为 { first: "Yukihiro", last: "Matsumoto" } 的文档（包括顺序，并且不能包含其他属性）

# 嵌入式文档的查询字段
db.bios.find(
   {
     "name.first": "Yukihiro",
     "name.last": "Matsumoto"
   }
) # 其中嵌入的文档名称包含第一个值为“Yukihiro”的字段和最后一个值为“Matsumoto”的字段。

# 查询数组元素

db.bios.find( { contribs: "UNIX" } ) # 查询数组字段contribs包含元素“UNIX”
db.bios.find( { contribs: { $in: [ "ALGOL", "Lisp" ]} } ) # 数组字段设计包含元素“ALGOL”或“Lisp”
db.bios.find( { contribs: { $all: [ "ALGOL", "Lisp" ] } } ) # 数组字段设计包含元素“ALGOL”和“Lisp”
db.bios.find( { contribs: { $size: 4 } } ) # contribs的数组大小为4
# 阅读文档： https://docs.mongodb.com/manual/reference/method/db.collection.find/#query-an-array-of-documents
```

更新当前集合中的文档

```bash
db.<collecetion>.update(查询条件, 修改条件)
- update 会默认将 新对象 替换 旧对象
- 如果是修改指定的属性，而不是替换，需要使用“替换操作符”来完成修改
 $set 可以用来修改文档中的指定的属性
 $unset 可以用来删除文档中的指定的属性

db.stus.update(
  {gender: "女", name: "蜘蛛精" },
  {gender: "男", name: "孙悟空", age: 30 }
)
db.stus.update({name: "one" }, {
  $set: {
    gender: "男",
    name: " 猪八戒",
    addr: "高老庄"
  }
}, {
  multi: true
})

```

删除集合中的文档

```bash
db.<collecetion>.remove(
  删除条件,
  是否删除一个<true为删除一个，默认false>
)
# 会删除符合条件的所有数据
# 如果传递一个空对象，会把所有数据删除
db.<collecetion>.remove({}) # 性能较差，删除数据，但是不清空集合
db.<collecetion>.deleteOne(删除条件)
db.<collecetion>.deleteMany(删除条件)
show collecetions
db.dropDatabase() # 删除 数据库
db.<collecetion>.drop() # 清空集合
```

### 测试案例

```bash
# 向数据库插入数据
db.stus.insert([
  {name: "one", gender: "男", age: 18},
  {name: "two", gender: "男", age: 31},
  {name: "three", gender: "男", age: 48},
  {name: "four", gender: "男", age: 52}
])

# 查询 name 包含 “精” 的文档
db.stus.find(
   { "name": { $regex: /精/ } }
)
#! sort limit skip 可以任意顺序调用
# 查询所有数据，并按照年龄的升序排列, num的降序排列， 1是升序，-1是降序
db.stus.find().sort(age: 1, num: -1)
# 投影： 只显示 name addr 列 1是显示， 0不显示
db.stus.find({}, {name: 1, addr: 1, _id: 0}).sort({age: 1})
# 查询 age 大于 18的数据
db.stus.find({
  age: {
    $gt: 20
  }
})
# 更新数据
db.stus.update(
  {gender: "女", name: "蜘蛛精" },
  {gender: "男", name: "孙悟空", age: 30 }
)
# 将 name 为 one 替换掉
db.stus.update({name: "one" }, {
  $set: {
    gender: "男",
    name: " 猪八戒",
    addr: "高老庄"
  }
}, {
  multi: true
})
# 所有的 name 为 孙悟空的文档 添加 addr 属性
db.stus.updateMany({name: "孙悟空" }, {
  $set: {
    addr: "花果山"
  }
})
# 为一个name 为 孙悟空 添加 addr 属性
db.stus.updateOne({name: "孙悟空" }, {
  $unset: {
    addr: "花果山"
  }
})
db.stus.replaceOne({name: "孙悟空" }, {
  gender: "男",
  name: "孙悟空",
  addr: "花果山"
})

# 删除文档
# 删除 name 为 孙悟空 的文档
db.stus.remove({ name: "孙悟空" })
```

## document 之间的关系

- 一对一

```bash
# 夫妻关系 mongoDB 的内嵌文档
db.wifeAndHasband.insert({
  name: "黄蓉",
  hasband: {
    name: "郭靖"
  }
})
```

- 一对多/多对一

```bash
# 用户（users） - 订单（orders） 关系
db.users.insert([
  username: '孙悟空',
  username: '猪八戒'
])

db.orders.insert({
  list: ["手机", "水果"],
  user_id: ObjectId("孙悟空的Id")
})
# 查找孙悟空的订单
var user_id = db.userdb.user.findOne({username: '孙悟空'})._id
db.orders.find({user_id: user_id})
```

- 多对多

```bash
# teachers - stuents 关系
db.teachers.insert([
  username: '江南七怪',
  username: '洪七公',
  username: '欧阳锋'
])
db.stuents.insert({
  name: "郭靖",
  teac_ids: [ObjectId("江南七怪的Id"), ObjectId("洪七公的Id")]
})
# 查找孙悟空的订单
var user_id = db.userdb.user.findOne({username: '孙悟空'})._id
db.orders.find({user_id: user_id})
```

## 后台与数据库交互

- 使用数据库的原生语言（例如 SQL）
- 使用对象数据模型（Object Data Model，简称 ODM）或对象关系模型（Object Relational Model，简称 ORM）
  。 ODM / ORM 能将网站中的数据表示为 JavaScript 对象，然后将它们映射到底层数据库。一些 ORM 只适用某
  些特定数据库，还有一些是普遍适用的。

使用 SQL 或其它受到支持的查询语言才能达到最佳性能。

ODM 通常慢一些，因为在对象和数据库格式之间存在一层用于映射的翻译代码，使它不一定会选用最高性能的数据
库查询（尤其是普遍使用级别的 ODM，它必须在各类数据库功能方面做出更大的折衷）。

使用 ORM 的好处是：程序员可以继续用 JavaScript 对象的思维而不用转向数据库语义的思维。 在（同一个或不
同网站）使用不同数据库时尤为明显。使用 ORM 还可以更方便地对数据进行验证和检查。

## Mongoose

- Mongoose 是在 node.js 异步环境下对 mongodb 进行便捷操作的对象模型工具

Mongoose 的优点：

- 可以为文档创建一个模式结构（Schema）
- 可以对模型中的对象/文档进行验证
- 数据可以通过类型转换为对象模型
- 可以使用中间件来应用业务逻辑挂钩
- 比 Node 原生的 MongoDB 驱动更容易 Mongoose 是最受欢迎的 ODM，选用 MongoDB 数据库时，它是一个合理的
  选择。

新的对象：

- Schema（模式对象） — Schema 对象定义约束了数据库中的文档结构
- Model — Model 对象作为集合中的所有文件的表示，相当于 MondoDB 数据库中的集合 collection
- Document — Document 表示集合中的具体文档，相当于集合中的一个具体的文档

### mongoose 连接数据库

```js
// 1.下载 npm init -y & npm i mongoose -S
// 2.引入 mongoose
const mongoose = require('mongoose');
// 4.监听mongoDB数据库的连接状态
mongoose.connection.once('open', () => {
  console.log('成功连接到 mongoDB 数据库');
});
mongoose.connection.once('close', () => {
  console.log('断开 mongoDB 数据库');
});
// 3.连接数据库
// mongoose.connect('mongodb://数据库ip地址:端口号(默认：27017)/数据库名')
mongoose.connect(
  'mongodb://127.0.0.1/test',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, db) => {
    console.log('连接数据库成功');
  }
);

// mongoose 断开连接
// mongoose.disconnect()
// 定义一个schema
const Schema = mongoose.Schema;
// model模型
const stuSchema = new Schema({
  name: String,
  age: Number,
  gender: {
    type: String,
    default: 'female'
  },
  address: String
});
// 创建一个 model -> collection # mogoose.model(modelName, schema)
const StuModel = mongoose.model('stus', stuSchema);
// 测试：创建一个文档插入到数据库中
// StuModel.create({
//   name: 'houfei',
//   age: 25,
//   gender: 'male',
//   address: '河北'
// }, err => {
//   if(!err) console.log('插入成功')
//   else console.log('插入失败')
// })
```

### Model 的 API

**document 是 model 的实例**

#### 插入

```js
// StuModel.create(object1, object2, ..., (err, object1, object2, ...) = > { })
// StuModel.create(array, (err, array) = > { })
StuModel.create(
  [
    {
      name: 'liming',
      age: 23,
      gender: 'male',
      address: '安徽'
    }
  ],
  (err, array) => {
    console.log(array);
    if (!err) console.log('插入成功');
    else console.log('插入失败');
  }
);
```

#### 查询数据

```js
/**
 * filter 查询条件
 * projection 投影
 * options 查询选项 skip limit
 * callback 回调函数
  Model.find(filter, [projection], [options], [callback])
  Model.findById()
  Model.findByIdAndDelete()
  Model.findByIdAndRemove()
  Model.findByIdAndUpdate()
  Model.findOne()
  Model.findOneAndDelete()
  Model.findOneAndRemove()
  Model.findOneAndReplace()
  Model.findOneAndUpdate()
*/
```

```js
// 在 StuModel 查询 name 为 jack，并且 age 大于 22的所有array文档，并且只显示 name age 属性，不显示 _id 属性， array并且要跳过 skip 第一条数据
StuModel.find({ name: 'jack', age: { $gte: 22 } }, 'name age -_id', { skip: 1 }, (err, docs) => {
  console.log(docs);
  if (!err) console.log('查询成功');
  else console.log('查询失败');
});
```

```js
StuModel.findOne({ age: { $gte: 19 } }, 'name age -_id', {}, (err, doc) => {
  console.log(doc);
  if (!err) console.log('查询成功');
  else console.log('查询失败');
});
```

```js
StuModel.findById('5ee9f47cf67607ea5eda6894', 'name', {}, (err, doc) => {
  console.log(doc instanceof StuModel);
  if (!err) console.log('查询成功');
  else console.log('查询失败');
});
```

#### 更新数据

```js
/*
Model.updateMany(filter, doc, [options], [callback])
Model.updateOne(filter, doc, [options], [callback])
Model.replaceOne(filter, doc, [options], [callback])
*/

StuModel.updateOne(
  { name: 'houfei' },
  {
    $set: {
      age: 1
    }
  },
  { multi: false },
  (err, status) => {
    console.log(status);
    if (!err) console.log('修改成功');
    else console.log('修改失败');
  }
);
```

#### 删除数据

```js
/*
Model.deleteMany(conditions, [options], [callback])
Model.deleteOne(conditions, [options], [callback])
*/

StuModel.deleteOne({ name: 'houfei' }, (err, state) => {
  console.log(state);
  if (!err) console.log('删除成功');
  else console.log('删除失败');
});
```

### Document 的 API

```js
// 创建 Document 对象
let stu = new StuModel({
  name: '李白',
  age: 30,
  gender: 'female',
  address: '四川'
});
```

#### [doc.save()](https://mongoosejs.com/docs/api/document.html#document_Document-save)

```js
// 保存方法 save
stu.save((err, state) => {
  console.log(state);
  if (!err) console.log('添加成功');
  else console.log('添加失败');
});
```

#### [doc.update()](https://mongoosejs.com/docs/api/document.html#document_Document-update)

```js
StuModel.findOne({}, (error, doc) => {
  /**
   * Document.prototype.update(doc, options, callback)
   * doc «Object»
   * options «Object»
   * callback «Function»
   */
  doc.update(
    {
      $set: {
        age: 1
      }
    },
    (err, status) => {
      console.log(status);
      if (!err) console.log('修改成功');
      else console.log('修改失败');
    }
  );
});
```

#### [doc.get()|.set()|id](https://mongoosejs.com/docs/api/document.html#document_Document-get)

```js
StuModel.findOne({}, (error, doc) => {
  console.log(doc.id);
  doc.get('address', String);
  doc.set('age', 99);
});
```

#### [doc.toJSON()|toObject](https://mongoosejs.com/docs/api/document.html#document_Document-toJSON)

```js
StuModel.findOne({}, (error, doc) => {
  let a = doc.toJSON();
  let b = doc.toObject();
  console.log(a, b);
});
```

### Mongoose 模块化

[ 视频地址](https://www.bilibili.com/video/BV1Lb411V7rv?p=19)

# MongoDB 入门

资料：

[菜鸟教程](https://www.runoob.com/mongodb/mongodb-tutorial.html)

## 基本概念

### NoSQL

NoSQL(NoSQL = Not Only SQL )，意即"不仅仅是 SQL"。

NoSQL，指的是非关系型的数据库。NoSQL 有时也称作 Not Only SQL 的缩写，是对不同于传统的关系型数据库的
数据库管理系统的统称。

NoSQL 用于超大规模数据的存储。（例如个人信息，社交网络，地理位置，用户生成的数据和用户操作日志）。这
些类型的数据存储不需要固定的模式，无需多余操作就可以横向扩展。

### 基本术语

| SQL 术语/概念 | MongoDB 术语/概念 | 解释/说明                              |
| :------------ | :---------------- | :------------------------------------- |
| database      | database          | 数据库                                 |
| table         | collection        | 数据库表/集合                          |
| row           | document          | 数据记录行/文档                        |
| column        | field             | 数据字段/域                            |
| index         | index             | 索引                                   |
| table joins   |                   | 表连接,MongoDB 不支持                  |
| primary key   | primary key       | 主键,MongoDB 自动将\_id 字段设置为主键 |

### 数据库

一个 mongodb 中可以建立多个数据库。

数据库命名规范：

- 不能是空字符串（"")。
- 不得含有' '（空格)、.、$、/、\和\0 (空字符)。
- 应全部小写。
- 最多 64 字节。

数据库保留字：`admin`、`local`、`config`

### 文档

RDBMS 与 MongoDB 对应的术语：

| RDBMS  | MongoDB                            |
| :----- | :--------------------------------- |
| 数据库 | 数据库                             |
| 表格   | 集合                               |
| 行     | 文档                               |
| 列     | 字段                               |
| 表联合 | 嵌入文档                           |
| 主键   | 主键 (MongoDB 提供了 key 为 \_id ) |

## 数据库基本操作

- MongoDB 连接

```bash
mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]

# mongodb://admin:123456@localhost/test
```

### CRUD

```bash
# 展示数据库
show dbs
# 创建或进入数据库（如果该数据库中没有数据，将不会 show dbs 中子展示出来）
use mydb
# 向mydb的mycol集合中插入一条数据
db.mycol.insert({"name": "houfei"})
# MongoDB 中默认的数据库为 test，如果你没有创建新的数据库，集合将存放在 test 数据库中。
```

- [创建/删除集合](https://www.runoob.com/mongodb/mongodb-create-collection.html)

`db.createCollection(name, options)`

```bash
# 创建或进入数据库（如果该数据库中没有集合时，将不会 show dbs 中子展示出来）
use mydb
# 创建mycol集合
db.createCollection("mycol")
# 在 MongoDB 中，你不需要创建集合。当你插入一些文档时，MongoDB 会自动创建集合。
db.mycol.insert({"name": "houfei"})

# 进入数据库
use mydb
# 查看已存在的集合
show collections
# 删除集合 mycol
db.mycol.drop()
```

- [文档的 CRUD](https://www.runoob.com/mongodb/mongodb-insert.html)

**插入文档**——`db.<collecetion>.insert(document)`

```bash
# 向test数据库中插入stus集合中插入一个新的学生对象
db.stus.insert(
  {name: "小明", gender: "男"}
)

# 向test数据库中插入teather集合中插入2个新的老师对象
db.teather.insert([
  {name: "马云", gender: "男"},
  {name: "马化腾", gender: "男"}
])

# db.stus.insertOne() 插入一个
# db.stus.insertMany() 插入多个
```

**查询文档**——`db.<collection>.find(query（查询条件）, projection（投影）)`

| 操作       |     格式     | 范例                                        | RDBMS 中的类似语句      |
| :--------- | :----------: | :------------------------------------------ | :---------------------- |
| 等于       |    `{:`}     | `db.col.find({"by":"菜鸟教程"}).pretty()`   | `where by = '菜鸟教程'` |
| 小于       | `{:{$lt:}}`  | `db.col.find({"likes":{$lt:50}}).pretty()`  | `where likes < 50`      |
| 小于或等于 | `{:{$lte:}}` | `db.col.find({"likes":{$lte:50}}).pretty()` | `where likes <= 50`     |
| 大于       | `{:{$gt:}}`  | `db.col.find({"likes":{$gt:50}}).pretty()`  | `where likes > 50`      |
| 大于或等于 | `{:{$gte:}}` | `db.col.find({"likes":{$gte:50}}).pretty()` | `where likes >= 50`     |
| 不等于     | `{:{$ne:}}`  | `db.col.find({"likes":{$ne:50}}).pretty()`  | `where likes != 50`     |

```bash
# 查询 “likes” 大于50，并且“by”为“菜鸟教程”或者“title”为“MongoDB 教程”的数据
db.col.find({
	"likes": {$gt:50},
	$or: [{"by": "菜鸟教程"},{"title": "MongoDB 教程"}]
}).pretty()
```

[_案例_](https://docs.mongodb.com/manual/reference/method/db.collection.find/#query-an-array-of-documents)

```bash
# 向 bios 集合插入如下文档
{
    "_id" : <value>,
    "name" : { "first" : <string>, "last" : <string> },       // embedded document
    "birth" : <ISODate>,
    "death" : <ISODate>,
    "contribs" : [ <string>, ... ],                           // Array of Strings
    "awards" : [
        { "award" : <string>, year: <number>, by: <string> }  // Array of embedded documents
        ...
    ]
}

# 全部查询
# 查询所有数据
db.bios.find()

# 标准查询
# 查询_id 为5的数据
db.bios.find( { _id: 5 } )
# 查询 name 对象下的 last 属性值为 Hopper 的所有数据
db.bios.find( { "name.last": "Hopper" } )

# 使用运算符的查询
# 使用$in操作符返回id等于5和ObjectId为(“507c35dd8fada716c89d0013”)的文档
db.bios.find(
   { _id: { $in: [ 5, ObjectId("507c35dd8fada716c89d0013") ] } }
)

# 查询 生日大于 new Date('1950-01-01') 的文档
db.bios.find(
	{ birth: { $gt: new Date('1950-01-01') } }
)

# 查询 name 对象下的 last 属性值符合 /^N/表达式 的所有数据
db.bios.find(
   { "name.last": { $regex: /^N/ } }
)

# 查询范围
# 查询 生日大于 new Date('1940-01-01') 小于 new Date('1960-01-01' 的文档
db.bios.find(
	{ birth: {
		$gt: new Date('1940-01-01'),
		$lt: new Date('1960-01-01')
  } }
)

# 查询 生日大于 new Date('1920-01-01') 并且 death 为 false 的文档
db.bios.find( {
   birth: { $gt: new Date('1920-01-01') },
   death: { $exists: false }
} )

# 查询精确匹配嵌入的文档
# 查询 name 对象为 { first: "Yukihiro", last: "Matsumoto" } 的文档（包括顺序，并且不能包含其他属性）
db.bios.find(
    { name: { first: "Yukihiro", last: "Matsumoto" } }
)

# 嵌入式文档的查询字段
# 其中嵌入的文档名称包含第一个值为“Yukihiro”的字段和最后一个值为“Matsumoto”的字段。
db.bios.find(
   {
     "name.first": "Yukihiro",
     "name.last": "Matsumoto"
   }
)

# 查询数组元素
# 查询数组字段contribs包含元素“UNIX”
db.bios.find( { contribs: "UNIX" } )

# 数组字段设计包含元素“ALGOL”或“Lisp”
db.bios.find( { contribs: { $in: [ "ALGOL", "Lisp" ]} } )

# 数组字段设计包含元素“ALGOL”和“Lisp”
db.bios.find( { contribs: { $all: [ "ALGOL", "Lisp" ] } } )

# contribs的数组大小为4
db.bios.find( { contribs: { $size: 4 } } )
```

[**更新文档**](https://www.runoob.com/mongodb/mongodb-update.html)

```bash
db.collection.update(
   <query>, # update的查询条件，类似sql update查询内where后面的。
   <update>, # 更新内容
   {
     upsert: <boolean>, # 如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入。
     multi: <boolean>, # 可选，mongodb 默认是false,是否只更新第一条
     writeConcern: <document> # 可选，抛出异常的级别。
   }
)
```

```bash
# db.<collecetion>.update(查询条件, 修改条件)
# - update 会默认将 新对象 替换 旧对象
# - 如果是修改指定的属性，而不是替换，需要使用“替换操作符”来完成修改
#  $set 可以用来修改文档中的指定的属性
#  $unset 可以用来删除文档中的指定的属性


db.stus.update(
  {gender: "女", name: "蜘蛛精" },
  {gender: "男", name: "孙悟空", age: 30 }
)

db.stus.update({name: "one" }, {
  $set: {
    gender: "男",
    name: " 猪八戒",
    addr: "高老庄"
  }
}, {
  multi: true
})
```

[**删除文档**](https://www.runoob.com/mongodb/mongodb-remove.html)

```bash
db.<collecetion>.remove(
  删除条件,
  是否删除一个<true为删除一个，默认false>
)
# 会删除符合条件的所有数据
# 如果传递一个空对象，会把所有数据删除

db.<collecetion>.remove({}) # 性能较差，删除数据，但是不清空集合

db.<collecetion>.deleteOne(删除条件)
db.<collecetion>.deleteMany(删除条件)


show collecetions
db.dropDatabase() # 删除 数据库
db.<collecetion>.drop() # 清空集合
```

### 条件操作符

```bash
$gt > $gte >=  $lt  < $lte <=  $ne !=  $eq  =
```

### $type 操作符

根据字符数据类型查询

```bash
db.col.insert([
	{title: 'PHP 教程'},
	{title: 'Java 教程'},
	{title: 'MongoDB 教程'}
])

# 查询 title 为 string 的文档
db.col.find({"title" : {$type : 2}})
或
db.col.find({"title" : {$type : 'string'}})
```

### Limit 与 Skip 方法

```bash
db.COLLECTION_NAME.find().limit(NUMBER) # 限制查询多少条
db.COLLECTION_NAME.find().skip(NUMBER) # 跳过多少条
```

### sort() 方法

```bash
db.col.find({}).sort({"likes":-1}) # 数据按字段 likes 的降序排列 1为升序 -1为降序
```

### createIndex() 方法

索引存储在一个易于遍历读取的数据集合中，索引是对数据库表中一列或多列的值进行排序的一种结构。

```bash
db.col.createIndex({"title":1})

# 1、查看集合索引
db.col.getIndexes()
# 2、查看集合索引大小
db.col.totalIndexSize()
# 3、删除集合所有索引
db.col.dropIndexes()
# 4、删除集合指定索引
db.col.dropIndex("索引名称")
```
