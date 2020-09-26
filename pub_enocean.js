console.error ("*** 開始 ***")
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://mqtt.eclipse.org')
const topic = '/jp/co/smeo/enocean'

client.on('connect', function () {
  let data = {
    cmd: 'move',
    dt: {
      id: '0413D2B7'
    }
  }
  let msg = JSON.stringify(data);
  client.publish(topic, msg)
  client.end()
  console.error ("*** 終了 ***")
})
