/**
 * 棋盘
 */

import { PLAYER_COLOR, DISCARDED_CHESS, CHESS_TYPE } from './map'
import createChess, { createStandardChessMap } from './chess'

export default class Chessboard {
  constructor() {
    /**
     * 棋盘网格，并为每个网格填充相关的位置信息
     */
    this.grid = Array.from(Array(10), (_, index) =>
      Array.from(Array(9), (_, idx) => `${index},${idx}`)
    )
    /**
     * 当前棋盘所有的棋子
     */
    this.chessPool = []
  }
  get discardedChessPool() {
    return this.chessPool.filter((chess) => chess.position === DISCARDED_CHESS)
  }
  get usableChessPool() {
    return this.chessPool.filter((chess) => chess.position !== DISCARDED_CHESS)
  }
  get jiangshuaiChesses() {
    return this.usableChessPool.filter(
      (chess) => chess.type === CHESS_TYPE.JIANG_SHUAI
    )
  }
  get chessboardScope() {
    return [
      [0, 0],
      [9, 8],
    ]
  }
  /**
   * 初始化棋谱
   */
  initChessMap(chessMap) {
    if (Array.isArray(chessMap)) {
      chessMap.forEach((item) => {
        this.chessPool.push(createChess(item))
      })
    } else {
      const allChess = createStandardChessMap()

      allChess.forEach((chess) => {
        this.chessPool.push(chess)
      })
    }
  }
  /**
   * 获取某颜色棋手的己方棋盘位置的矩形信息
   * @param {String} color
   */
  getOwnChessboardScope(color) {
    if (color === PLAYER_COLOR.RED) {
      return [
        [0, 0],
        [4, 8],
      ]
    } else {
      return [
        [5, 0],
        [9, 8],
      ]
    }
  }
  /**
   * 根据位置获取具体的棋子
   * @param {String} position
   */
  getChess(position) {
    return this.usableChessPool.find((chess) => chess.position === position)
  }
  /**
   * 从废弃棋子池中捞取某一手吃掉的棋子
   * @param {Number} playOrder
   */
  getDiscardedChess(playOrder) {
    return this.discardedChessPool.find(
      (chess) => chess.playOrder === playOrder
    )
  }
  /**
   * 棋盘给定位置存在有效的棋子
   */
  hasChess(position) {
    return (
      this.usableChessPool.findIndex((chess) => chess.position === position) >
      -1
    )
  }
  /**
   * 给定位置的棋子位于棋盘边界上
   * @param {String} position
   */
  isBorderLineChess(position) {
    const [x, y] = position.split(',').map(Number)

    return x === 0 || x === 9 || y === 0 || y === 8
  }
  /**
   * 废弃掉棋子
   * @param {String} position
   */
  discard(position, playOrder) {
    const discardedChess = this.getChess(position)

    discardedChess.setPosition(DISCARDED_CHESS, () => {
      discardedChess.playOrder = playOrder
    })

    return discardedChess
  }
  /**
   * 获取棋盘上某列的棋子
   */
  getChessForColumn(index) {
    return this.usableChessPool
      .filter((chess) => chess.point[1] === index)
      .sort((chessA, chessB) => chessB.point[0] > chessA.point[0])
  }
  /**
   * 获取棋盘上某行的棋子
   */
  getChessForRow(index) {
    return this.usableChessPool
      .filter((chess) => chess.point[0] === index)
      .sort((chessA, chessB) => chessB.point[1] > chessA.point[1])
  }
}
