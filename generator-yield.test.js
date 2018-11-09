const { ajax } = require('./mock-ajax');

function* main() {

    console.log('async start')
    const result = yield request("http://some.url");
    console.log('async end')

    const resp = JSON.parse(result);
    console.log(resp);
}

function request(url) {
    ajax(url, function (response) {
        it.next(response);
    });
}

var it = main();
it.next();