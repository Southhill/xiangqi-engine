/**
 * 棋子
 */
import * as Util from './utils.js'
import Chessgame from './chessgame.js'
import {
  CHESS_TYPE,
  CHESS_COLOR,
  CHESS_WALK_POSITION,
  CHESSGAME_PERIOD,
} from './map.js'

const i18ner = Chessgame.i18ner

class BaseChess {
  constructor(obj) {
    const { position, color, type, hole, zili } = obj

    if (![CHESS_COLOR.RED, CHESS_COLOR.BLACK].includes(color)) {
      throw new Error(`chess color: ${color} set wrong`)
    }
    /**
     * 该棋子的位置
     */
    this.position = position
    /**
     * 该棋子废弃于第几手棋, -2表示在模拟的时候废弃掉模拟棋子
     */
    this.playOrder = -1

    /**
     * 棋子颜色
     */
    this.color = color
    /**
     * 棋子类型
     */
    this.type = type
    /**
     * 活动范围
     */
    this.holeMap = {
      [CHESS_WALK_POSITION.CENTER]: hole[0],
      [CHESS_WALK_POSITION.EDGE]: hole[1],
      [CHESS_WALK_POSITION.CORNER]: hole[2],
    }
    /**
     * 子力价值
     */
    this.ziliMap = {
      [CHESSGAME_PERIOD.START]: zili[0],
      [CHESSGAME_PERIOD.MIDDLE]: zili[1],
      [CHESSGAME_PERIOD.LAST]: zili[2],
    }
  }
  get otherColor() {
    return flips(this.color)
  }
  /**
   * 获取棋子的坐标，以数组的形式返回
   */
  get point() {
    return this.position.split(',').map(Number)
  }
  /**
   * 棋子理论上有多少孔（类似围棋中的气）
   */
  get hole() {
    return this.holeMap[this.walkPosition]
  }
  /**
   * 棋子的元数据，和构造函数调用时的传参是一致的
   */
  get metaData() {
    return { type: this.type, color: this.type, position: this.position }
  }
  /**
   * 获取该棋子当前时期的子力
   * @param {String} period 当前棋局所处的时期
   */
  getCurrentZili(period) {
    return this.ziliMap[period]
  }
  /**
   * 设置棋子的位置
   */
  setPosition(position, cb) {
    this.position = position

    if (typeof cb === 'function') {
      cb.call(this, this)
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
class JiangChess extends BaseChess {
  constructor(position, color) {
    super({
      position,
      color,
      type: CHESS_TYPE.JIANG,
      hole: [4, 3, 2],
      zili: [0, 0, 0],
    })
    /**
     * 棋子名称
     */
    this.name = color === CHESS_COLOR.RED ? i18ner('帥') : i18ner('将')
  }
  /**
   * 该类型棋子行走范围：将帅棋只能走九宫格
   */
  get walkScope() {
    if (this.color === CHESS_COLOR.RED) {
      return ['0,3', '0,4', '0,5', '1,3', '1,4', '1,5', '2,3', '2,4', '2,5']
    } else {
      return ['9,5', '9,4', '9,3', '8,5', '8,4', '8,3', '7,5', '7,4', '7,3']
    }
  }
  /**
   * 当前所处的位置相对于理论上棋子所有能走的位置：中央，边线，角落
   */
  get walkPosition() {
    const idx = this.walkScope.indexOf(this.position)

    if ([0, 2, 6, 8].includes(idx)) return CHESS_WALK_POSITION.CORNER
    if ([1, 3, 5, 7].includes(idx)) return CHESS_WALK_POSITION.EDGE
    return CHESS_WALK_POSITION.CENTER
  }
  /**
   * 创造标准棋盘的【将|帅】棋
   */
  static create() {
    return [
      new JiangChess('0,4', CHESS_COLOR.RED),
      new JiangChess('9,4', CHESS_COLOR.BLACK),
    ]
  }
  /**
   * 下一步的走法位置枚举
   */
  getTreads(chessboard) {
    const [x, y] = this.point
    const positions = [
      `${x + 1},${y}`,
      `${x - 1},${y}`,
      `${x},${y + 1}`,
      `${x},${y - 1}`,
    ]
      .filter((pos) => this.walkScope.includes(pos))
      .filter((po) => this.filterSelfChesses(chessboard, po))

    // 当可以直取中军时，将中军（对方的将帅棋）的位置加入到走法中
    if (this.checkZhiquzhongjun(chessboard)) {
      const otherJiangChess = chessboard.jiangChessMap[this.otherColor]
      positions.push(otherJiangChess.position)
    }

    return positions
  }
  /**
   * 可以直取中军(将吃帅操作)
   */
  checkZhiquzhongjun(chessboard) {
    const selfJiangChess = chessboard.jiangChessMap[this.color]
    const chesses = chessboard.getChessForColumn(selfJiangChess.point[1])

    return chesses.length === 2
  }
}
/**
 * 【士】棋
 */
class ShiChess extends BaseChess {
  constructor(position, color) {
    super({
      position,
      color,
      type: CHESS_TYPE.SHI,
      hole: [4, 0, 1],
      zili: [1, 2, 2],
    })
    /**
     * 棋子名称
     */
    this.name = color === CHESS_COLOR.RED ? i18ner('仕') : i18ner('士')
  }
  /**
   * 该类型棋子行走范围：士棋走米字
   */
  get walkScope() {
    if (this.color === CHESS_COLOR.RED) {
      return ['0,3', '0,5', '1,4', '2,3', '2,5']
    } else {
      return ['9,5', '9,3', '8,4', '7,5', '7,3']
    }
  }
  /**
   * 当前所处的位置相对于理论上棋子所有能走的位置：中央，边线，角落
   */
  get walkPosition() {
    const idx = this.walkScope.indexOf(this.position)

    if (idx === 2) return CHESS_WALK_POSITION.CENTER
    return CHESS_WALK_POSITION.CORNER
  }
  /**
   * 创造标准棋盘的【士】棋
   */
  static create() {
    return [
      new ShiChess('0,3', CHESS_COLOR.RED),
      new ShiChess('0,5', CHESS_COLOR.RED),
      new ShiChess('9,5', CHESS_COLOR.BLACK),
      new ShiChess('9,3', CHESS_COLOR.BLACK),
    ]
  }
  /**
   * 下一步的走法位置枚举
   */
  getTreads(chessboard) {
    const [x, y] = this.point
    const tempPositions = [
      `${x + 1},${y + 1}`,
      `${x - 1},${y - 1}`,
      `${x - 1},${y + 1}`,
      `${x + 1},${y - 1}`,
    ]

    return tempPositions
      .filter((pos) => this.walkScope.includes(pos))
      .filter((po) => this.filterSelfChesses(chessboard, po))
  }
}
/**
 * 【相】棋
 */
class XiangChess extends BaseChess {
  constructor(position, color) {
    super({
      position,
      color,
      type: CHESS_TYPE.XIANG,
      hole: [4, 2, 0],
      zili: [2, 2, 3],
    })
    /**
     * 棋子名称
     */
    this.name = color === CHESS_COLOR.RED ? i18ner('相') : i18ner('象')
  }
  /**
   * 该类型棋子行走范围：己方棋盘
   */
  get walkScope() {
    if (this.color === CHESS_COLOR.RED) {
      return ['0,2', '0,6', '2,8', '4,6', '4,2', '2,0', '2,4']
    } else {
      return ['9,2', '9,6', '7,8', '5,6', '5,2', '7,0', '7,4']
    }
  }
  /**
   * 当前所处的位置相对于理论上棋子所有能走的位置：中央，边线，角落
   */
  get walkPosition() {
    const idx = this.walkScope.indexOf(this.position)

    if (idx === 5) return CHESS_WALK_POSITION.CENTER
    return CHESS_WALK_POSITION.EDGE
  }
  /**
   * 创造标准棋盘的【相】棋
   */
  static create() {
    return [
      new XiangChess('0,2', CHESS_COLOR.RED),
      new XiangChess('0,6', CHESS_COLOR.RED),
      new XiangChess('9,6', CHESS_COLOR.BLACK),
      new XiangChess('9,2', CHESS_COLOR.BLACK),
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
      `${x + 2},${y + 2}`,
      `${x - 2},${y - 2}`,
      `${x - 2},${y + 2}`,
      `${x + 2},${y - 2}`,
    ]
      .filter((pos) => {
        // 过滤掉超出棋格范围的位置
        const scope = chessboard.getOwnChessboardScope(this.color)
        const position = pos.split(',').map(Number)

        return Util.posInRange(position, scope)
      })
      .filter((po) => {
        // 处理塞象眼的位置
        const position = Util.halfPoint(this.position, po)

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
    super({
      position,
      color,
      type: CHESS_TYPE.MA,
      hole: ['8/6/4', '4/3', 2],
      zili: [4, 5, 5],
    })
    /**
     * 棋子名称
     */
    this.name = i18ner('馬')
  }
  /**
   * 该类型棋子行走范围：整张棋盘
   */
  get walkScope() {
    return 'all'
  }
  /**
   * 当前所处的位置相对于理论上棋子所有能走的位置：中央，边线，角落
   */
  get walkPosition() {
    if (Util.locateCorner(this.position)) return CHESS_WALK_POSITION.CORNER
    if (Util.locateEdge(this.position)) return CHESS_WALK_POSITION.EDGE
    return CHESS_WALK_POSITION.CENTER
  }
  /**
   * 创造标准棋盘的【马】棋
   */
  static create() {
    return [
      new MaChess('0,1', CHESS_COLOR.RED),
      new MaChess('0,7', CHESS_COLOR.RED),
      new MaChess('9,7', CHESS_COLOR.BLACK),
      new MaChess('9,1', CHESS_COLOR.BLACK),
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

        return Util.posInRange(position, scope)
      })
      .filter((po) => {
        // 处理蹩马腿的位置
        const position = Util.horseLegPoint(this.position, po)

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
    super({
      position,
      color,
      type: CHESS_TYPE.JU,
      hole: ['17', '17', 17],
      zili: [10, 10, 10],
    })
    /**
     * 棋子名称
     */
    this.name = i18ner('車')
  }
  /**
   * 该类型棋子行走范围：整张棋盘
   */
  get walkScope() {
    return 'all'
  }
  /**
   * 当前所处的位置相对于理论上棋子所有能走的位置：中央，边线，角落
   */
  get walkPosition() {
    if (Util.locateCorner(this.position)) return CHESS_WALK_POSITION.CORNER
    if (Util.locateEdge(this.position)) return CHESS_WALK_POSITION.EDGE
    return CHESS_WALK_POSITION.CENTER
  }
  /**
   * 创造标准棋盘的【车】棋
   */
  static create() {
    return [
      new JuChess('0,0', CHESS_COLOR.RED),
      new JuChess('0,8', CHESS_COLOR.RED),
      new JuChess('9,8', CHESS_COLOR.BLACK),
      new JuChess('9,0', CHESS_COLOR.BLACK),
    ]
  }
  /**
   * 【车棋】下一步的走法位置枚举
   */
  getTreads(chessboard) {
    const [x, y] = this.point
    const scope = chessboard.chessboardScope
    const result = []

    // 处理下方
    for (let diff = 1; ; diff++) {
      const position = `${x + diff},${y}`
      if (!Util.posInRange([x + diff, y], scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        result.push(position)
        break
      } else {
        result.push(position)
      }
    }
    // 处理上方
    for (let diff = 1; ; diff++) {
      const position = `${x - diff},${y}`
      if (!Util.posInRange([x - diff, y], scope)) {
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
      if (!Util.posInRange([x, y + diff], scope)) {
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
      if (!Util.posInRange([x, y - diff], scope)) {
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
    super({
      position,
      color,
      type: CHESS_TYPE.PAO,
      hole: ['17/13', '17/14', '17/15'],
      zili: [5, 5, 6],
    })
    /**
     * 棋子名称
     */
    this.name = i18ner('炮')
  }
  /**
   * 该类型棋子行走范围：整张棋盘
   */
  get walkScope() {
    return 'all'
  }
  /**
   * 当前所处的位置相对于理论上棋子所有能走的位置：中央，边线，角落
   */
  get walkPosition() {
    if (Util.locateCorner(this.position)) return CHESS_WALK_POSITION.CORNER
    if (Util.locateEdge(this.position)) return CHESS_WALK_POSITION.EDGE
    return CHESS_WALK_POSITION.CENTER
  }
  /**
   * 创造标准棋盘的【炮】棋
   */
  static create() {
    return [
      new PaoChess('2,1', CHESS_COLOR.RED),
      new PaoChess('2,7', CHESS_COLOR.RED),
      new PaoChess('7,7', CHESS_COLOR.BLACK),
      new PaoChess('7,1', CHESS_COLOR.BLACK),
    ]
  }
  /**
   * 【炮棋】隔山打牛，获取牛的位置
   * @param {Chessboard} chessboard
   * @param {String} paoPosition
   * @param {String} hillPosition
   */
  static getCow(chessboard, paoPosition, hillPosition) {
    // 如果炮不是边界上的棋子，且山是边界山的棋子，则无牛可打，返回null
    if (
      chessboard.isBorderLineChess(hillPosition) &&
      !chessboard.isBorderLineChess(paoPosition)
    ) {
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

      return rowChesses[hillIndex + diffIdx] || null
    } else {
      const columnChesses = chessboard.getChessForColumn(paoY)

      if (columnChesses.length <= 2) {
        return null
      }

      const diffIdx = hillX > paoX ? 1 : -1
      const hillIndex = columnChesses.findIndex(
        (chess) => chess.position === hillPosition
      )

      return columnChesses[hillIndex + diffIdx] || null
    }
  }
  /**
   * 【炮棋】下一步的走法位置枚举
   */
  getTreads(chessboard) {
    const [x, y] = this.point
    const scope = chessboard.chessboardScope
    const result = []

    // 处理下方
    for (let diff = 1; ; diff++) {
      const position = `${x + diff},${y}`
      if (!Util.posInRange([x + diff, y], scope)) {
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
    // 处理上方
    for (let diff = 1; ; diff++) {
      const position = `${x - diff},${y}`
      if (!Util.posInRange([x - diff, y], scope)) {
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
      if (!Util.posInRange([x, y + diff], scope)) {
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
      if (!Util.posInRange([x, y - diff], scope)) {
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
 * 【卒|兵】棋
 */
class ZuChess extends BaseChess {
  constructor(position, color) {
    super({
      position,
      color,
      type: CHESS_TYPE.ZU,
      hole: ['1/3', '1/2', 1],
      zili: [2, '1/3/5', '3/2/1'],
    })
    /**
     * 棋子名称
     */
    this.name = color === CHESS_COLOR.RED ? i18ner('兵') : i18ner('卒')
  }
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
    if (this.color === CHESS_COLOR.RED) {
      return this.point[0] > 4
    } else {
      return this.point[0] < 5
    }
  }
  /**
   * 当前所处的位置相对于理论上棋子所有能走的位置：中央，边线，角落
   */
  get walkPosition() {
    if (Util.locateCorner(this.position)) return CHESS_WALK_POSITION.CORNER
    if (Util.locateEdge(this.position)) return CHESS_WALK_POSITION.EDGE
    return CHESS_WALK_POSITION.CENTER
  }

  /**
   * 创造标准棋盘的【兵】棋
   */
  static create() {
    return [
      new ZuChess('3,0', CHESS_COLOR.RED),
      new ZuChess('3,2', CHESS_COLOR.RED),
      new ZuChess('3,4', CHESS_COLOR.RED),
      new ZuChess('3,6', CHESS_COLOR.RED),
      new ZuChess('3,8', CHESS_COLOR.RED),
      new ZuChess('6,8', CHESS_COLOR.BLACK),
      new ZuChess('6,6', CHESS_COLOR.BLACK),
      new ZuChess('6,4', CHESS_COLOR.BLACK),
      new ZuChess('6,2', CHESS_COLOR.BLACK),
      new ZuChess('6,0', CHESS_COLOR.BLACK),
    ]
  }
  /**
   * 获取兵棋的子力: [2, '1/3/5', '3/2/1']
   * @param {String} period 当前棋局的时期
   */
  getCurrentZili(period) {
    const result = this.ziliMap[period]
    if (period === CHESSGAME_PERIOD.START) return result
    if (period === CHESSGAME_PERIOD.MIDDLE) {
      // 中局的子力价值，兵在过河前和过河后具有不同的兑子价值，进入九宫时价值最高
      const arr = result.split('/').map(Number)

      if (this.isCrossRiver) {
        return Util.locateNinePalaces(this.point, this.color) ? arr[2] : arr[1]
      } else {
        return arr[0]
      }
    }
    if (period === CHESSGAME_PERIOD.LAST) {
      // 残局的子力价值，兵的残局价值取决于兵的位置，底兵最低，其次是低兵（次底线和倒数第三线），高兵（更高的位置）最高
      const arr = result.split('/').map(Number)

      if (Util.locateBaseline(this.point, this.color, true)) {
        return arr[2]
      }
      if (Util.locateLowerBaseline(this.point, this.color, true)) {
        return arr[1]
      }

      return arr[0]
    }
  }
  /**
   * 【炮棋】下一步的走法位置枚举
   */
  getTreads(chessboard) {
    const [x, y] = this.point
    const result = []
    const diffIdx = this.color === CHESS_COLOR.RED ? 1 : -1

    if (this.isCrossRiver) {
      result.push(`${x},${y + 1}`)
      result.push(`${x},${y - 1}`)
    }

    result.push(`${x + diffIdx},${y}`)

    return result.filter((po) => this.filterSelfChesses(chessboard, po))
  }
}
/**
 * 创建一个标准的棋盘
 */
function createStandardChessMap() {
  return [
    ...JiangChess.create(),
    ...ShiChess.create(),
    ...XiangChess.create(),
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
    case CHESS_TYPE.JIANG:
      chess = new JiangChess(position, color)
      break
    case CHESS_TYPE.SHI:
      chess = new ShiChess(position, color)
      break
    case CHESS_TYPE.XIANG:
      chess = new XiangChess(position, color)
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
  JiangChess,
  ShiChess,
  XiangChess,
  MaChess,
  JuChess,
  PaoChess,
  ZuChess,
  createStandardChessMap,
}
