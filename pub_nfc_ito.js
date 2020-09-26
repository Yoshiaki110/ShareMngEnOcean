console.error ("*** 開始 ***")
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://mqtt.eclipse.org')
const topic = '/jp/co/smeo/nfc'

client.on('connect', function () {
  let data = {
    cmd: 'nfc',
    dt: {
      id: '01071B2B00021601'
//      id: '010D0CCE003E1001'
//      id: '10E805C510040101'
    }
  }
  let msg = JSON.stringify(data);
  client.publish(topic, msg)
//  client.publish(topic, 'こんにちは')
  client.end()
  console.error ("*** 終了 ***")
})
