exports.ajax = function makeAjaxCall(url, callback) {
    console.log('I gona request' + url);
    setTimeout(() => {
        console.log('request success!');
        callback(null, '{ "code": 0 }')
    }, 3000);
};

// exports.promisefy = function (funn) {
//     return function() {
//         const args = arguments;
//         return new Promise(function (resolve, reject) {
//             const callback = function(err, data) {
//                 if (err) {
//                     reject(err);
//                 }
//                 else {
//                     resolve(data);
//                 }
//             };
//             const _args = Array.prototype.slice.call(args);
//             _args.push(callback);
//             funn.apply(null, _args);
//         });
//     }
// }

exports.promisefy = function (funn) {
    function awaitable () {
        const args = arguments;
        return new Promise(function (resolve, reject) {
            const callback = function(err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            };
            const _args = Array.prototype.slice.call(args);
            _args.push(callback);
            funn.apply(null, _args);
        });
    }

    return awaitable;
}