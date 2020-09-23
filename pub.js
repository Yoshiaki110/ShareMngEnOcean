console.error ("*** 開始 ***")
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://mqtt.eclipse.org')
const topic = '/jp/co/latency/15'

client.on('connect', function () {
  let data = {
    cmd: 'こんにちは',
    dt: {
      time: new Date().getTime()
    }
  }
  let msg = JSON.stringify(data);
  client.publish(topic, msg)
//  client.publish(topic, 'こんにちは')
  client.end()
  console.error ("*** 終了 ***")
})
