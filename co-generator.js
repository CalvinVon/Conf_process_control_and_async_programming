const co = require('co');
const { ajax } = require('./mock-ajax');

const gen = function* () {
  var f1 = yield ajax('http://domain.com/some/api')
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

