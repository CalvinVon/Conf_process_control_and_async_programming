var async = {};
async.waterfall = function (tasks, cb) {
    // 指向下一个将要执行的函数
    var _index = 0;

    /**
     * 调用用户指定的函数
     */
    function _run(index, args, cb) {
        var task = tasks[index];
        args.push(cb);
        task.apply(null, args);
    };

    /**
     * 因为涉及到控制流的转移，从框架转移到用户，再从用户转移到框架。
     * 需要定义一个传递控制流的使者，就是这个_cb函数
     * 1.框架转移到用户：调用用户函数的同时，把_cb作为参数
     * 2.用户转移到框架：用户调用这个_cb，表明已执行完该函数，把控制交给框架。抑或结束，抑或执行下一个函数
     */
    function _cb() {
        // 如果错误了，直接回调最外层的cb
        if (arguments[0]) {
            return cb && cb.apply(null, [arguments[0]]);
        }
        // 如果是最后一个，也直接调用最外层的cb
        if (_index === tasks.length) {
            return cb && cb.apply(null, arguments);
        }

        /**
         * 取出回调参数，作为下一个函数的输入
         * 因为回调的第一个参数是错误码，所以要去掉第一个
         */
        // var rest = arguments.slice(1); //arguments并没有slice方法，因此这样会报错
        var rest = Array.prototype.slice.call(arguments, 1);

        _run(_index++, rest, _cb);
    };

    // 如果用户没有指定要串行执行的函数，则直接调用回调
    if (tasks.length === 0) return cb && cb();
    _run(_index++, [], _cb);
};

module.exports = async;