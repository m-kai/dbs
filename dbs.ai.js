// AI
// execute(banmen, isBlackTurn)関数とmemoを実装すればOK

// AI一般をあらわす抽象クラス
function AI() {
}

AI.prototype = {
  memo : "", // viewに表示したりする
  maxDepth : 3, // alphaBeta探索時の最大探索深度
  number : 0, // 読んだ手数

  // 探索を実行し結果(hand)を返す
  execute : function(banmen, isBlackTurn) {
    this.memo = ""
    this.number = 0
    this.startTime = new Date().getTime()

    var hands = banmen.createLegalHands(isBlackTurn)

    for(var depth = 0;depth <= this.maxDepth;depth++) {
      hands = this.searchTree(banmen, isBlackTurn, depth, hands)
      if(3000 < new Date().getTime() - this.startTime) break // 5秒で探索終了
    }

    return hands[0]
  },

  // 標準探索アルゴリズム：反復深化法
  searchTree : function(banmen, isBlackTurn, depth, hands){
    var maxId = 0
    var maxValue = -Infinity
    var minId = 0
    var minValue = Infinity
    var a = -Infinity
    var b = Infinity
    var result = []
    var memo = ""

    for(var i = 0;i < hands.length;i++) {
      var v = this.alphaBeta(
        banmen.execute(hands[i]), !isBlackTurn, depth,
        a, b
      )
      if(maxValue < v){
        maxId = i
        maxValue = v
        if(isBlackTurn) a = v
      } else if(v < minValue) {
        minId = i
        minValue = v
        if(!isBlackTurn) b = v
      }
      memo += hands[i].from + "->" + hands[i].to + " : " + v + "\n"
      result.push([hands[i], v])
    }
    var duration = new Date().getTime() - this.startTime
    this.memo = "depth " + depth + "\n" +
        "total " + this.number + " move\n" +
        "use " + duration + " ms\n" +
        "speed " + (this.number*1000/duration) + " move/sec\n\n" +
        memo + "\n" +
        this.memo
    if(isBlackTurn) {
      result.sort(function(a,b) {return b[1]-a[1]})
    } else {
      result.sort(function(a,b) {return a[1]-b[1]})
    }
      return result.map(function(x){return x[0]})
  },

  // 標準探索アルゴリズム：αβカット
  alphaBeta : function(cban, isBlackTurn, depth, a, b) {
    this.number++
    var eg
    if(eg = cban.checkEndGame()) {
      // 終局まで探索
      if(eg == BLACK_WIN) return Infinity
      if(eg == WHITE_WIN) return -Infinity
      return 0
    } else if(depth == 0) {
      // 探索打ち切り。評価関数による局面評価
      return this.evaluate(cban, isBlackTurn)
    }
    var hands = cban.createLegalHands(isBlackTurn)
    if(isBlackTurn) {
      for(var i = 0;i < hands.length;i++) {
        a = Math.max(a, this.alphaBeta(cban.execute(hands[i]), !isBlackTurn, depth - 1, a, b))
        if(b <= a){
          return a // βカット
        }
      }
      return a
    } else {
      for(var i = 0;i < hands.length;i++) {
        b = Math.min(b, this.alphaBeta(cban.execute(hands[i]), !isBlackTurn, depth - 1, a, b))
        if(b <= a){
          return b // αカット
        }
      }
      return b
    }
  },

  // 評価関数です。通常はこれを実装すると良いです。
  // 戻り値として大きな値は先手有利、小さい値は後手有利と考えます。
  evaluate : function(cban, isBlackTurn) {
    return 0;
  },
}

// AIサンプル：モンテカルロ
// 評価関数を使わない人です。
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
        while(!cban.checkEndGame()) {
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

// AI:モンテカルロ法を動的評価関数として使うヤツ
function MonteCarloSpecial(maxDepth, trials) {
  this.maxDepth = maxDepth || 7
  this.trials = trials || 10
}

MonteCarloSpecial.prototype = new AI()
MonteCarloSpecial.prototype.evaluate = function(cban, isBlackTurn) {
  result = [0, 0, 0, 0]
  for(var j = 0;j < this.trials;j++) {
    // 決着付くまでランダム試行する
    tban = cban
    cturn = isBlackTurn
    while(!tban.checkEndGame()) {
      chands = tban.createLegalHands(cturn)
      cturn = !cturn
      ch = chands[Math.floor(Math.random() * chands.length)]
      tban = tban.execute(ch)
    }
    result[tban.checkEndGame()]++
  }
  return result[BLACK_WIN] - result[WHITE_WIN]
}

