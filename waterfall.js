const async = {};
async.waterfall = function (tasks, userCallback) {
    // 指向当前 task
    let _index = 0;

    /**
     * 调用用户任务 task
     * @param {Number} index task index
     * @param {Arguments} args 传递下来的参数
     * @param {Function} cb 回调
     */
    function runTask(index, args, cb) {
        const task = tasks[index];
        args.push(cb);
        task.apply(null, args);
    };

    /**
     * 1. 调用用户函数的同时，把_cb作为参数
     * 2. 用户调用这个_cb，表明已执行完该函数
     */
    function internalCallback() {
        const [err, ...args] = arguments;
        // 如果错误了，直接调用用户回调
        if (err) {
            return userCallback && userCallback.apply(null, [err]);
        }
        // 如果是最后一个，也直接调用用户回调
        if (_index === tasks.length) {
            return userCallback && userCallback.apply(null, arguments);
        }

        runTask(_index++, args, internalCallback);
    };

    if (tasks.length === 0) return userCallback && userCallback();

    runTask(_index++, [], internalCallback);
};

module.exports = async;