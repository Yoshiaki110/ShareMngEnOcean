if (process.argv.length !== 4 || (process.argv[2] !== 'i' && process.argv[2] !== 'g' && process.argv[2] !== 'x') || (process.argv[3] !== 'k' && process.argv[3] !== 'm')) {
  console.log('usage node pub_enocean {i|g|e} {k|m}');
  console.log('    i(phone) k(eepalive)');
  console.log('    g(alaxy) m(ove)');
  console.log('    x(peria)');
  process.exit(1);
}

let id = '0413D2B7';
if (process.argv[2] === 'g') {
  id = '0413D2B8';
} else if (process.argv[2] === 'x') {
  id = '0413D2B9';
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
      id: id
    }
  }
  let msg = JSON.stringify(data);
  client.publish(topic, msg)
  client.end()
  console.error ("*** 終了 ***")
})
