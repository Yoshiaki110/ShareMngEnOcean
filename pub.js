console.error ("*** 開始 ***")
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://mqtt.eclipse.org')
const topic = '/jp/co/latency/15'

client.on('connect', function () {
    client.publish(topic, 'こんにちは')
    client.end()
    console.error ("*** 終了 ***")
})
