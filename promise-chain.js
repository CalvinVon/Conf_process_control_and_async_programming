function promiseFactory(name) {
  return function (data) {
    console.log(`Run promise ${name}, after ${data}`);
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Promise ' + name + ' OK');
        resolve(name);
      }, 1000);
    })
  }
}
Promise.resolve('start')
  .then(promiseFactory('a'))
  .then(promiseFactory('b'))
  .then(promiseFactory('c'))
  .then(promiseFactory('d'))
  .then(promiseFactory('e'))