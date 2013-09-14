dbs
===

# Dou Butsu Shogi JS

Javascriptでうごくどうぶつしょうぎです。開発者募集中です。

最終的にはAI同士の対戦を可能にしたいです。

## TODO（やりたいこと）

* 有効手列挙
* 勝敗判定
* エンドゲーム問題（n手勝ちの有無を判定する）
* 詰めどうぶつしょうぎ（n手詰めの有無を判定する）
* 評価関数登録によるどうぶつしょうぎAIの作成
* モンテカルロ法
* ランダム局面生成と局面特徴の抽出による機械学習
* リファクタリング
  * Banmen.hash() で圧縮データを取得できると良い
  * 一部関数、定数のオブジェクト定義への移動

## API

* showBan() UIにbanを反映する
* new Hand(from, to, reverseFlag) fromからtoへ駒を移動する手を生成する。
  * reverseFlag(default false)が立っているとひよこがにわとりになる。
  * fromが-1以下なら持ち駒を打つ(-1先手ひよこ -3先手象...-6後手ひよこ...-10後手ライオン)
* Hand.execute() Handの結果をglobalなbanに反映する。
* new Banmen() 新規盤面を生成する
  * execute(hand) 手を実行した結果の盤面を返す
  * createLegalHands(isBlackTurn) 現在局面で実行可能な手のリストを取得する
