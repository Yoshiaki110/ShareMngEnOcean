

// 日付のフォーマット
function formatDate(date, format) {
  format = format.replace(/yyyy/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
  return format;
};

// デバイスの指定地を変更、更新があった場合１を返す
function setDevice(dst, src) {
  console.log('-- setDevice', dst, src);
  if (dst === src) {
    return 0;
  }
  dst = src;
  return 1;
}

// NFCのデータ来たら最近動かしたdeviceがあるか検索
function nfcArrived(name) {
  console.log('-- nfcArrived', name);
  // 最大値（最近の時刻）を取得
  let idx = -1;
  let max = 0;
  for (let i = 0; i < devices.length; i++) {
    if (max < devices[i].move_t) {
      max = devices[i].move_t;
      idx = i;
    }
  }
  let tm = new Date().getTime();
  if (devices[idx].move_t + 40*1000 > tm) {
    devices[idx].user = name;
    console.log("***1");
    devices[idx].status = '貸出中';
    devices[idx].nfc_t = tm;
    let data = {
      msg: ''
    };
    publish(data);
//    wsAllSend(data);
    return 1;
  } else {
    let data = {
      msg: '貸出物を動かしてからNFCをタッチしてください'
    };
    publish(data);
//    wsAllSend(data);
  }
  return 0;
}

// 指定デバイスの更新
function updateDevice(id, status) {
  console.log('-- updateDevice');
  let upd = 0;
  let tm = new Date().getTime();
  // EnOceanからの通知
  let device = devices.find(item => item.id === id);
  if (device) {
    device.time = formatDate(new Date(), 'HH:mm:ss');
    console.log('device.time', device.time);

    if (status === 'move') {
//      upd += setDevice(device.move_t, tm);
      device.move_t = tm;
    }
    if (status === 'keepalive') {
//      upd += setDevice(device.keepalive_t, tm);
      device.keepalive_t = tm;
    }
//    upd += setDevice(device.update_t, tm);
    if (device.status !== '貸出中') {
      device.status = '有';
      device.user = '';
    } else {
      // NFCタッチ後しばらくは、電波が来ても、有にしない
      if (device.nfc_t + 40*1000 < new Date().getTime()) {
        device.status = '有';
        device.user = '';
      }
    }
    device.update_t = tm;
    upd = 1;
  }
  updateAll(upd);
}

// 指定NFCの更新
function updateNfc(id) {
  console.log('-- updateNfc');
  let upd = 0;
  let tm = new Date().getTime();
  // NFCからの通知
  let person = persons.find(item => item.id === id);
  if (person) {
    upd = nfcArrived(person.name);
  }
  updateAll(upd);
}

// iPhoneからの更新
// http://localhost:5000/rend?0413D2B8&10E805C510040101
function rend(did, uid) {
  console.log('-- rend');
  let person = persons.find(item => item.id === uid);
  if (person) {
    let device = devices.find(item => item.id === did);
    if (device) {
      device.status = '貸出中';
      device.user = person.name;
      device.nfc_t = new Date().getTime();
      updateAll(1);
      return [device.name, person.name];
    }
  }
  return null;
}

// 40秒以上KeepAliveが来ないと行方不明にする
function updateAll(upd) {
//  console.log('-- updateAll', upd);
  for (let i = 0; i < devices.length; i++) {
    if (devices[i].update_t + 40*1000 < new Date().getTime()) {
      if (devices[i].status !== "貸出中") {
        if (devices[i].status !== "行方不明") {
          devices[i].status = "行方不明";
          upd = 1;
        }
      }
    }
  }
//  console.log('upd', upd);
  // 必要であれば通知、保存
  if(upd) {
    save();
    let data = {
      dt: {
        items: devices
      }
    };
    publish(data);
//    wsAllSend(data);
  }
}

// 定期実行
function periodically() {
//  console.log('-- periodically');
  updateAll(0);
  setTimeout(periodically, 1000);
}

setTimeout(periodically, 1000);


// ファイルI/O
const fs = require('fs');
let persons = JSON.parse(fs.readFileSync('./persons.json', 'utf8'));
let devices = JSON.parse(fs.readFileSync('./devices.json', 'utf8'));

function save() {
  fs.writeFileSync('./devices.json', JSON.stringify(devices, null, '  '));
  console.log(devices);
}

// MQTTサーバの生成
var mqtt = require('mqtt')
var client = null;
function mqttConnect() {
  client = mqtt.connect('mqtt://mqtt.eclipse.org')

  client.on('connect', function () {
    client.subscribe('/jp/co/smeo/#');
    let data = {
      dt: {
        items: devices
      }
    };
    publish(data);
  })

  client.on('message', function (topic, message) {
//    console.log('mqtt msg arruved', message);
    console.log(topic, message.toString());
    let dt = JSON.parse(message.toString());
    if (topic === '/jp/co/smeo/enocean') {
      console.log('enocean id', dt.dt.id);
      updateDevice(dt.dt.id, dt.cmd);
    } else if (topic === '/jp/co/smeo/nfc') {
      console.log('nfc id', dt.dt.id);
      updateNfc(dt.dt.id);
    }
  })
}

function publish(data) {
  let msg = JSON.stringify(data);
  client.publish('/jp/co/smeo/console', msg);
}

mqttConnect();

/*
// WebSocketのサーバの生成
let ws = require('ws')
var server = new ws.Server({port:5001});
//console.log('ws server', server);

// 全クライアントにデータを送信
function wsAllSend(message) {
  let msg = JSON.stringify(message)
  server.clients.forEach(client => {
    console.log('ws snd', msg);
    client.send(msg);
  });
}

// 接続時に呼ばれる
server.on('connection', ws => {
  console.log('ws connect');
  // クライアントからのデータ受信時に呼ばれる
  ws.on('message', message => {
    console.log('ws rcv', message);
    // 全クライアントにデータを返信
    //wsAllSend(message);
  });

  // 切断時に呼ばれる
  ws.on('close', () => {
    console.log('ws cls');
  });

  let data = {
    dt: {
      items: devices
    }
  };
  wsAllSend(data);
});
*/

// HTTPサーバの生成
const express = require('express');
const app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.json());

app.get('/', function (req, res) {
  console.log('http get /', req.body);
  res.sendFile(__dirname + "/index.html");
  setTimeout(mqttConnect, 1000);
});

// 
app.get('/rend', function (req, res) {
  console.log('http get /do', req.url);
  var body = '';
  let arr = req.url.substr(6).split('&');
  if (arr.length === 2) {
    let [dname, uname] = rend(arr[0], arr[1]);
    body = '貸し出しOKです。<br>' + dname + '<br>' +  uname;
  } else {
    body = 'エラーが発生しました';
  }

  var head = fs.readFileSync("./rend-h.html", 'utf8');
  var tail = fs.readFileSync("./rend-t.html", 'utf8');
  res.send(head + body + tail);
});

// curl http://172.28.31.48:5000 -X POST -H "Content-Type: application/json" -d '{"device":"台車Ｂ","status":"move"}'
app.post('/', function (req, res) {
  console.log('http post /', req.body);
  res.json({'msg':'Got a POST request'});
  updateDevice(req.body.device, req.body.status);
  // 全クライアントにデータを返信
  //wsAllSend(JSON.stringify(req.body));
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at port:" + app.get('port'))
});
