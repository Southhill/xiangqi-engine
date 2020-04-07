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
  }
  /**
   * 猜和
   * 返回`true`，表示第一位棋手为红方
   * 返回`false`，表示第二位棋手为红方
   */
  static guessFirst() {
    return Math.random() > 0.5
  }

  setup(firstPlayerName = 'jia_fang', secondPlayerName = 'yi_fang') {
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

    this.player.sitdown(this.chessboard)
    this.nextPlayer.sitdown(this.chessboard)
  }
  playChess() {
    this.player.playChess()

    this.checkChessGameStatus()

    this.turnToNext()
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
   * 检测棋局状态
   */
  checkChessGameStatus() {}
}
