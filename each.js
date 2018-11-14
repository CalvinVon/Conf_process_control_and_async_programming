function each (tasks, iteratee, callback) {
  const length = tasks.length;
  let finished = 0;

  for (let index = 0; index < length; index++) {
    const task = tasks[index];
    iteratee.call(null, task, internalCallback);
  }

  function internalCallback() {
    const [err] = arguments;
    
    if (err) {
      return callback && callback.call(null, err);
    }

    finished++;
    if (finished === length) {
      callback && callback();
    }
  }
}

exports.each = each;