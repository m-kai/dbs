dbs
===

# Dou Butsu Shogi JS

Javascriptでうごくどうぶつしょうぎです。最終的にはAI同士の対戦を可能にしたいです。

## TODO

* 有効手列挙
* 勝敗判定

## API

* showBan() UIにbanを反映する
* new Hand(from, to, reverseFlag) fromからtoへ駒を移動する手を生成する。reverseFlagが立っているとひよこがにわとりになる。
* Hand.execute(vban) Handの結果をvbanあるいはglobalなbanに反映する。
  * TODO vbanの時に持ち駒がアレ。持ち駒情報もvbanに含めるか、Banmenクラスを作るべき