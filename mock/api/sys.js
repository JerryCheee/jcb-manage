// var http = require('request')

var http = require('../proxyCRUD')
module.exports = {

  'get /sys/randomImage/:key': http.get,
  'post /sys/login': http.post,
}
