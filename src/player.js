/**
 * 棋手
 */
import { CHESS_TYPE } from './map.js'
import { stringTread } from './utils.js'

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
   * 棋手当前在棋局上的所有己方可用的棋子
   */
  get selfChessPool() {
    return this.chessboard.usableChessPool.filter(
      (chess) => chess.color === this.color
    )
  }
  /**
   * 丢失了将帅旗，也即对战失败了
   */
  get lostJiangChess() {
    return (
      this.selfChessPool.findIndex(
        (chess) => chess.type === CHESS_TYPE.JIANG
      ) === -1
    )
  }

  /**
   * 该棋手的所有可用的棋子的全部走法
   */
  get allChessTread() {
    const result = []

    this.selfChessPool.forEach((chess) => {
      const treads = chess.getTreads(this.chessboard).map((pos) => {
        return stringTread({ from: chess.position, to: pos, chess })
      })

      result.push(...treads)
    })

    return result
  }
  /**
   * 获取棋手的将帅棋
   */
  get jiangChess() {
    return this.selfChessPool.find((chess) => chess.type === CHESS_TYPE.JIANG)
  }

  /**
   * 获取己方某个位置的棋子
   */
  getSelfChess(position) {
    return this.selfChessPool.find((chess) => chess.position === position)
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
   * 棋手下棋，返回`null`表明预定下棋位置错误
   */
  playChess(from, to) {
    // 获取from处的棋子
    const chess = this.getSelfChess(from)
    // 获取所有下法
    const treads = chess.getTreads(this.chessboard)

    if (!treads.includes(to)) {
      return null
    }

    this.chessboard.playChess({ chess, from, to })
  }
}
