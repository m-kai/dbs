dbs
===

# Dou Butsu Shogi JS

Javascriptでうごくどうぶつしょうぎです。開発者募集中です。

最終的にはAI同士の対戦を可能にしたいです。

## TODO（やりたいこと）

* コンピュータに負けた時の判定が一手遅れるバグ修正
* エンドゲーム問題（n手勝ちの有無を判定する）
* 詰めどうぶつしょうぎ（n手詰めの有無を判定する）
* 評価関数登録によるどうぶつしょうぎAIの作成
* ランダム局面生成と局面特徴の抽出による機械学習
* リファクタリング
  * 一部関数、定数のオブジェクト定義への移動

## API

* dbs.html
    * showBan() UIにbanを反映する
    * mv(from, to, reverse) 指定手を現在局面に反映する
* dbs.core.js
    * new Hand(from, to, reverseFlag) fromからtoへ駒を移動する手を生成する。
        * reverseFlag(default false)が立っているとひよこがにわとりになる。
        * fromが-1以下なら持ち駒を打つ(-1先手ひよこ -3先手象...-6後手ひよこ...-10後手ライオン)
    * Hand.execute() Handの結果をglobalなbanに反映する。
    * new Banmen() 新規盤面を生成する
        * execute(hand) 手を実行した結果の盤面を返す
        * createLegalHands(isBlackTurn, isCheck) 現在局面で実行可能な手のリストを取得する。isCheckがtureであれば王手のみを探索する
        * checkEndGame() 決着局面判定する
    * MonteCarloAI(trials) 試行回数を指定してAIを生成する(1000ぐらいで十分収束する)
        * execute(banmen, isBlackTurn) 局面を評価し最有力のHandを返す
        * memo 各手の評価メモ
