exports.ajax = function makeAjaxCall(url, callback) {
    console.log('GET > ' + url);
    setTimeout(() => {
        console.log('GET success!');
        callback(null, JSON.stringify({
            code: 0,
            url,
            msg: 'OK'
        }))
    }, 1000);
};

exports.thunkify = function (fn) {
    function thunkable () {
        const args = Array.prototype.slice.call(arguments);
        return function (callback) {
            args.push(callback);
            return fn.apply(this, args);
        }
    };

    return thunkable;
};

exports.promisefy = function (fn) {
    function awaitable() {
        const args = Array.prototype.slice.call(arguments);
        return new Promise(function (resolve, reject) {
            const callback = function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            };
            args.push(callback);
            fn.apply(null, args);
        });
    }

    return awaitable;
};