const fs = require('fs');

/*
let result = [{id: '001', name: '伊藤'}, {id: '002', name: '山田'}];
//let result = JSON.parse(fs.readFileSync('./person.json', 'utf8'));
fs.writeFileSync('./person.json', JSON.stringify(result, null, '  '));
*/
/*
let result = [
  {id: '001', name: 'タブレット', status: '貸出中', user: '伊藤', time: '00:00:00'},
  {id: '002', name: 'タブレット', status: '', user: '', time: '00:00:00'},
  {id: '003', name: 'タブレット', status: '', user: '', time: '00:00:00'},
  {id: '004', name: 'タブレット', status: '', user: '', time: '00:00:00'},
  {id: '005', name: 'タブレット', status: '', user: '', time: '00:00:00'},
];
//let result = JSON.parse(fs.readFileSync('./device.json', 'utf8'));
let item = result.find(item => item.id === '004');
item.time = '11:11:11';
//console.log(item);
console.log(result);
fs.writeFileSync('./device.json', JSON.stringify(result, null, '  '));
*/

let result = [
  {id: '001', name: 'タブレット', status: '貸出中', user: '伊藤', time: '00:00:00', update_t: 123},
  {id: '002', name: 'タブレット', status: '', user: '', time: '00:00:00', update_t: 100},
  {id: '003', name: 'タブレット', status: '', user: '', time: '00:00:00', update_t: 120},
  {id: '004', name: 'タブレット', status: '', user: '', time: '00:00:00', update_t: 133},
  {id: '005', name: 'タブレット', status: '', user: '', time: '00:00:00', update_t: 103},
];

let idx = -1;
let max = 0;
for (let i = 0; i < result.length; i++) {
  if (max < result[i].update_t) {
    max = result[i].update_t;
    idx = i;
  }
}
console.log(result);

console.log('max', max, 'idx', idx);


/*
// 昇順にソート
result.sort(function(a, b){
  if (a.update_t < b.update_t) return -1;
  if (a.update_t > b.update_t) return 1;
  return 0;
});

console.log(result);
*/