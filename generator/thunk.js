const {
  ajax,
  thunkify
} = require('../ajax-utils');

const run = require('./autorun');
const ajax_thunkify = thunkify(ajax);

ajax_thunkify('api.domain.com')((err, data) => {
  console.log(data)
})

// function* gen() {
//   const result1 = yield ajax_thunkify('/some/api');
//   console.log(result1);
//   const result2 = yield ajax_thunkify('/other/api');
//   console.log(result2);
// }

// const g = gen();

// g
//   .next()
//   .value((err, data) => {
//     const res = g.next(JSON.parse(data));
//     res.value((err, data) => {
//       g.next(JSON.parse(data));
//     })
//   })

// run(gen)