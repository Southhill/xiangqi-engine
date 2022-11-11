/**
 * 棋盘
 */

import createChess, { createStandardChessMap } from './chess.js'
import evaluate from './evaluate.js'
import { createChessboardGrid, locateEdge, parseTread } from './utils.js'
import { CHESS_COLOR, DISCARDED_CHESS, CHESS_TYPE } from './map.js'
import { PlayRecordTable } from './playrecord.js'

export default class Chessboard {
  constructor() {
    /**
     * 棋盘网格，并为每个网格填充相关的位置信息
     */
    this.grid = createChessboardGrid()
    /**
     * 当前棋盘所有的棋子
     */
    this.chessPool = []
    /**
     * 当前棋盘的价值
     */
    this.value = 0
    /**
     * 当前棋盘的模拟
     */
    this.simulator = new Simulator()
    /**
     * 走法记录表：用于悔棋(撤销)
     */
    this.playRecordTable = new PlayRecordTable();
  }
  get discardedChessPool() {
    return this.chessPool.filter((chess) => chess.position === DISCARDED_CHESS)
  }
  get usableChessPool() {
    return this.chessPool.filter((chess) => chess.position !== DISCARDED_CHESS)
  }
  get jiangChesses() {
    return this.usableChessPool.filter(
      (chess) => chess.type === CHESS_TYPE.JIANG
    )
  }
  /**
   * 棋盘上所有的大（强）子：車，馬，炮
   */
  get bigChesses() {
    return this.usableChessPool.filter((chess) =>
      [CHESS_TYPE.JU, CHESS_TYPE.MA, CHESS_TYPE.XIANG].includes(chess.type)
    )
  }
  get chessboardScope() {
    // 0,0指向左上角，9,8指向右下角
    return [
      [0, 0],
      [9, 8],
    ]
  }

  playChess({ chess, from, to }) {
    this.playRecordTable.pushRecord({ chess, from, to, discardChess: this.getChess(to) })
  }

  regretChess() {
    return this.playRecordTable.popRecord()
  }
  /**
   * 初始化棋谱
   */
  initChessMap(chessMap) {
    if (Array.isArray(chessMap)) {
      this.chessPool = chessMap.map(createChess)
    } else {
      this.chessPool = createStandardChessMap()
    }

    this.value = 0
  }
  /**
   * 获取当前棋盘上的棋谱
   */
  getCurrentChessMap() {
    return this.chessPool.map((chess) => chess.metaData)
  }
  /**
   * 获取某颜色棋手的己方棋盘位置的矩形信息
   * @param {String} color
   */
  getOwnChessboardScope(color) {
    if (color === CHESS_COLOR.RED) {
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
    const point = position.split(',').map(Number)

    return locateEdge(point)
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
      .sort((chessA, chessB) => chessA.point[0] - chessB.point[0])
  }
  /**
   * 获取棋盘上某行的棋子
   */
  getChessForRow(index) {
    return this.usableChessPool
      .filter((chess) => chess.point[0] === index)
      .sort((chessA, chessB) => chessA.point[1] - chessB.point[1])
  }

  evaluate(period) {
    this.value = evaluate(this.usableChessPool, period)
  }
}

class Simulator extends Chessboard {
  simulate(tread, period) {
    const { from, to } = parseTread(tread)
    const chess = this.getChess(from)

    if (this.hasChess(to)) {
      this.discard(to, '-2')
    }

    chess.setPosition(to)
    this.evaluate(period)

    return {
      value: this.value,
      chessMap: this.getCurrentChessMap(),
    }
  }
}
