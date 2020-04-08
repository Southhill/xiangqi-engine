/**
 * 棋子
 */
import { CHESS_TYPE, PLAYER_COLOR } from './map'

class BaseChess {
  constructor(position, color) {
    /**
     * 该棋子的位置
     */
    this.position = position

    /**
     * 该棋子的颜色
     */
    this.color = color
  }
  /**
   * 获取棋子的坐标，以数组的形式返回
   */
  get point() {
    return this.position.split(',')
  }
  /**
   * 设置棋子的位置
   */
  setPosition(position, cb) {
    this.position = position

    if (typeof cb === 'function') {
      cb()
    }
  }
}
/**
 * 【将|帅】棋
 */
class JIANG_SHUAI_Chess extends BaseChess {
  constructor(position, color) {
    super(position, color)
    /**
     * 棋子类型
     */
    this.type = CHESS_TYPE.JIANG_SHUAI
  }
  /**
   * 棋子位置的别名
   */
  get aliasPosition() {}
  /**
   * 下一步的走法位置枚举，这里不包含将吃帅的走法，
   *
   * 将吃帅的走法在Player类中判断
   */
  get treads() {
    const [x, y] = this.position.split(',').map(Number)
    const tempPositions = [
      `${x + 1},y`,
      `${x - 1},y`,
      `x,${y + 1}`,
      `x,${y - 1}`
    ]

    return tempPositions.filter(pos => {
      this.walkScope.indexOf(pos) > -1
    })
  }

  /**
   * 该类型棋子行走范围
   * 将帅棋只能走九宫格
   */
  get walkScope() {
    if (this.color === PLAYER_COLOR.RED) {
      return ['0,3', '0,4', '0,5', '1,3', '1,4', '1,5', '2,3', '2,4', '2,5']
    } else {
      return ['9,5', '9,4', '9,3', '8,5', '8,4', '8,3', '7,5', '7,4', '7,3']
    }
  }

  /**
   * 创造标准棋盘的【将|帅】棋
   */
  static create() {
    return [
      new JIANG_SHUAI_Chess('0,4', PLAYER_COLOR.RED),
      new JIANG_SHUAI_Chess('9,4', PLAYER_COLOR.BLACK)
    ]
  }
}
/**
 * 【士】棋
 */
class ShiChess extends BaseChess {
  constructor(position, color) {
    super(position, color)
    /**
     * 棋子类型
     */
    this.type = CHESS_TYPE.SHI
  }
  /**
   * 棋子位置的别名
   */
  get aliasPosition() {}
  /**
   * 下一步的走法位置枚举
   */
  get treads() {
    const [x, y] = this.position.split(',').map(Number)
    const tempPositions = [
      `${x + 1},${y + 1}`,
      `${x - 1},${y - 1}`,
      `${x - 1},${y + 1}`,
      `${x + 1},${y - 1}`
    ]

    return tempPositions.filter(pos => {
      this.walkScope.indexOf(pos) > -1
    })
  }

  /**
   * 该类型棋子行走范围
   * 士棋走米字
   */
  get walkScope() {
    if (this.color === PLAYER_COLOR.RED) {
      return ['0,3', '0,5', '1,4', '2,3', '2,5']
    } else {
      return ['9,5', '9,3', '8,4', '7,5', '7,3']
    }
  }

  /**
   * 创造标准棋盘的【士】棋
   */
  static create() {
    return [
      new ShiChess('0,3', PLAYER_COLOR.RED),
      new ShiChess('0,5', PLAYER_COLOR.RED),
      new ShiChess('9,5', PLAYER_COLOR.BLACK),
      new ShiChess('9,3', PLAYER_COLOR.BLACK)
    ]
  }
}
/**
 * 【相】棋
 */
class XIANGChess extends BaseChess {
  constructor(position, color) {
    super(position, color)
    /**
     * 棋子类型
     */
    this.type = CHESS_TYPE.SHI
  }
  /**
   * 棋子位置的别名
   */
  get aliasPosition() {}
  /**
   * 【相棋】下一步的走法位置枚举
   * 小心别象腿
   */
  get treads() {
    const [x, y] = this.position.split(',').map(Number)
    const tempPositions = [
      `${x + 1},${y + 1}`,
      `${x - 1},${y - 1}`,
      `${x - 1},${y + 1}`,
      `${x + 1},${y - 1}`
    ]

    return tempPositions.filter(pos => {
      this.walkScope.indexOf(pos) > -1
    })
  }

  /**
   * 该类型棋子行走范围
   * 士棋走米字
   */
  get walkScope() {
    return 'self'
  }

  /**
   * 创造标准棋盘的【相】棋
   */
  static create() {
    return [
      new XIANGChess('0,2', PLAYER_COLOR.RED),
      new XIANGChess('0,6', PLAYER_COLOR.RED),
      new XIANGChess('9,6', PLAYER_COLOR.BLACK),
      new XIANGChess('9,2', PLAYER_COLOR.BLACK)
    ]
  }
}

export { JIANG_SHUAI_Chess, ShiChess, XIANGChess }
