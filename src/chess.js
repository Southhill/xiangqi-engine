/**
 * 棋子
 */
import { CHESS_TYPE } from './map'

class BaseChess {
  constructor(player, chessboard) {
    /**
     * 该棋子的棋手信息
     */
    this.player = player

    /**
     * 该棋子的棋盘信息
     */
    this.chessboard = chessboard
  }

  get chessboard() {
    return this.chessboard.grid
  }
}

class JIANG_SHUAI_Chess extends BaseChess {
  constructor(position, player, chessboard) {
    super(player, chessboard)

    this.position = position
  }

  /**
   * 棋子类型
   */
  get type() {
    return CHESS_TYPE.JIANG_SHUAI
  }

  /**
   * 走法
   */
  get treads() {
    return []
  }

  /**
   * 该类型棋子行走范围
   * 将帅棋只能走九宫格
   */
  get walkScope() {
    return ''
  }

  /**
   * 创造棋子
   */
  create() {}
}
