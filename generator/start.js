const { ajax, promisefy } = require('../mock-ajax');

// const _ajax = promisefy(ajax);

// 封装
function* gen () {
  const url = 'http://api.domain/some/api';
  const result = yield ajax(url, (err, data) => {
    g.next(JSON.parse(data));
  });
  // const result = yield request("http://some.url");
  // const result = yield request("http://some.url");
  console.log(result);
}

// 调用
const g = gen();

g.next()




function request(url) {
  ajax(url, function (err, response) {
      it.next(response);
  });
}