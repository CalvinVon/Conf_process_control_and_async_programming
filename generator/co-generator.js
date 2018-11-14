const co = require('co');
const { ajax, thunkify, promisefy } = require('../ajax-utils');

const ajax_thunkify = thunkify(ajax);
const ajax_promisefy = promisefy(ajax);

const gen = function* () {
  // var f1 = yield ajax('http://domain.com/some/api')
  var f1 = yield ajax_thunkify('/some/api')
  // var f2 = yield ajax('/api/some/link');
  var f2 = yield ajax_promisefy('/api/some/link');
  console.log(f1.toString());
  console.log(f2.toString());
};

// const gen2 = function* () {
//   // var f1 = yield ajax('http://domain.com/some/api')
//   var f1 = yield ajax_thunkify('http://domain.com/some/api')
//   console.log(f1.toString());
// };

co(gen)
  .catch(err => {
    console.error(err);
  })