/**
 * 棋局
 */
import Player from './player'
import Chessboard from './chessboard'

import { CHESSGAME_STATUS, PLAYER_COLOR } from './map'

export default class Chessgame {
  constructor() {
    /**
     * 当前棋手
     */
    this.player = null
    /**
     * 下一位棋手
     */
    this.nextPlayer = null
    /**
     * 棋局状态
     */
    this.status = CHESSGAME_STATUS.VS
    /**
     * 胜者
     */
    this.winner = ''
    /**
     * 棋盘
     */
    this.chessboard = null
    /**
     * 棋手名映射表
     */
    this.otherPlayerNameMap = null
  }
  /**
   * 当前执棋者的名称
   */
  get currentPlayerName() {
    return this.player.name
  }
  /**
   * 棋盘处于将军状态
   */
  get isJiangjun() {
    return [
      this.status === CHESSGAME_STATUS.JIANG_JUN,
      {
        jiangjunzhe: this.currentPlayerName,
        bei_jiangjunzhe: this.otherPlayerNameMap[this.currentPlayerName]
      }
    ]
  }
  /**
   * 当前执棋者可以下棋
   */
  get canPlay() {
    // 棋局处于对战状态并且当前棋手有棋子可下
    return this.status === GAME_STATUS.vs
  }
  /**
   * 猜和
   *
   * 返回`true`，表示第一位棋手为红方
   *
   * 返回`false`，表示第二位棋手为红方
   */
  static guessFirst() {
    return Math.random() > 0.5
  }

  setup(firstPlayerName = 'jia_fang', secondPlayerName = 'yi_fang', chessMap) {
    // 初始化棋手
    if (
      typeof firstPlayerName !== 'string' ||
      typeof secondPlayerName !== 'string' ||
      firstPlayerName === secondPlayerName
    ) {
      throw new Error('棋手名称不能重复，必须唯一！')
    }

    const firstPlayer = new Player(firstPlayerName)
    const secondPlayer = new Player(secondPlayerName)
    const guessFirstResult = Chessgame.guessFirst()

    this.otherPlayerNameMap = {
      [firstPlayerName]: secondPlayerName,
      [secondPlayerName]: firstPlayerName
    }

    if (guessFirstResult) {
      firstPlayer.setColor(PLAYER_COLOR.RED)
      secondPlayer.setColor(PLAYER_COLOR.BLACK)

      this.player = firstPlayer
      this.nextPlayer = secondPlayer
    } else {
      firstPlayer.setColor(PLAYER_COLOR.BLACK)
      secondPlayer.setColor(PLAYER_COLOR.RED)

      this.player = secondPlayer
      this.nextPlayer = firstPlayer
    }

    // 初始化棋盘
    this.chessboard = new Chessboard()
    // 初始化棋谱
    this.chessboard.initChessMap(chessMap)

    this.player.sitdown(this.chessboard)
    this.nextPlayer.sitdown(this.chessboard)
  }
  playChess(from, to) {
    if (this.canPlay) {
      this.player.playChess(from, to)

      // 设置棋盘状态, 返回false说明棋局已决出胜负
      if (this.checkChessGameStatus()) {
        // 棋手轮转
        this.turnToNext()
      }
    }
  }
  /**
   * 棋局控制权轮转到下一位
   */
  turnToNext() {
    const temp = this.player

    this.player = this.nextPlayer
    this.nextPlayer = temp
  }
  /**
   * 判断下一位棋手的将帅棋是否被将军
   */
  checkJiangjun() {
    return (
      this.player.allChessTread.indexOf(
        this.nextPlayer.jiangshuaiChess.position
      ) > -1
    )
  }
  /**
   * 检测棋局状态
   *
   * 返回`false`表明棋局已决出胜负
   *
   * 返回`true`表明棋局还在对战中
   */
  checkChessGameStatus() {
    // 对方棋手的将帅棋子已经被吃
    if (this.nextPlayer.lostJiangshuaiChess) {
      this.status = CHESSGAME_STATUS.WIN
      this.winner = this.currentPlayerName

      return false
    }
    // 判断棋子是否会[将军]到对方的**将帅**
    if (this.checkJiangjun()) {
      this.status = CHESSGAME_STATUS.JIANG_JUN
    }

    return true
  }
}
