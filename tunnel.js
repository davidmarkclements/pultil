var pull = require('pull-core')

module.exports = function (fn) {
	return pull.Through(function (read) {
	  return function (end, cb) {
	    read(null, function (end, data) {
	      var mutation;
	      if (fn.length < 2) {
	        mutation = fn(data)
	        cb(end, typeof mutation !== 'undefined' ? mutation : data)
	        return;
	      }
	      fn(data, function (mutation) {
	        cb(end, typeof mutation !== 'undefined' ? mutation : data)
	      })
	    })
	  }
	})
}