/**
 * 棋盘
 */

import { PLAYER_TYPE, DISCARDED_CHESS } from './map'

export default class Chessboard {
  constructor(chessMap) {
    /**
     * 棋盘网格
     */
    this.grid = Array(10).fill(Array(9).fill(null))
    /**
     * 当前棋盘可用的棋子
     */
    this.chessPool = chessMap
  }
  get discardedChessPool() {
    return this.chessPool.filter(chess => chess.position === DISCARDED_CHESS)
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
   * 河界线
   */
  getHejiexian(player) {
    if (player === PLAYER_TYPE.JIA_FANG) {
      return this.grid[4]
    } else {
      return this.grid[5]
    }
  }
  /**
   * 兵行线
   */
  getBingxingxian(player) {
    if (player === PLAYER_TYPE.JIA_FANG) {
      return this.grid[3]
    } else {
      return this.grid[6]
    }
  }
  /**
   * 宫顶线
   */
  getGongdingxian(player) {
    if (player === PLAYER_TYPE.JIA_FANG) {
      return this.grid[2]
    } else {
      return this.grid[7]
    }
  }
  /**
   * 底二路
   */
  getDierlu(player) {
    if (player === PLAYER_TYPE.JIA_FANG) {
      return this.grid[1]
    } else {
      return this.grid[8]
    }
  }
  /**
   * 底线
   */
  getDixian(player) {
    if (player === PLAYER_TYPE.JIA_FANG) {
      return this.grid[0]
    } else {
      return this.grid[9]
    }
  }
  /**
   * 九宫
   */
  getJiugong(player) {
    if (player === PLAYER_TYPE.JIA_FANG) {
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
