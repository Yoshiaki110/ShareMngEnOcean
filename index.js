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
  // 全クライアントにデータを返信
  wsAllSend(JSON.stringify(req.body));
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at port:" + app.get('port'))
});
