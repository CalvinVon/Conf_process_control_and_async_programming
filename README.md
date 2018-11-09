[slide]
# JS流程控制和异步编程分享
## 18/11/09 冯嘉辉

[slide]

- 回调函数（callback）
- Promise 对象
- 事件监听（EventEmitter/EventListener）
- 发布/订阅（Publish/Subscribe）

ES6 诞生以前，异步编程的方法，大致有面四种。


Generator函数很特殊，理解起来比promise和callback更加难，从语法上将，generator具备以下特质：

定义Generator时，需要使用function*。
使用时生成一个Generator对象。
执行.next()激活暂停状态，开始执行内部代码，直到遇到yield，返回此时执行的结果，并记住此时执行的上下文，暂停。
再次执行.next()时重复第三步。