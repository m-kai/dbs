dbs
===

# Dou Butsu Shogi JS

Javascriptでうごくどうぶつしょうぎです。開発者募集中です。

最終的にはAI同士の対戦を可能にしたいです。

## TODO（やりたいこと）

* データ構造変更。盤面を持駒込みで１オブジェクトにする。
  * Banmen.execute(hand) を新規盤面を返すように変更
  * Banmen.hash() で圧縮データを取得できると良い
  * 一部関数、定数のオブジェクト定義への移動
* 有効手列挙
* 勝敗判定
* エンドゲーム問題（n手勝ちの有無を判定する）
* 詰めどうぶつしょうぎ（n手詰めの有無を判定する）
* 評価関数登録によるどうぶつしょうぎAIの作成
* ランダム局面生成と局面特徴の抽出による機械学習

## API

* showBan() UIにbanを反映する
* new Hand(from, to, reverseFlag) fromからtoへ駒を移動する手を生成する。
  * reverseFlag(default false)が立っているとひよこがにわとりになる。
  * fromが-1なら持ち駒を打つ
* Hand.execute() Handの結果をglobalなbanに反映する。
* new Banmen() 新規盤面を生成する
  * execute(hand) 手を実行する。（Banmen自体が変化する。本当は新規盤面を返したほうが良さげ）