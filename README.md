dbs
===

# Dou Butsu Shogi JS

Javascriptでうごくどうぶつしょうぎです。開発者募集中です。

最終的にはAI同士の対戦を可能にしたいです。

## TODO

* 有効手列挙
* 勝敗判定

## API

* showBan() UIにbanを反映する
* new Hand(from, to, reverseFlag) fromからtoへ駒を移動する手を生成する。
  * reverseFlag(default false)が立っているとひよこがにわとりになる。
  * fromが-1なら持ち駒を打つ
* Hand.execute() Handの結果をglobalなbanに反映する。
