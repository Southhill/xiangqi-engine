/**
 * 棋手
 * 甲方在前，乙方在后
 */
import { PLAYER_COLOR } from './map'

export default class Player {
  constructor(name, chessboard) {
    /**
     * 棋手的势力：甲方，乙方
     */
    this.name = name
    /**
     * 棋手的颜色：红色，黑色。
     * 真实的棋局中，红色棋手先走
     */
    this.color = ''
    /**
     * 棋盘
     */
    this.chessboard = null
  }

  get ownChessboard() {
    if (this.type === PLAYER_COLOR.RED) {
      return this.chessboard.grid.slice(0, 5)
    } else {
      return this.chessboard.grid.slice(5)
    }
  }
  get ownChessboardScope() {
    if (this.type === PLAYER_COLOR.RED) {
      return [
        [0, 0],
        [4, 8]
      ]
    } else {
      return [
        [5, 0],
        [9, 8]
      ]
    }
  }

  /**
   * 设置棋手的颜色
   * @param {String} color
   */
  setColor(color) {
    this.color = color
  }
  /**
   * 关联棋盘
   */
  sitdown(chessboard) {
    this.chessboard = chessboard
  }
}
