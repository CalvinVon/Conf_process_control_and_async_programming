const { ajax } = require('./ajax-utils');
const async = require('./each');

async.each(
  [
    '/v1/api/some',
    '/v1/api/other',
    '/v2/api/some',
  ],
  function (url, callback) {
    ajax(url, function(err, data) {
      console.log(JSON.parse(data));
      callback(err, data);
    })
  },
  function (err) {
    console.log('Finished');
  }
)