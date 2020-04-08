/**
 * 棋盘
 */

import { PLAYER_COLOR, DISCARDED_CHESS, CHESS_TYPE } from './map'

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
    return this.chessPool.filter(chess => chess.position === DISCARDED_CHESS)
  }
  get usableChessPool() {
    return this.chessPool.filter(chess => chess.position !== DISCARDED_CHESS)
  }
  get jiangshuaiChesses() {
    return this.usableChessPool.filter(
      chess => chess.type === CHESS_TYPE.JIANG_SHUAI
    )
  }
  get ownChessboardScope(color) {
    if (color === PLAYER_COLOR.RED) {
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
   * 初始化棋谱
   */
  initChessMap(chessMap) {
    if (!Array.isArray(chessMap)) {
    }
  }
  /**
   * 根据位置获取具体的棋子
   * @param {String} position
   */
  getChess(position) {
    return this.chessPool.find(chess => chess.position === position)
  }
  /**
   * 废弃掉棋子
   * @param {String} position
   */
  discard(position) {
    const discardedChess = this.getChess(position)

    discardedChess.setPosition(DISCARDED_CHESS)
  }
  /**
   * 获取棋盘上某列的棋子
   */
  getChessForColumn(index) {
    return this.usableChessPool.filter(chess => chess.point[1] === index)
  }
  /**
   * 获取棋盘上某行的棋子
   */
  getChessForRow(index) {
    return this.usableChessPool.filter(chess => chess.point[0] === index)
  }
  /**
   * 河界线
   */
  getHejiexian(player) {
    if (player === PLAYER_COLOR.RED) {
      return this.grid[4]
    } else {
      return this.grid[5]
    }
  }
  /**
   * 兵行线
   */
  getBingxingxian(player) {
    if (player === PLAYER_COLOR.RED) {
      return this.grid[3]
    } else {
      return this.grid[6]
    }
  }
  /**
   * 宫顶线
   */
  getGongdingxian(player) {
    if (player === PLAYER_COLOR.RED) {
      return this.grid[2]
    } else {
      return this.grid[7]
    }
  }
  /**
   * 底二路
   */
  getDierlu(player) {
    if (player === PLAYER_COLOR.RED) {
      return this.grid[1]
    } else {
      return this.grid[8]
    }
  }
  /**
   * 底线
   */
  getDixian(player) {
    if (player === PLAYER_COLOR.RED) {
      return this.grid[0]
    } else {
      return this.grid[9]
    }
  }
  /**
   * 九宫
   */
  getJiugong(color) {
    if (color === PLAYER_COLOR.RED) {
      return [
        [this.grid[0][3], this.grid[0][4], this.grid[0][4]],
        [this.grid[1][3], this.grid[1][4], this.grid[1][4]],
        [this.grid[2][3], this.grid[2][4], this.grid[2][4]]
      ]
    } else {
      return [
        [this.grid[9][5], this.grid[9][4], this.grid[9][3]],
        [this.grid[8][5], this.grid[8][4], this.grid[8][3]],
        [this.grid[7][5], this.grid[7][4], this.grid[7][3]]
      ]
    }
  }
}
