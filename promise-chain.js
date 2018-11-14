const { ajax, promisefy } = require('./ajax-utils');
const ajax_promisefy = promisefy(ajax);

ajax_promisefy('/api/some/thing')
  .then(data => {
    const url = JSON.parse(data).url + 1;
    return ajax_promisefy(url)
  })
  .then(data => {
    const url = JSON.parse(data).url + 1;
    return ajax_promisefy(url)
  })
  .then(data => {
    const url = JSON.parse(data).url + 1;
    return ajax_promisefy(url)
  })

// let count = 0;
// function promiseFactory() {
//   return function (data) {
//     const url = JSON.parse(data).url + '/' + ++count;
//     return ajax_promisefy(url);
//   }
// }
// Promise.resolve(JSON.stringify({ url: '/api/some/thing' }))
//   .then(promiseFactory())
//   .then(promiseFactory())
//   .then(promiseFactory())
//   .then(promiseFactory())
//   .then(promiseFactory())