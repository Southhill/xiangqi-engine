/**
 * 棋子
 */
import { CHESS_TYPE, PLAYER_COLOR } from './map'
import { posInRange, halfPoint, horseLegPoint } from './utils'

class BaseChess {
  constructor(position, color) {
    /**
     * 该棋子的位置
     */
    this.position = position
    /**
     * 该棋子废弃于第几手棋
     */
    this.playOrder = -1

    /**
     * 该棋子的颜色
     */
    this.color = color
  }
  /**
   * 获取棋子的坐标，以数组的形式返回
   */
  get point() {
    return this.position.split(',').map(Number)
  }
  /**
   * 设置棋子的位置
   */
  setPosition(position, cb) {
    this.position = position

    if (typeof cb === 'function') {
      cb(this)
    }
  }
  /**
   * 过滤掉己方棋子，该位置没有棋子，或者为对手棋子
   * @param {Chessboard} chessboard
   * @param {String} position
   */
  filterSelfChesses(chessboard, position) {
    const tempChess = chessboard.getChess(position)

    return !tempChess || (tempChess && tempChess.color !== this.color)
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
   * 该类型棋子行走范围：将帅棋只能走九宫格
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
      new JIANG_SHUAI_Chess('9,4', PLAYER_COLOR.BLACK),
    ]
  }
  /**
   * 下一步的走法位置枚举
   */
  getTreads(chessboard) {
    const [x, y] = this.point
    const positions = [`${x + 1},y`, `${x - 1},y`, `x,${y + 1}`, `x,${y - 1}`]
      .filter((pos) => {
        this.walkScope.indexOf(pos) > -1
      })
      .filter((po) => this.filterSelfChesses(chessboard, po))

    const otherJiangshuaiChess = this.zhiquzhongjun(chessboard)

    // 当可以直取中军时，将中军（对方的将帅棋）的位置加入到走法中
    if (otherJiangshuaiChess) {
      positions.push(otherJiangshuaiChess.position)
    }

    return positions
  }
  /**
   * 可以直取中军(将吃帅操作)
   */
  zhiquzhongjun(chessboard) {
    const selfJiangshuaiChess = chessboard.jiangshuaiChesses.filter(
      (chess) => chess.color === this.color
    )
    const chesses = chessboard.getChessForColumn(selfJiangshuaiChess.point[1])

    return (
      chesses.length === 2 &&
      chesses.every((chess) => chess.type === CHESS_TYPE.JIANG_SHUAI) &&
      chesses.find((chess) => chess.position !== selfJiangshuaiChess.position)
    )
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
   * 该类型棋子行走范围：士棋走米字
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
      new ShiChess('9,3', PLAYER_COLOR.BLACK),
    ]
  }
  /**
   * 下一步的走法位置枚举
   */
  getTreads() {
    const [x, y] = this.point
    const tempPositions = [
      `${x + 1},${y + 1}`,
      `${x - 1},${y - 1}`,
      `${x - 1},${y + 1}`,
      `${x + 1},${y - 1}`,
    ]

    return tempPositions
      .filter((pos) => {
        this.walkScope.indexOf(pos) > -1
      })
      .filter((po) => this.filterSelfChesses(chessboard, po))
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
    this.type = CHESS_TYPE.XIANG
  }
  /**
   * 棋子位置的别名
   */
  get aliasPosition() {}
  /**
   * 该类型棋子行走范围：己方棋盘
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
      new XIANGChess('9,2', PLAYER_COLOR.BLACK),
    ]
  }
  /**
   * 【相棋】下一步的走法位置枚举
   *
   * 小心塞象眼
   */
  getTreads(chessboard) {
    const [x, y] = this.point
    const result = [
      `${x + 3},${y + 3}`,
      `${x - 3},${y - 3}`,
      `${x - 3},${y + 3}`,
      `${x + 3},${y - 3}`,
    ]
      .filter((pos) => {
        // 过滤掉超出棋格范围的位置
        const scope = chessboard.getOwnChessboardScope(this.color)
        const position = pos.split(',').map(Number)

        return posInRange(position, scope)
      })
      .filter((po) => {
        // 处理塞象眼的位置
        const position = halfPoint(this.position, po)

        return !chessboard.hasChess(position)
      })
      .filter((po) => this.filterSelfChesses(chessboard, po))

    return result
  }
}
/**
 * 【马】棋
 */
class MaChess extends BaseChess {
  constructor(position, color) {
    super(position, color)
    /**
     * 棋子类型
     */
    this.type === CHESS_TYPE.MA
  }
  /**
   * 棋子位置的别名
   */
  get aliasPosition() {}
  /**
   * 该类型棋子行走范围：整张棋盘
   */
  get walkScope() {
    return 'all'
  }

  /**
   * 创造标准棋盘的【马】棋
   */
  static create() {
    return [
      new MaChess('0,1', PLAYER_COLOR.RED),
      new MaChess('0,7', PLAYER_COLOR.RED),
      new MaChess('9,7', PLAYER_COLOR.BLACK),
      new MaChess('9,1', PLAYER_COLOR.BLACK),
    ]
  }
  /**
   * 【马棋】下一步的走法位置枚举，理论有8个落点
   *
   * 小心蹩马腿
   */
  getTreads(chessboard) {
    const [x, y] = this.point
    const result = [
      // 第一象限
      `${x + 1},${y + 2}`,
      `${x + 2},${y + 1}`,
      // 第二象限
      `${x + 2},${y - 1}`,
      `${x + 1},${y - 2}`,
      // 第三象限
      `${x - 1},${y - 2}`,
      `${x - 2},${y - 1}`,
      // 第四象限
      `${x - 2},${y + 1}`,
      `${x - 1},${y + 2}`,
    ]
      .filter((pos) => {
        // 过滤掉超出棋格范围的位置
        const scope = chessboard.chessboardScope
        const position = pos.split(',').map(Number)

        return posInRange(position, scope)
      })
      .filter((po) => {
        // 处理蹩马腿的位置
        const position = horseLegPoint(this.position, po)

        return !chessboard.hasChess(position)
      })
      .filter((po) => this.filterSelfChesses(chessboard, po))

    return result
  }
}
/**
 * 【车】棋
 */
class JuChess extends BaseChess {
  constructor(position, color) {
    super(position, color)
    /**
     * 棋子类型
     */
    this.type === CHESS_TYPE.JU
  }
  /**
   * 棋子位置的别名
   */
  get aliasPosition() {}
  /**
   * 该类型棋子行走范围：整张棋盘
   */
  get walkScope() {
    return 'all'
  }

  /**
   * 创造标准棋盘的【车】棋
   */
  static create() {
    return [
      new JuChess('0,0', PLAYER_COLOR.RED),
      new JuChess('0,8', PLAYER_COLOR.RED),
      new JuChess('9,8', PLAYER_COLOR.BLACK),
      new JuChess('9,0', PLAYER_COLOR.BLACK),
    ]
  }
  /**
   * 【车棋】下一步的走法位置枚举
   */
  getTreads(chessboard) {
    const [x, y] = this.point
    const scope = chessboard.chessboardScope
    const result = []

    // 处理上方
    for (let diff = 1; ; diff++) {
      const position = `${x + diff},${y}`
      if (posInRange(position, scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        result.push(position)
        break
      } else {
        result.push(position)
      }
    }
    // 处理下方
    for (let diff = 1; ; diff++) {
      const position = `${x - diff},${y}`
      if (posInRange(position, scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        result.push(position)
        break
      } else {
        result.push(position)
      }
    }
    // 处理右方
    for (let diff = 1; ; diff++) {
      const position = `${x},${y + diff}`
      if (posInRange(position, scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        result.push(position)
        break
      } else {
        result.push(position)
      }
    }
    // 处理左方
    for (let diff = 1; ; diff++) {
      const position = `${x},${y - diff}`
      if (posInRange(position, scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        result.push(position)
        break
      } else {
        result.push(position)
      }
    }

    return result.filter((po) => this.filterSelfChesses(chessboard, po))
  }
}
/**
 * 【炮】棋
 */
class PaoChess extends BaseChess {
  constructor(position, color) {
    super(position, color)
    /**
     * 棋子类型
     */
    this.type = CHESS_TYPE.PAO
  }
  /**
   * 棋子位置的别名
   */
  get aliasPosition() {}
  /**
   * 该类型棋子行走范围：整张棋盘
   */
  get walkScope() {
    return 'all'
  }

  /**
   * 创造标准棋盘的【炮】棋
   */
  static create() {
    return [
      new JuChess('2,1', PLAYER_COLOR.RED),
      new JuChess('2,7', PLAYER_COLOR.RED),
      new JuChess('7,7', PLAYER_COLOR.BLACK),
      new JuChess('7,1', PLAYER_COLOR.BLACK),
    ]
  }
  /**
   * 【炮棋】隔山打牛，获取牛的位置
   * @param {Chessboard} chessboard
   * @param {String} paoPosition
   * @param {String} hillPosition
   */
  static getCow(chessboard, paoPosition, hillPosition) {
    if (chessboard.isBorderLineChess(hillPosition)) {
      return null
    }

    const [paoX, paoY] = paoPosition.split(',').map(Number)
    const [hillX, hillY] = hillPosition.split(',').map(Number)

    if (paoX === hillX) {
      const rowChesses = chessboard.getChessForRow(paoX)

      if (rowChesses.length <= 2) {
        return null
      }

      const diffIdx = hillY > paoY ? 1 : -1
      const hillIndex = rowChesses.findIndex(
        (chess) => chess.position === hillPosition
      )

      return rowChesses[hillIndex + diffIdx]
    } else {
      const columnChesses = chessboard.getChessForColumn(paoY)

      if (columnChesses.length <= 2) {
        return null
      }

      const diffIdx = hillX > paoX ? 1 : -1
      const hillIndex = columnChesses.findIndex(
        (chess) => chess.position === hillPosition
      )

      return columnChesses[hillIndex + diffIdx]
    }
  }
  /**
   * 【炮棋】下一步的走法位置枚举
   */
  getTreads(chessboard) {
    const [x, y] = this.point
    const scope = chessboard.chessboardScope
    const result = []

    // 处理上方
    for (let diff = 1; ; diff++) {
      const position = `${x + diff},${y}`
      if (posInRange(position, scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        const cowChess = PaoChess.getCow(chessboard, this.position, position)

        if (cowChess !== null) {
          result.push(cowChess.position)
        }

        break
      } else {
        result.push(position)
      }
    }
    // 处理下方
    for (let diff = 1; ; diff++) {
      const position = `${x - diff},${y}`
      if (posInRange(position, scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        const cowChess = PaoChess.getCow(chessboard, this.position, position)

        if (cowChess !== null) {
          result.push(cowChess.position)
        }

        break
      } else {
        result.push(position)
      }
    }
    // 处理右方
    for (let diff = 1; ; diff++) {
      const position = `${x},${y + diff}`
      if (posInRange(position, scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        const cowChess = PaoChess.getCow(chessboard, this.position, position)

        if (cowChess !== null) {
          result.push(cowChess.position)
        }

        break
      } else {
        result.push(position)
      }
    }
    // 处理左方
    for (let diff = 1; ; diff++) {
      const position = `${x},${y - diff}`
      if (posInRange(position, scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        const cowChess = PaoChess.getCow(chessboard, this.position, position)

        if (cowChess !== null) {
          result.push(cowChess.position)
        }

        break
      } else {
        result.push(position)
      }
    }

    return result.filter((po) => this.filterSelfChesses(chessboard, po))
  }
}
/**
 * 【卒】棋
 */
class ZuChess extends BaseChess {
  constructor(position, color) {
    super(position, color)
    /**
     * 棋子类型
     */
    this.type = CHESS_TYPE.ZU
  }
  /**
   * 棋子位置的别名
   */
  get aliasPosition() {}
  /**
   * 该类型棋子行走范围：整张棋盘
   */
  get walkScope() {
    return '7/10'
  }
  /**
   * 该棋子是否已过河
   */
  get isCrossRiver() {
    if (this.color === PLAYER_COLOR.RED) {
      return this.point[0] > 4
    } else {
      return this.point[0] < 5
    }
  }

  /**
   * 创造标准棋盘的【炮】棋
   */
  static create() {
    return [
      new ZuChess('3,0', PLAYER_COLOR.RED),
      new ZuChess('3,2', PLAYER_COLOR.RED),
      new ZuChess('3,4', PLAYER_COLOR.RED),
      new ZuChess('3,6', PLAYER_COLOR.RED),
      new ZuChess('3,8', PLAYER_COLOR.RED),
      new ZuChess('6,8', PLAYER_COLOR.BLACK),
      new ZuChess('6,6', PLAYER_COLOR.BLACK),
      new ZuChess('6,4', PLAYER_COLOR.BLACK),
      new ZuChess('6,2', PLAYER_COLOR.BLACK),
      new ZuChess('6,0', PLAYER_COLOR.BLACK),
    ]
  }
  /**
   * 【炮棋】下一步的走法位置枚举
   */
  getTreads(chessboard) {
    const [x, y] = this.point
    const result = []
    const diffIdx = this.color === PLAYER_COLOR.RED ? 1 : -1

    if (this.isCrossRiver) {
      result.push(`${x},${y + 1}`)
      result.push(`${x},${y - 1}`)
    }

    result.push(`${x + diffIdx},${y}`)

    return result.filter((po) => this.filterSelfChesses(chessboard, po))
  }
}
function createStandardChessMap() {
  return [
    ...JIANG_SHUAI_Chess.create(),
    ...ShiChess.create(),
    ...XIANGChess.create(),
    ...MaChess.create(),
    ...JuChess.create(),
    ...PaoChess.create(),
    ...ZuChess.create(),
  ]
}
/**
 * 通用的生成棋子的方法
 * @param {Object} info
 */
export default function createChess(info = {}) {
  const { type, color, position } = info
  let chess = null

  switch (type) {
    case CHESS_TYPE.JIANG_SHUAI:
      chess = new JIANG_SHUAI_Chess(position, color)
      break
    case CHESS_TYPE.SHI:
      chess = new ShiChess(position, color)
      break
    case CHESS_TYPE.XIANG:
      chess = new XIANGChess(position, color)
      break
    case CHESS_TYPE.MA:
      chess = new MaChess(position, color)
      break
    case CHESS_TYPE.JU:
      chess = new JuChess(position, color)
      break
    case CHESS_TYPE.PAO:
      chess = new PaoChess(position, color)
      break
    case CHESS_TYPE.ZU:
      chess = new ZuChess(position, color)
      break
    default:
      throw new Error('未知的棋子类型')
  }

  return chess
}

export {
  JIANG_SHUAI_Chess,
  ShiChess,
  XIANGChess,
  MaChess,
  JuChess,
  PaoChess,
  ZuChess,
  createStandardChessMap,
}
