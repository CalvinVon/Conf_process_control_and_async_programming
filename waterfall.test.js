const async = require('async');
// const async = require('./waterfall');

async.waterfall([
    function(callback) {
        setTimeout(() => {
            callback(null, 'one', 'two')
        }, 1000)
    },
    function(arg1, arg2, callback) {
        console.log(arg1);
        console.log(arg2);
          // arg1 now equals 'one' and arg2 now equals 'two'
        setTimeout(() => {
            callback(new Error('three new Error ocurred!'), 'three');
        }, 2000)
    },
    function(arg1, callback) {
        console.log(arg1);
        // arg1 now equals 'three'
        callback(null, 'done');
    }
], function (err, result) {
    if (err) {
        return console.error(err);
    }
    // result now equals 'done'
    console.log(result);
});
