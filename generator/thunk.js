const {
  ajax,
  thunkify
} = require('../mock-ajax');

const run = require('./autorun');
const _ajax = thunkify(ajax);

// _ajax('api.domain.com')((err, data) => {
//   console.log(data)
// })

function* gen() {
  const result1 = yield _ajax('/some/api');
  console.log(result1);
  const result2 = yield _ajax('/other/api');
  console.log(result2);
}

// const g = gen();

// g
//   .next()
//   .value((err, data) => {
//     const res = g.next(JSON.parse(data));
//     res.value((err, data) => {
//       g.next(JSON.parse(data));
//     })
//   })

run(gen)