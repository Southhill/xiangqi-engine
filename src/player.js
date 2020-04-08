/**
 * 棋手
 */
import { PLAYER_COLOR, CHESS_TYPE } from './map'

export default class Player {
  constructor(name) {
    /**
     * 棋手的名称：甲方，乙方
     */
    this.name = name
    /**
     * 棋手的颜色：红色，黑色。真实的棋局中，红色棋手先走
     */
    this.color = ''
    /**
     * 棋盘
     */
    this.chessboard = null
  }

  get ownChessboard() {
    if (this.color === PLAYER_COLOR.RED) {
      return this.chessboard.grid.slice(0, 5)
    } else {
      return this.chessboard.grid.slice(5)
    }
  }
  get ownChessboardScope() {
    if (this.color === PLAYER_COLOR.RED) {
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
   * 丢失了将帅旗，也即对战失败了
   */
  get lostJiangshuaiChess() {
    return (
      this.chessPool.findiIndex(
        chess => chess.type === CHESS_TYPE.JIANG_SHUAI
      ) === -1
    )
  }

  /**
   * 棋手当前在棋局上的棋子
   */
  get chessPool() {
    return this.chessboard.usableChessPool.filter(
      chess => chess.color === this.color
    )
  }
  /**
   * 该棋手的所有可用的棋子的全部走法
   */
  get allChessTread() {
    const result = []

    this.chessPool.forEach(chess => {
      result.push(...chess.treads)
    })

    const zhiquzhongjun = this.zhiquzhongjun

    // 当可以直取中军时，将中军（对方的将帅棋）的位置加入到走法中
    if (zhiquzhongjun) {
      result.push(zhiquzhongjun.position)
    }

    return result
  }
  /**
   * 获取棋手的将帅棋
   */
  get jiangshuaiChess() {
    return this.chessPool.find(chess => chess.type === CHESS_TYPE.JIANG_SHUAI)
  }
  /**
   * 可以直取中军(将吃帅操作)
   */
  get zhiquzhongjun() {
    const chesses = this.chessboard.getChessForColumn(
      this.jiangshuaiChess.point[1]
    )

    return (
      chesses.length === 2 &&
      chesses.every(chess => chess.type === CHESS_TYPE.JIANG_SHUAI) &&
      chesses.find(chess => chess.position !== this.jiangshuaiChess.position)
    )
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
  /**
   * 棋手下棋
   */
  playChess(from, to) {
    const chess = this.chessboard.getChess(from)

    if (this.chessboard.getChess(to)) {
      this.chessboard.discard(to)
    }

    chess.setPosition(to)
  }
}
