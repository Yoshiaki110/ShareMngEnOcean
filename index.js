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

// 指定デバイスの更新
function updateById(id, status) {
  console.log('-- updateById');
  let upd = 0;
  let tm = new Date().getTime();
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
    device.update_t = tm;
    upd = 1;
  }
  let person = persons.find(item => item.id === id);
  if (person) {
    devices[0].user = person.name;
  }
  updateAll(upd);
}

// 全データの更新
function updateAll(upd) {
  console.log('-- updateAll', upd);
  for (let i = 0; i < devices.length; i++) {
//    let data = devices[i].time;
//    if (data.length === 8) {
//      let hh = data.substr(0, 2);
//      let mm = data.substr(3, 2);
//      let ss = data.substr(6, 2);
//      let tm = Number(hh) * 60*60 + Number(mm) * 60 + Number(ss);
//      let date = new Date();
//      let tmNow = date.getHours() * 60*60 + date.getMinutes() * 60 + date.getSeconds();
//      if (tm + 40 < tmNow) {
      if (devices[i].update_t + 40*1000 < new Date().getTime()) {
//        upd += setDevice(devices[i].status, "行方不明");
        if (devices[i].status !== "行方不明") {
          devices[i].status = "行方不明";
          upd = 1;
        }
        console.log('  ', devices[i].status, "行方不明");
      } else {
//        upd += setDevice(devices[i].status, "有");
        if (devices[i].status !== "有") {
          devices[i].status = "有";
          upd = 1;
        }
        console.log('  ', devices[i].status, "有");
//      }
      //console.log(tm + 40, '<', tmNow);
    }
  }
  console.log('upd', upd);
  // 必要であれば通知、保存
  if(upd) {
    save();
  }
};

// 定期実行
function periodically() {
  console.log('-- periodically');
  updateAll(0);
  setTimeout(periodically, 1000);
};

setTimeout(periodically, 1000);


// ファイルI/O
const fs = require('fs');
let persons = JSON.parse(fs.readFileSync('./persons.json', 'utf8'));
let devices = JSON.parse(fs.readFileSync('./devices.json', 'utf8'));

function save() {
  fs.writeFileSync('./devices.json', JSON.stringify(devices, null, '  '));
  console.log(devices);
}


// WebSocketのサーバの生成
let ws = require('ws')
var server = new ws.Server({port:5001});

// 全クライアントにデータを送信
function wsAllSend(message) {
  server.clients.forEach(client => {
    console.log('ws snd', message);
    client.send(message);
  });
}

// 接続時に呼ばれる
server.on('connection', ws => {
  // クライアントからのデータ受信時に呼ばれる
  ws.on('message', message => {
    console.log('ws rcv', message);
    // 全クライアントにデータを返信
    wsAllSend(message);
  });

  // 切断時に呼ばれる
  ws.on('close', () => {
    console.log('ws cls');
  });
});


// HTTPサーバの生成
const express = require('express');
const app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.json());

app.get('/', function (req, res) {
  console.log('http get /', req.body);
  res.sendFile(__dirname + "/index.html");
});

// curl http://172.28.31.48:5000 -X POST -H "Content-Type: application/json" -d '{"device":"台車Ｂ","status":"move"}'
app.post('/', function (req, res) {
  console.log('http post /', req.body);
  res.json({'msg':'Got a POST request'});
  updateById(req.body.device, req.body.status);
  // 全クライアントにデータを返信
  wsAllSend(JSON.stringify(req.body));
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at port:" + app.get('port'))
});
