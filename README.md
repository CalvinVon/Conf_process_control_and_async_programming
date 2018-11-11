title: JS流程控制和异步编程分享
speaker: Calvin Von
transition: pulse
theme: dark

[slide]
# JS流程控制和异步编程分享
## 18/11/09 冯嘉辉

[slide]
# 同步（Synchronous） {:&.moveIn}

Javascript语言的执行环境是"单线程"（single thread）。
所谓"单线程"，就是指一次只能完成一件任务。如果有多个任务，就必须排队，前面一个任务完成，再执行后面一个任务，以此类推，所谓"同步"。

[slide]
# 异步（Asynchronous） {:&.moveIn}

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
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```
- Promise实例生成以后，可以用then方法分别指定`resolved`状态和`rejected`状态的回调函数。
```js
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
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
# 其他的解决方案
- async库
- Node.js q模块 co模块

[slide]
# async 库
[slide]
# ES6 原生解决方案 generator/yield
[slide]
# ES6 原生解决方案 async/await
[slide]

Generator函数很特殊，理解起来比promise和callback更加难，从语法上将，generator具备以下特质：

定义Generator时，需要使用function*。
使用时生成一个Generator对象。
执行.next()激活暂停状态，开始执行内部代码，直到遇到yield，返回此时执行的结果，并记住此时执行的上下文，暂停。
再次执行.next()时重复第三步。