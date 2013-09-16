// AI
// execute(banmen, isBlackTurn)関数とmemoを実装すればOK

// AI一般をあらわす抽象クラス
function AI() {
}

AI.prototype = {
  memo : "", // viewに表示したりする

  // 探索を実行し結果(hand)を返す
  execute : function(banmen, isBlackTurn) {
    return new Hand()
  },
}

// AIサンプル：モンテカルロ
function MonteCarloAI(trials) {
  this.trials = trials // 一手毎の試行回数
}

MonteCarloAI.prototype = new AI()
MonteCarloAI.prototype.execute = function(banmen, isBlackTurn) {
    var hands = banmen.createLegalHands(isBlackTurn)
    var results = []
    var maxId = 0
    this.memo = ""

    // 探索
    for(var i = 0;i < hands.length;i++) {
      results.push([0,0,0,0])
      for(var j = 0;j < this.trials;j++) {
        // 決着付くまでランダム試行する
        cban = banmen.execute(hands[i])
        cturn = isBlackTurn
        while(cban.checkEndGame() == 0) {
          cturn = !cturn
          chands = cban.createLegalHands(cturn)
          ch = chands[Math.floor(Math.random() * chands.length)]
          cban = cban.execute(ch)
        }
        results[i][cban.checkEndGame()]++
      }
      if(isBlackTurn) {
        results[i][0] = results[i][BLACK_WIN] - results[i][WHITE_WIN]
      } else {
        results[i][0] = results[i][WHITE_WIN] - results[i][BLACK_WIN]
      }
      if(results[maxId][0] < results[i][0]) maxId = i
      this.memo = this.memo + hands[i].from + "->" + hands[i].to + " "
          + results[i][BLACK_WIN] + " : "
          + results[i][WHITE_WIN] + " : "
          + results[i][DRAW_GAME] + "\n"
    }

    return hands[maxId]
  }
