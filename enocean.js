const request = require('request');

var options = {
  uri: "http://172.28.31.48:5000/",
  headers: {
    "Content-type": "application/json",
  },
  json: { "device":"台車Ｂ","status":"move" }
};
request.post(options, function(error, response, body) {
});