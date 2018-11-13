module.exports = function run(gen) {
  const g = gen();

  function next(err, data) {
    var result = g.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
};