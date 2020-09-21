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

function updateById(id) {
  let device = devices.find(item => item.id === id);
  if (device) {
    device.time = formatDate(new Date(), 'HH:mm:ss');
    console.log('device.time', device.time);
  }
  let person = persons.find(item => item.id === id);
  if (person) {
    devices[0].user = person.name;
  }
  updateAll();
  save();
}

function updateAll() {
  for (let i = 0; i < devices.length; i++) {
    let data = devices[i].time;
    if (data.length === 8) {
      let hh = data.substr(0, 2);
      let mm = data.substr(3, 2);
      let ss = data.substr(6, 2);
      let tm = Number(hh) * 60*60 + Number(mm) * 60 + Number(ss);
      let date = new Date();
      let tmNow = date.getHours() * 60*60 + date.getMinutes() * 60 + date.getSeconds();
      if (tm + 40 < tmNow) {
        devices[i].status = "行方不明";
      } else {
        devices[i].status = "有";
      }
      //console.log(tm + 40, '<', tmNow);
    }
  }
  console.log(devices);
};

function periodically() {
  updateAll();
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
  updateById(req.body.device);
  // 全クライアントにデータを返信
  wsAllSend(JSON.stringify(req.body));
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at port:" + app.get('port'))
});
