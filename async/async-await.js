const { ajax, promisefy } = require('../ajax-utils');

async function asyncMain() {
    const asyncAjax = promisefy(ajax);

    console.log('async start')
    const result = await asyncAjax('http://async.com');
    console.log('async end')

    var resp = JSON.parse(result);
    console.log(resp);
}

asyncMain();