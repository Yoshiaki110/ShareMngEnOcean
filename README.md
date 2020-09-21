# ShareMngEnOcean

EnOceanによる共有物の貸し出し管理


NFCと振動センサを使った共有物の貸し出し管理
会社の共有物、プロジェクター、台車、DVDドライブなど
数時間借りるだけ、ちゃんと管理してますか？
たまに、返し忘れ(遅れ)がある、紙で管理してるが、面倒で書いてない、字が汚い読めない、ことも

入館証のNFCで管理、
NFCタッチなしで振動後、電波が来なくなったら、勝手に持ち出されたのでアラーム

https://www.npmjs.com/package/node-enocean-utils

----

振動時刻　＝　最終通信時刻　＆　現在時刻　－　振動時刻　＞　60秒
　存在しない

------

EnOceanのI/F起動
  sudo EnOceanGateways/DolphinRide/dpride/dprided.sh

  cd ShareMngEnOcean

カードリーダー起動
  python cardreader.py

EnOcean起動
  node enocean.js
