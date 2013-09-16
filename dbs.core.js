// ---- 言語拡張 ----

// 配列コピー
Array.prototype.clone = function(){
  var arr = []
  for(var i = 0;i < this.length;i++) arr[i] = this[i]
  return arr
}

// 正負反転
Array.prototype.negative = function(){
  var arr = []
  for(var i = 0;i < this.length;i++) arr[i] = -this[i]
  return arr
}

// 存在確認
Array.prototype.contains = function(obj){
  for(var i = 0;i < this.length;i++) {
    if(this[i] == obj) return true
  }
  return false
}

// ---- 定数定義----

// 駒定数定義
const SPACE = -1
const BABY = 0
const CHICKEN = 1
const ELEPHANT = 2
const GIRAFFE = 3
const LION = 4
const WHITE = 5

// 駒動き定義
const DIRECTIONS = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1]
]

const BABY_MOVES = [-3]
const CHIKEN_MOVES = [-4, -3, -2, -1, 1, 3]
const ELEPHANT_MOVES = [-4, -2, 2, 4]
const GIRAFFE_MOVES = [-3, -1, 1, 3]
const LION_MOVES = [-4, -3, -2, -1, 1, 2, 3, 4]

const MOVES = [
  BABY_MOVES, CHIKEN_MOVES, ELEPHANT_MOVES, GIRAFFE_MOVES, LION_MOVES,
  BABY_MOVES.negative(), CHIKEN_MOVES.negative(), ELEPHANT_MOVES.negative(),
  GIRAFFE_MOVES.negative(), LION_MOVES.negative(),
]

// 盤面のデフォルト
const BAN_DEFAULT = [
  GIRAFFE + WHITE, LION + WHITE, ELEPHANT + WHITE,
  SPACE, BABY + WHITE, SPACE,
  SPACE, BABY, SPACE,
  ELEPHANT, LION, GIRAFFE
]

// 盤面のデフォルト持ち駒
const MOCHI_DEFAULT = [
  0,0,0,0,0,
  0,0,0,0,0,
]

// 終了判断
const ON_GAME = 0
const BLACK_WIN = 1
const WHITE_WIN = 2
const DRAW_GAME = 3

// ---- Model ----

// 駒反転 TODO Banmenメンバにする
function reverseBW(koma){
  return (1 - Math.floor(koma / WHITE)) * WHITE + (koma % WHITE)
}

// にわとりをひよこに戻す TODO Banmenメンバにする
function chikin2baby(koma){
  if(koma == CHICKEN) return BABY
  if(koma == CHICKEN + WHITE) return BABY + WHITE
  return koma
}

// 盤面
function Banmen(ban, mochi){
  this.ban = ban || BAN_DEFAULT.clone()
  this.mochi = mochi || MOCHI_DEFAULT.clone()
}

Banmen.prototype = {
  ban : BAN_DEFAULT.clone(),
  mochi : MOCHI_DEFAULT.clone(),
  
  // 新しい盤面に対して手を実行する
  execute : function(hand){
    if(!hand) return

    var nextBan = this.clone()

    if(0 <= nextBan.ban[hand.to]){
      // 駒を取る
      nextBan.mochi[chikin2baby(reverseBW(nextBan.ban[hand.to]))]++
    }
    if(hand.from < 0){
      // 持ち駒使用
      var i = -hand.from - 1
      nextBan.mochi[i]--
      nextBan.ban[hand.to] = i
    } else {
      // 普通の移動
      nextBan.ban[hand.to] = nextBan.ban[hand.from] + (hand.reverse ? 1 : 0)
      nextBan.ban[hand.from] = SPACE
    }

    return nextBan
  },
  
  // コピーを作る
  clone : function(){
    return new Banmen(this.ban.clone(), this.mochi.clone())
  },

  // 合法手リストを取得する
  createLegalHands : function(isBlackTurn){
    var hands = []
    // 目的マスでループ
    for(var to = 0;to < this.ban.length;to++){
      var x = to % 3
      var y = Math.floor(to / 3)
      // 味方駒存在チェック
      if(isBlackTurn && 0 <= this.ban[to] && this.ban[to] < 5) continue
      if(!isBlackTurn && WHITE <= this.ban[to] && this.ban[to] < 5 + WHITE) continue
      // 周辺8マスの駒をサーチ
      for(var j = 0;j < DIRECTIONS.length;j++) {
        var fx = x + DIRECTIONS[j][0]
        var fy = y + DIRECTIONS[j][1]
        var from = fx + fy * 3
        // 境界
        if(fx < 0 || 3 <= fx || fy < 0 || 4 <= fy) continue
        // 手番の駒
        if(this.ban[from] < (isBlackTurn ? 0 : WHITE)
            || (isBlackTurn ? 4 : 4 + WHITE) < this.ban[from]) continue
        //
        if(MOVES[this.ban[from]].contains(to - from)){
          hands.push(new Hand(from, to))
          // 成チェック
          if(isBlackTurn && this.ban[from] == BABY && y == 0)
            hands.push(new Hand(from, to, true))
          if(!isBlackTurn && this.ban[from] == WHITE + BABY && y == 3)
            hands.push(new Hand(from, to, true))
        }
      }

      // 持ち駒打ち編
      // 駒存在チェック
      if(0 <= this.ban[to] && this.ban[to] < 5 + WHITE) continue
      // 持ち駒をサーチ
      for(j = 0;j < 5;j++) {
        var k = j + (isBlackTurn ? 0 : WHITE)
        if(this.mochi[k] <= 0) continue
        hands.push(new Hand(-1 - k, to))
      }
    }
    return hands
  },

  // 勝敗判定
  checkEndGame : function() {
    if(0 < this.mochi[LION] && 0 < this.mochi[WHITE + LION]) return DRAW_GAME
    if(0 < this.mochi[LION]) return BLACK_WIN
    if(this.mochi[WHITE + LION]) return WHITE_WIN
    // TODO トライ判定
    // TODO 千日手判定
    return ON_GAME
  },
}

// 手
function Hand(from, to, reverse){
  this.from = from == null ? -1 : from
  this.to = to == null ? -1 : to
  this.reverse = reverse || false
}

Hand.prototype = {
  from : -1,
  to : -1,
  reverse : false,
}

// AIサンプル：モンテカルロ
function MonteCarloAI(trials) {
  this.trials = trials // 一手毎の試行回数
}

MonteCarloAI.prototype = {
  memo : "", // viewに表示したりする

  // 探索を実行し結果(hand)を返す
  execute : function(banmen, isBlackTurn){
    var hands = banmen.createLegalHands(isBlackTurn)
    var results = []
    var maxId = 0
    this.memo = ""

    // 探索
    for(i = 0;i < hands.length;i++) {
      results.push([0,0,0,0])
      for(j = 0;j < this.trials;j++) {
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
}
