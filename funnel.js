var pull = require('pull-core')

module.exports = function (fn) {
  return pull.Sink(function (read) {
    read(null, function (data, next) {
      read(fn(data) || null, next);
    })
  })
}