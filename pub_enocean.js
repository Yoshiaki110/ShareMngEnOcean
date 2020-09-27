if (process.argv.length !== 3 || (process.argv[2] !== 'k' && process.argv[2] !== 'm')) {
  console.log('usage node pub_enocean {k|m}');
  console.log('    k(eepalive)');
  console.log('    m(ove)');
  process.exit(1);
}
let cmd = process.argv[2] === 'k' ? 'keepalive' : 'move';


console.error ("*** 開始 ***")
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://mqtt.eclipse.org')
const topic = '/jp/co/smeo/enocean'

client.on('connect', function () {
  let data = {
    cmd: cmd,
    dt: {
      id: '0413D2B7'
    }
  }
  let msg = JSON.stringify(data);
  client.publish(topic, msg)
  client.end()
  console.error ("*** 終了 ***")
})
