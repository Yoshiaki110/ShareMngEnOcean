'use strict';

const net = require("net");
const request = require('request');

const uri = "https://sharemngenocean.herokuapp.com/";
const host = "127.0.0.1";
const port = 8000;

function send(device, status) {
  console.log('device', device);
  console.log('status', status);
  var options = {
    uri: uri,
    headers: {
      "Content-type": "application/json",
    },
    json: { "device": device, "status": status }
  };
  request.post(options, function(error, response, body) {
  });
}


var client = new net.Socket();

client.connect(port, host, function() {
  console.log("connect to: " + host + ":" + port);
});

client.on("data", function(data) {
  var s = data.toString();

  s = s.replace(/\\n/g, "\\n")
  .replace(/\\'/g, "\\'")
  .replace(/\\"/g, '\\"')
  .replace(/\\&/g, "\\&")
  .replace(/\\r/g, "\\r")
  .replace(/\\t/g, "\\t")
  .replace(/\\b/g, "\\b")
  .replace(/\\f/g, "\\f");
   s = s.replace(/[\u0000-\u0019]+/g,"");
   var obj = JSON.parse(s);

  let id = obj.dataTelegram.deviceId;
  //console.log(obj.dataTelegram.functions);
  //console.log(obj.dataTelegram.functions.find(item => item.key === 'CO'));
  send(id, 'move');
});

client.on("close", function() {
  console.log("disconnect from: " + host + ":" + port);
})

