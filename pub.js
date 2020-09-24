console.error ("*** 開始 ***")
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://mqtt.eclipse.org')
const topic = '/jp/co/latency/15'

client.on('connect', function () {
  let data = {
    cmd: 'こんにちは',
    msg: '',
    dt: {
      time: new Date().getTime(),
      items: [
        { no:'_1', name:'_そら', sex:'_♂', age:'_8', kind:'_キジトラ', favorite:'_犬の人形' },
        { no:'4', name:'こうめ', sex:'♀', age:'4', kind:'サビ', favorite:'横取りフード' },
      ]
    }
  }
  let msg = JSON.stringify(data);
  client.publish(topic, msg)
//  client.publish(topic, 'こんにちは')
  client.end()
  console.error ("*** 終了 ***")
})
