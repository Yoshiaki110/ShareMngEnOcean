
// MQTTサーバの生成
var mqtt = require('mqtt')
var client = null;
function mqttConnect() {
  client = mqtt.connect('mqtt://mqtt.eclipse.org')

  client.on('connect', function () {
    console.log('connected\n');
    client.subscribe('/jp/co/smeo/#');
  })

  client.on('message', function (topic, message) {
    console.log('topic', topic);
    console.log('  msg', message.toString());
    console.log();
    let dt = JSON.parse(message.toString());
  })
}

function publish(data) {
  let msg = JSON.stringify(data);
  client.publish('/jp/co/smeo/console', msg);
}

mqttConnect();

