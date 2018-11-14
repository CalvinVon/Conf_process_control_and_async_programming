title: JS流程控制和异步编程分享
speaker: Calvin Von
transition: pulse
theme: dark

[slide]
# JS流程控制和异步编程分享 {:.text-primary}
### 18/11/14 冯嘉辉

[slide]
# 同步（Synchronous） {:&.moveIn}

Javascript语言的执行环境是"单线程"（single thread）。
所谓"单线程"，就是指一次只能完成一件任务。如果有多个任务，就必须排队，前面一个任务完成，再执行后面一个任务，以此类推，所谓"同步"。

[slide]
# 异步（Asynchronous） {:&.moveIn}

所谓"异步"，简单说就是一个任务不是连续完成的，可以理解成该任务被人为分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。

[slide]
## ES6 诞生以前，异步编程的方法
---

- 回调函数（callback） {:&.moveIn}
- 事件监听（EventEmitter/EventListener）
- Promise 对象
- 发布/订阅（Publish/Subscribe）

[note]
cb,事件监听,发布/订阅 promise<br>
"天生异步"。<br>
异步编程对 JavaScript 语言太重要。Javascript 语言的执行环境是“单线程”的，如果没有异步编程，根本没法用，非卡死不可。
[/note]

[slide]
# Callback

> JavaScript 语言对异步编程的实现，就是回调函数。
[note]
callback => "重新调用"
[/note]

[slide]

Nodejs中，读取文件进行处理，是这样写的。

{:&.moveIn}
```js
fs.readFile('/etc/passwd', 'utf-8', function (err, data) {
  if (err) throw err;
  console.log(data);
});
```

上面代码中，`readFile`函数的第三个参数，就是回调函数。

{:&.moveIn}
> 原因是执行分成两段，第一段执行完以后，任务所在的**上下文环境**就已经结束了。在这以后抛出的错误，原来的上下文环境已经**无法捕捉**，只能当作参数，传入第二段。

```js
// 封装
function getSomething (callback) {
  http.get('/api/something')
    .then(res => {
      // 针对返回的数据做一些处理
      callback(null, res.data.list);
    })
    .catch(err => callback(err));
}
// 调用
getSomething((err, list) => {
  if (!err) {
    // ...
  }
})
```
[note]
（说明回调函数之后提问）
一个有趣的问题是，为什么 Node 约定，回调函数的第一个参数，必须是错误对象err（如果没有错误，该参数就是null）？<br>

那么问题来了，当存在很多个需要应用回调函数的场景怎么办 >> callback hell
[/note]

[slide]
# 事件监听
> 采用事件驱动模式<br>
任务的执行不取决于代码的顺序，而取决于某个事件是否发生。

[slide]
## 优点：

1. 比较容易理解。
2. 可以绑定多个事件，每个事件可以指定多个回调函数，
3. 可以"去耦合"，有利于实现模块化。

## 缺点：
整个程序都要变成事件驱动型，运行流程会变得很不清晰。

[slide]
# Promise对象
> “承诺”
Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了Promise对象。

[slide]
> 所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

- promise相当于一个**状态机**
<br>
promise的三种状态
<br>
`pending` 等待<br>
`fulfilled` 完成<br>
`rejected` 拒绝<br>
  一个promise的状态只可能从“等待”转到“完成”态或者“拒绝”态，不能逆向转换，同时“完成”态和“拒绝”态不能相互转换

[slide]
## 基本语法

- 创造一个Promise实例
```js
const promise = new Promise(function (resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */) {
    resolve(value);
  }
  else {
    reject(error);
  }
});
```
- Promise实例生成以后，可以用then方法分别指定`resolved`状态和`rejected`状态的回调函数。
```js
promise.then(
    function(value) {
      // success
    },
    function(error) {
      // failure
    }
);
```
[note]
Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。<br>
Promise 新建后就会立即执行。<br>
接下来 之前将的回调地狱
[/note]
[slide]
# "Callback Hell"
```js
// 调用之前封装好的 API 请求
getSomethingA((err, list) => {
  if (!err) {
    getSomethingB((err, list) => {
      if (!err) {
        getSomethingC((err, list) => {
          if (!err) {
            getSomethingD((err, list) => {
              if (!err) {
                // ...
                getSomethingE((err, list) => {
                  if (!err) {
                    // ...
                  }
                })
              }
            })
          }
        })
      }
    })
  }
})
```
## [promise 链式调用](../promise-chain.js)

[note]
promise-chain.js
[/note]

[slide]
## Promise其他方法

- Promise.prototype.finally() {:&.moveIn}
  > **ES2018**finally方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。
- Promise.all()
  > Promise.all方法用于将多个 Promise 实例，包装成一个新的 Promise 实例，当*全部状态*都变成`fulfilled`，返回的p变为fulfilled；否则有一个`rejected`，返回rejected
  ```js
  const p = Promise.all([p1, p2, p3]);
  ```
- Promise.race()
  > 同`Promise.all`方法，不同的是只要有一个实例率先改变状态，p的状态就跟着改变
- Promise.resolve()
- Promise.reject()
- 非ES6 原生方法：Promise.props, Promise.map 等更多的方法 [Bluebird库](http://bluebirdjs.com/docs/api-reference.html)


[slide]
# 发布/订阅

> 假定，存在一个"信号中心"，当某个任务执行完成，就可以向信号中心发布（publish）一个信号，其他任务可以向信号中心"订阅"（subscribe）这个信号，从而知道什么时候自己可以开始执行。
<br>
这就叫做"**发布/订阅模式**"（publish-subscribe pattern），又称"**观察者模式**"（observer pattern）。

<br>
## RxJS - Observable 可观察对象

<br>
- [ReativeX](http://reactivex.io/)
- [RxJS](https://rxjs-dev.firebaseapp.com/guide/observable)
[note]
RxJs三大概念<br>
Observable，Subscription，Subject（主题）<br>
单播，多播（组播）<br>
Observable可以发射多个值
[/note]

[slide]
## [Observable 与 Promise 的不同之处](https://angular.cn/guide/comparing-observables)

- **Observable**是声明式的，在被订阅之前，它不会开始执行。**Promise**是在创建时就立即执行的。

- **Observable**能够持续发射多个值。**Promise**只提供一个。这让**Observable**可用于随着时间的推移获取多个值。

- **Observable**能够持续发射多个值。**Promise**只提供一个。这让**Observable**可用于随着时间的推移获取多个值。

```js
import { Observable } from 'rxjs';

const observable = Observable.create(function (observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  setTimeout(() => {
    observer.next(4);
    observer.complete();
  }, 1000);
});
```

[slide]
# 第三方解决方案
- [async库](https://caolan.github.io/async/)
- Node.js q模块 [co模块](https://github.com/tj/co)

[slide]
# async 库
> async 在 node 环境和浏览器环境中均可使用
[slide]
有关集合 Collections 的方法

> async.each(coll, iteratee, callback)

```js
async.each(openFiles, function(file, callback) {

    // Perform operation on file here.
    console.log('Processing file ' + file);

    if( file.length > 32 ) {
      console.log('This file name is too long');
      callback('File name too long');
    } else {
      // Do work to process file here
      console.log('File processed');
      callback();
    }
}, function(err) {
    // if any of the file processing produced an error, err would equal that error
    if( err ) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log('A file failed to process');
    } else {
      console.log('All files have been processed successfully');
    }
});
```
{:&.moveIn}
> async.eachSeries
> async.map
> async.mapSeries
[note]
并行 与 顺序
[/note]

[slide]
有关流程控制 Control Flow 的方法

> async.waterfall(tasks, callback)

{:&.moveIn}

```js
async.waterfall(
[
  function (callback) {
    callback(null, "kyfxbl", 29);  
  },
  function (name, age, callback) {
    console.log(name); // kyfxbl  
    console.log(age); // 29  
    callback(null, 10000, 200);  
  },
  function (salary, bonus, callback) {
    console.log(salary);// 10000  
    console.log(bonus);// 200  
    callback(null, [1, 2, 3]);  
  }
],
function (err, results) {  
  if (err) return console.error(err);
  console.log(results); // [1, 2, 3]  
});
```
[note]
这个可能是async库中最重要的一个方法，可以解决callback嵌套的问题。<br>
上一个流程的执行结果，会传给下一个流程的参数。如果其中一个流程出错，则会中止后续流程的执行，直接调用最终的callback。否则最后一个流程的结果，会传递给最终callback
[/note]

[slide]
# ES6 原生解决方案
> generator/yield
Generator 函数是一个状态机，还是一个遍历器对象生成函数。

[slide]
[magic data-transition="move"]
## Generator 函数
====
## 协程（coroutine）

> **协程（coroutine）**是一种程序运行的方式，可以理解成“协作的线程”或“协作的函数”。协程既可以用单线程实现，也可以用多线程实现。前者是一种特殊的子例程，后者是一种特殊的线程。

====

- 协程适合用于多任务运行的环境。  {:&.moveIn}
与普通线程不同之处在于，同一时间可以有多个线程**处于运行状态**，但是运行的协程只能有**一个**，其他协程都处于暂停状态。
- 此外，普通的线程是**抢先式**的，到底哪个线程优先得到资源，必须由运行环境决定，但是协程是**合作式**的，执行权由协程自己分配。
- 由于 JavaScript 是单线程语言，只能保持一个调用栈。引入协程以后，每个任务可以**保持自己的调用栈**。这样做的最大好处，就是抛出错误的时候，可以找到原始的调用栈。不至于像异步操作的回调函数那样，一旦出错，原始的调用栈早就结束。

====

- 如果将 Generator 函数当作协程，完全可以将多个需要互相协作的任务写成 `Generator` 函数，它们之间使用`yield`表达式交换控制权。

- 第一步，协程A开始执行。
- 第二步，协程A执行到一半，进入暂停，执行权转移到协程B。
- 第三步，（一段时间后）协程B交还执行权。
- 第四步，协程A恢复执行。
[/magic]

[note]
传统的编程语言，早有异步编程的解决方案（其实是多任务的解决方案）。其中有一种叫做"协程"（coroutine），意思是多个线程互相协作，完成异步任务。
<br>
看个例子
[/note]

[slide]
{:&.moveIn}
```js
function* gen(x) {
  var y = yield x + 2;
  return y;
}

var g = gen(1);
g.next() // { value: 3, done: false }
g.next() // { value: undefined, done: true }
```
- 执行 Generator 函数会返回一个**遍历器对象**，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

[note]
协程遇到yield命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。它的最大优点，就是代码的写法非常像同步操作，如果去除yield命令，简直一模一样。<br>
yield => 产出<br>
浏览器演示 `var it = [1,2,3,4][Symbol.iterator]()`
[/note]

[slide]
{:&.moveIn}
- 封装一个异步函数

```js
// 封装
function* gen () {
  var url = 'http://api.domain/some/api';
  var result = yield axios.get(url);
  console.log(result);
}

// 调用
var g = gen();

g.next()
  .then(data => {
    return data.json();
  })
  .then(data => {
    g.next(data);
  });
```
[note]
可以看到，虽然 Generator 函数将异步操作表示得很简洁，但是流程管理却不方便（即何时执行第一阶段、何时执行第二阶段）。<br>
Thunk 函数【传值调用 和 传名调用】
[/note]

[slide]
> 我们需要自动执行 Generator 函数！

<br>
- 两种方法可以做到这一点。
  1. **回调函数**。将异步操作包装成 `Thunk` 函数，在回调函数里面交回执行权。
  2. **Promise 对象**。将异步操作包装成 `Promise` 对象，用then方法交回执行权。

[slide]
# 自动执行 Generator 函数 —— Thunk 函数 {:&.moveIn}
> 编译器的“传名调用”实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。

```js
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback);
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk(callback);
```

[note]
- 所以 Thunk 函数有什么用？
- 以前确实没什么用，但是现在可以用于 Generator 函数的自动流程管理。
- 看例子 
  - thunk.js 
  - autorun.js
[/note]
[slide]
# co 模块 {:&.moveIn}
> 使用 co 的前提条件是，Generator 函数的yield命令后面，只能是 Thunk 函数或 Promise 对象

- co 模块可以让你不用编写 Generator 函数的执行器。

```js
function* gen() {
  const result1 = yield _ajax('/some/api');
  console.log(result1);
  const result2 = yield _ajax('/other/api');
  console.log(result2);
}
```

- co函数返回一个Promise对象，因此可以用then方法添加回调函数。

```js
var co = require('co');
co(gen)
  .then(function (){
    console.log('Generator 函数执行完成');
  });
```
[slide]
# 最终解决方案！！！ async/await
> async函数 只是 generator 函数的**语法糖**
[slide]
```js
const fs = require('fs');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

const genReadFile = function* () {
  const result1 = yield readFile('/some/file');
  console.log(result1);
  const result2 = yield readFile('/other/file');
  console.log(result2);
}
```

```js
const asyncReadFile = async function () {
  const result1 = await readFile('/some/file');
  console.log(result1);
  const result2 = await readFile('/other/file');
  console.log(result2);
}
```

[note]
一比较就会发现，async函数就是将 Generator 函数的星号（*）替换成async，将yield替换成await，仅此而已。
[/note]
[slide]
{:&.moveIn}
- async函数自带执行器。
> 也就是说，async函数的执行，与普通函数一模一样，只要一行。

```js
// 可以直接执行
asyncReadFile();
```

- 更广的适用性。
> co模块约定，yield命令后面只能是 **Thunk** 函数或 **Promise** 对象，而async函数的await命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。


- 返回值是 Promise。
> async函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用**then**方法指定下一步的操作。
[note]
- Generator 函数的执行必须靠执行器，所以才有了co模块
[/note]

[slide]
# 分享结束 {:.text-primary}
# 希望能使大家对异步编程加深理解
### 18/11/14 冯嘉辉

[slide]
## 前端代理小公举 - [dalao-proxy](https://github.com/CalvinVon/dalao-proxy) 
- HTTP Proxy
- request cache/mock/...

- ```shell
sudo npm install dalao-proxy -g
```