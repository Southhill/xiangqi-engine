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
      const treads = chess.getTreads(this.chessboard)

      result.push(...treads)
    })

    return result
  }
  /**
   * 获取棋手的将帅棋
   */
  get jiangshuaiChess() {
    return this.chessPool.find(chess => chess.type === CHESS_TYPE.JIANG_SHUAI)
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
   * 棋手下棋，返回`false`表明预定下棋位置错误
   */
  playChess(from, to) {
    if (this.allChessTread.indexOf(to) === -1) {
      return false
    }

    const chess = this.chessboard.getChess(from)

    if (this.chessboard.getChess(to)) {
      this.chessboard.discard(to)
    }

    chess.setPosition(to)

    return true
  }
}
