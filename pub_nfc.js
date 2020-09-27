if (process.argv.length !== 3 || (process.argv[2] !== 'i' && process.argv[2] !== 'k' && process.argv[2] !== 's')) {
  console.log('usage node pub_ifc {i|k|s}');
  console.log('    u(to)');
  console.log('    k(ato)');
  console.log('    s(ato)');
  process.exit(1);
}
let id = '01071B2B00021601';
if (process.argv[2] === 'k') {
  id = '10E805C510040101';
} else if (process.argv[2] === 's') {
  id = '010D0CCE003E1001';
}

console.error ("*** 開始 ***")
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://mqtt.eclipse.org')
const topic = '/jp/co/smeo/nfc'

client.on('connect', function () {
  let data = {
    cmd: 'nfc',
    dt: {
      id: id
    }
  }
  let msg = JSON.stringify(data);
  client.publish(topic, msg)
//  client.publish(topic, 'こんにちは')
  client.end()
  console.error ("*** 終了 ***")
})
