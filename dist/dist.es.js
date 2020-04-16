/**
 * 常量类型
 */

const CHESS_TYPE = {
  /**
   * 将（帅）
   */
  JIANG_SHUAI: 'jiang_shuai',
  /**
   * 士
   */

  SHI: 'shi',
  /**
   * 象
   */
  XIANG: 'xiang',
  /**
   * 马
   */
  MA: 'ma',
  /**
   * 车
   */

  JU: 'ju',
  /**
   * 炮
   */
  PAO: 'pao',
  /**
   * 卒
   */
  ZU: 'zu'
};

const PLAYER_COLOR = {
  /**
   * 红方
   */
  RED: 'red',
  /**
   * 黑方
   */
  BLACK: 'black'
};

const CHESSGAME_STATUS = {
  /**
   * 正常对战
   */
  VS: 'vs',
  /**
   * 将军
   */
  JIANG_JUN: 'jiang_jun',
  /**
   * 决出胜者
   */
  WIN: 'win',
  /**
   * 和棋
   */
  HE: 'he'
};

/**
 * 表示该棋子在棋盘外，也即处于废弃状态
 */
const DISCARDED_CHESS = '-1,-1';

/**
 * 棋手
 */

class Player {
  constructor(name) {
    /**
     * 棋手的名称：甲方，乙方
     */
    this.name = name;
    /**
     * 棋手的颜色：红色，黑色。真实的棋局中，红色棋手先走
     */
    this.color = '';
    /**
     * 棋盘
     */
    this.chessboard = null;
  }
  /**
   * 棋手当前在棋局上的所有己方可用的棋子
   */
  get selfChessPool() {
    return this.chessboard.usableChessPool.filter(
      chess => chess.color === this.color
    )
  }
  /**
   * 丢失了将帅旗，也即对战失败了
   */
  get lostJiangshuaiChess() {
    return (
      this.selfChessPool.findiIndex(
        chess => chess.type === CHESS_TYPE.JIANG_SHUAI
      ) === -1
    )
  }

  /**
   * 该棋手的所有可用的棋子的全部走法
   */
  get allChessTread() {
    const result = [];

    this.selfChessPool.forEach(chess => {
      const treads = chess.getTreads(this.chessboard);

      result.push(...treads);
    });

    return result
  }
  /**
   * 获取棋手的将帅棋
   */
  get jiangshuaiChess() {
    return this.selfChessPool.find(
      chess => chess.type === CHESS_TYPE.JIANG_SHUAI
    )
  }

  /**
   * 获取己方某个位置的棋子
   */
  getSelfChess(position) {
    return this.selfChessPool.find(chess => chess.position === position)
  }

  /**
   * 设置棋手的颜色
   * @param {String} color
   */
  setColor(color) {
    this.color = color;
  }
  /**
   * 关联棋盘
   */
  sitdown(chessboard) {
    this.chessboard = chessboard;
  }
  /**
   * 棋手下棋，返回`null`表明预定下棋位置错误
   */
  playChess(from, to, playOrder) {
    // 获取from处的棋子
    const chess = this.getSelfChess(from);
    // 获取所有下法
    const treads = chess.getTreads(this.chessboard);

    if (treads.indexOf(to) === -1) {
      return null
    }

    let record = '';
    if (this.chessboard.hasChess(to)) {
      const discardedChess = this.chessboard.discard(to, playOrder);

      record = `${playOrder}:${chess.color}-${chess.type}:${from}=>${to}:${discardedChess.color}-${discardedChess.type}`;
    } else {
      record = `${playOrder}:${chess.color}-${chess.type}:${from}=>${to}`;
    }

    chess.setPosition(to);

    return record
  }
}

/**
 * 判断给定位置是否在限定的矩形框内
 */
function posInRange(pos, range) {
  const [x, y] = pos;
  const [rangeStart, rangeEnd] = range;
  const [startX, startY] = rangeStart;
  const [endX, endY] = rangeEnd;

  return x >= startX && x <= endX && y >= startY && y <= endY
}
/**
 * 获取田字格两端坐标的中心点
 */
function halfPoint(pointStart, pointEnd) {
  const [startX, startY] = pointStart.split(',').map(Number);
  const [endX, endY] = pointEnd.split(',').map(Number);

  return `${(startX + endX) / 2},${(startY + endY) / 2}`
}
/**
 * 【马】棋，获取马腿位置
 */
function horseLegPoint(pointStart, pointEnd) {
  const [startX, startY] = pointStart.split(',').map(Number);
  const [endX, endY] = pointEnd.split(',').map(Number);
  const diffX = Math.abs(endX - startX);
  const diffY = Math.abs(endY - startY);

  if (diffX > diffY) {
    return `${(startX + endX) / 2},${startY}`
  } else {
    return `${startX},${(startY + endY) / 2}`
  }
}

function i18ner(str, opts = {}) {
  const i18nMap = Chessgame.i18n;

  if (Object.prototype.toString.call(i18nMap).slice(8, -1) !== 'Object') {
    return str
  }

  const { isStepI18n = false } = opts;

  if (isStepI18n) {
    return str
      .split('')
      .map((s) => i18nMap[s] || s)
      .join('')
  }

  return i18nMap[str] || str
}

/**
 * 棋子
 */

class BaseChess {
  constructor(position, color) {
    /**
     * 该棋子的位置
     */
    this.position = position;
    /**
     * 该棋子废弃于第几手棋
     */
    this.playOrder = -1;

    /**
     * 该棋子的颜色
     */
    this.color = color;
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
    this.position = position;

    if (typeof cb === 'function') {
      cb.call(this, this);
    }
  }
  /**
   * 过滤掉己方棋子，该位置没有棋子，或者为对手棋子
   * @param {Chessboard} chessboard
   * @param {String} position
   */
  filterSelfChesses(chessboard, position) {
    const tempChess = chessboard.getChess(position);

    return !tempChess || (tempChess && tempChess.color !== this.color)
  }
}
/**
 * 【将|帅】棋
 */
class JIANG_SHUAI_Chess extends BaseChess {
  constructor(position, color) {
    super(position, color);
    /**
     * 棋子类型
     */
    this.type = CHESS_TYPE.JIANG_SHUAI;
    /**
     * 棋子名称
     */
    this.name = color === PLAYER_COLOR.RED ? i18ner('帥') : i18ner('将');
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
    const [x, y] = this.point;
    const positions = [`${x + 1},y`, `${x - 1},y`, `x,${y + 1}`, `x,${y - 1}`]
      .filter((pos) => {
        this.walkScope.indexOf(pos) > -1;
      })
      .filter((po) => this.filterSelfChesses(chessboard, po));

    const otherJiangshuaiChess = this.zhiquzhongjun(chessboard);

    // 当可以直取中军时，将中军（对方的将帅棋）的位置加入到走法中
    if (otherJiangshuaiChess) {
      positions.push(otherJiangshuaiChess.position);
    }

    return positions
  }
  /**
   * 可以直取中军(将吃帅操作)
   */
  zhiquzhongjun(chessboard) {
    const selfJiangshuaiChess = chessboard.jiangshuaiChesses.filter(
      (chess) => chess.color === this.color
    );
    const chesses = chessboard.getChessForColumn(selfJiangshuaiChess.point[1]);

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
    super(position, color);
    /**
     * 棋子类型
     */
    this.type = CHESS_TYPE.SHI;
    /**
     * 棋子名称
     */
    this.name = color === PLAYER_COLOR.RED ? i18ner('仕') : i18ner('士');
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
    const [x, y] = this.point;
    const tempPositions = [
      `${x + 1},${y + 1}`,
      `${x - 1},${y - 1}`,
      `${x - 1},${y + 1}`,
      `${x + 1},${y - 1}`,
    ];

    return tempPositions
      .filter((pos) => {
        this.walkScope.indexOf(pos) > -1;
      })
      .filter((po) => this.filterSelfChesses(chessboard, po))
  }
}
/**
 * 【相】棋
 */
class XIANGChess extends BaseChess {
  constructor(position, color) {
    super(position, color);
    /**
     * 棋子类型
     */
    this.type = CHESS_TYPE.XIANG;
    /**
     * 棋子名称
     */
    this.name = color === PLAYER_COLOR.RED ? i18ner('相') : i18ner('象');
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
    const [x, y] = this.point;
    const result = [
      `${x + 3},${y + 3}`,
      `${x - 3},${y - 3}`,
      `${x - 3},${y + 3}`,
      `${x + 3},${y - 3}`,
    ]
      .filter((pos) => {
        // 过滤掉超出棋格范围的位置
        const scope = chessboard.getOwnChessboardScope(this.color);
        const position = pos.split(',').map(Number);

        return posInRange(position, scope)
      })
      .filter((po) => {
        // 处理塞象眼的位置
        const position = halfPoint(this.position, po);

        return !chessboard.hasChess(position)
      })
      .filter((po) => this.filterSelfChesses(chessboard, po));

    return result
  }
}
/**
 * 【马】棋
 */
class MaChess extends BaseChess {
  constructor(position, color) {
    super(position, color);
    /**
     * 棋子类型
     */
    this.type === CHESS_TYPE.MA;
    /**
     * 棋子名称
     */
    this.name = i18ner('馬');
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
    const [x, y] = this.point;
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
        const scope = chessboard.chessboardScope;
        const position = pos.split(',').map(Number);

        return posInRange(position, scope)
      })
      .filter((po) => {
        // 处理蹩马腿的位置
        const position = horseLegPoint(this.position, po);

        return !chessboard.hasChess(position)
      })
      .filter((po) => this.filterSelfChesses(chessboard, po));

    return result
  }
}
/**
 * 【车】棋
 */
class JuChess extends BaseChess {
  constructor(position, color) {
    super(position, color);
    /**
     * 棋子类型
     */
    this.type === CHESS_TYPE.JU;
    /**
     * 棋子名称
     */
    this.name = i18ner('車');
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
    const [x, y] = this.point;
    const scope = chessboard.chessboardScope;
    const result = [];

    // 处理下方
    for (let diff = 1; ; diff++) {
      const position = `${x + diff},${y}`;
      if (!posInRange([x + diff, y], scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        result.push(position);
        break
      } else {
        result.push(position);
      }
    }
    // 处理上方
    for (let diff = 1; ; diff++) {
      const position = `${x - diff},${y}`;
      if (!posInRange([x - diff, y], scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        result.push(position);
        break
      } else {
        result.push(position);
      }
    }
    // 处理右方
    for (let diff = 1; ; diff++) {
      const position = `${x},${y + diff}`;
      if (!posInRange([x, y + diff], scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        result.push(position);
        break
      } else {
        result.push(position);
      }
    }
    // 处理左方
    for (let diff = 1; ; diff++) {
      const position = `${x},${y - diff}`;
      if (!posInRange([x, y - diff], scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        result.push(position);
        break
      } else {
        result.push(position);
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
    super(position, color);
    /**
     * 棋子类型
     */
    this.type = CHESS_TYPE.PAO;
    /**
     * 棋子名称
     */
    this.name = i18ner('炮');
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
      new PaoChess('2,1', PLAYER_COLOR.RED),
      new PaoChess('2,7', PLAYER_COLOR.RED),
      new PaoChess('7,7', PLAYER_COLOR.BLACK),
      new PaoChess('7,1', PLAYER_COLOR.BLACK),
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

    const [paoX, paoY] = paoPosition.split(',').map(Number);
    const [hillX, hillY] = hillPosition.split(',').map(Number);

    if (paoX === hillX) {
      const rowChesses = chessboard.getChessForRow(paoX);

      if (rowChesses.length <= 2) {
        return null
      }

      const diffIdx = hillY > paoY ? 1 : -1;
      const hillIndex = rowChesses.findIndex(
        (chess) => chess.position === hillPosition
      );

      return rowChesses[hillIndex + diffIdx]
    } else {
      const columnChesses = chessboard.getChessForColumn(paoY);

      if (columnChesses.length <= 2) {
        return null
      }

      const diffIdx = hillX > paoX ? 1 : -1;
      const hillIndex = columnChesses.findIndex(
        (chess) => chess.position === hillPosition
      );

      return columnChesses[hillIndex + diffIdx]
    }
  }
  /**
   * 【炮棋】下一步的走法位置枚举
   */
  getTreads(chessboard) {
    const [x, y] = this.point;
    const scope = chessboard.chessboardScope;
    const result = [];

    // 处理下方
    for (let diff = 1; ; diff++) {
      const position = `${x + diff},${y}`;
      if (!posInRange([x + diff, y], scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        const cowChess = PaoChess.getCow(chessboard, this.position, position);

        if (cowChess !== null) {
          result.push(cowChess.position);
        }

        break
      } else {
        result.push(position);
      }
    }
    // 处理上方
    for (let diff = 1; ; diff++) {
      const position = `${x - diff},${y}`;
      if (!posInRange([x - diff, y], scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        const cowChess = PaoChess.getCow(chessboard, this.position, position);

        if (cowChess !== null) {
          result.push(cowChess.position);
        }

        break
      } else {
        result.push(position);
      }
    }
    // 处理右方
    for (let diff = 1; ; diff++) {
      const position = `${x},${y + diff}`;
      if (!posInRange([x, y + diff], scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        const cowChess = PaoChess.getCow(chessboard, this.position, position);

        if (cowChess !== null) {
          result.push(cowChess.position);
        }

        break
      } else {
        result.push(position);
      }
    }
    // 处理左方
    for (let diff = 1; ; diff++) {
      const position = `${x},${y - diff}`;
      if (!posInRange([x, y - diff], scope)) {
        break
      }

      if (chessboard.hasChess(position)) {
        const cowChess = PaoChess.getCow(chessboard, this.position, position);

        if (cowChess !== null) {
          result.push(cowChess.position);
        }

        break
      } else {
        result.push(position);
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
    super(position, color);
    /**
     * 棋子类型
     */
    this.type = CHESS_TYPE.ZU;
    /**
     * 棋子名称
     */
    this.name = color === PLAYER_COLOR.RED ? i18ner('兵') : i18ner('卒');
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
    const [x, y] = this.point;
    const result = [];
    const diffIdx = this.color === PLAYER_COLOR.RED ? 1 : -1;

    if (this.isCrossRiver) {
      result.push(`${x},${y + 1}`);
      result.push(`${x},${y - 1}`);
    }

    result.push(`${x + diffIdx},${y}`);

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
function createChess(info = {}) {
  const { type, color, position } = info;
  let chess = null;

  switch (type) {
    case CHESS_TYPE.JIANG_SHUAI:
      chess = new JIANG_SHUAI_Chess(position, color);
      break
    case CHESS_TYPE.SHI:
      chess = new ShiChess(position, color);
      break
    case CHESS_TYPE.XIANG:
      chess = new XIANGChess(position, color);
      break
    case CHESS_TYPE.MA:
      chess = new MaChess(position, color);
      break
    case CHESS_TYPE.JU:
      chess = new JuChess(position, color);
      break
    case CHESS_TYPE.PAO:
      chess = new PaoChess(position, color);
      break
    case CHESS_TYPE.ZU:
      chess = new ZuChess(position, color);
      break
    default:
      throw new Error('未知的棋子类型')
  }

  return chess
}

/**
 * 棋盘
 */

class Chessboard {
  constructor() {
    /**
     * 棋盘网格，并为每个网格填充相关的位置信息
     */
    this.grid = Array.from(Array(10), (_, index) =>
      Array.from(Array(9), (_, idx) => `${index},${idx}`)
    );
    /**
     * 当前棋盘所有的棋子
     */
    this.chessPool = [];
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
    // 0,0指向左上角，9,8指向右下角
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
        this.chessPool.push(createChess(item));
      });
    } else {
      const allChess = createStandardChessMap();

      allChess.forEach((chess) => {
        this.chessPool.push(chess);
      });
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
    const [x, y] = position.split(',').map(Number);

    return x === 0 || x === 9 || y === 0 || y === 8
  }
  /**
   * 废弃掉棋子
   * @param {String} position
   */
  discard(position, playOrder) {
    const discardedChess = this.getChess(position);

    discardedChess.setPosition(DISCARDED_CHESS, () => {
      discardedChess.playOrder = playOrder;
    });

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
}

/**
 * 棋局
 */

class Chessgame {
  constructor() {
    /**
     * 当前棋手
     */
    this.player = null;
    /**
     * 下一位棋手
     */
    this.nextPlayer = null;
    /**
     * 棋局状态
     */
    this.status = CHESSGAME_STATUS.VS;
    /**
     * 胜者
     */
    this.winner = '';
    /**
     * 棋盘
     */
    this.chessboard = null;
    /**
     * 走法记录表：用于悔棋，撤销
     */
    this.playRecord = [];
  }
  /**
   * 当前在棋盘内的的棋子
   */
  get chessPool() {
    return this.chessboard.usableChessPool
  }
  /**
   * 棋盘处于将军状态
   */
  get isJiangjun() {
    return [
      this.status === CHESSGAME_STATUS.JIANG_JUN,
      {
        jiangjunzhe: this.player.name,
        bei_jiangjunzhe: this.nextPlayer.name,
      },
    ]
  }
  /**
   * 当前执棋者可以下棋
   */
  get canPlay() {
    // 棋局处于对战状态并且当前棋手有棋子可下
    return this.status === CHESSGAME_STATUS.vs
  }
  /**
   * 猜和
   *
   * 返回`true`，表示第一位棋手为红方
   *
   * 返回`false`，表示第二位棋手为红方
   */
  static guessFirst() {
    return Math.random() > 0.5
  }

  setup(firstPlayerName = 'jia_fang', secondPlayerName = 'yi_fang', opts = {}) {
    /**
     * chessMap：初始化的棋谱
     * letFirstPlayer：让先，该棋手先行
     */
    const {
      chessMap,
      letFirstPlayer,
      isBlackFirst = false,
      beforeSetup,
      afterSetup,
    } = opts;

    if (typeof beforeSetup === 'function') {
      beforeSetup.call(this, this);
    }
    // 初始化棋手
    if (
      typeof firstPlayerName !== 'string' ||
      typeof secondPlayerName !== 'string' ||
      firstPlayerName === secondPlayerName
    ) {
      throw new Error('棋手名称不能重复，必须唯一！')
    }
    if (
      letFirstPlayer !== undefined &&
      [firstPlayerName, secondPlayerName].indexOf(letFirstPlayer) === -1
    ) {
      throw new Error('让先[letFirstPlayer]的值为任一棋手的名称！')
    }

    const firstPlayer = new Player(firstPlayerName);
    const secondPlayer = new Player(secondPlayerName);
    const guessFirstResult = Chessgame.guessFirst();
    const belongtoPlayer = (isFirst) => {
      if (isFirst) {
        firstPlayer.setColor(PLAYER_COLOR.RED);
        secondPlayer.setColor(PLAYER_COLOR.BLACK);

        this.player = firstPlayer;
        this.nextPlayer = secondPlayer;
      } else {
        firstPlayer.setColor(PLAYER_COLOR.BLACK);
        secondPlayer.setColor(PLAYER_COLOR.RED);

        this.player = secondPlayer;
        this.nextPlayer = firstPlayer;
      }
    };

    // 如果有设置让先，则让先，否则猜先
    if (letFirstPlayer !== undefined) {
      belongtoPlayer(letFirstPlayer === firstPlayerName);
    } else {
      belongtoPlayer(guessFirstResult);
    }

    // 初始化棋盘
    this.chessboard = new Chessboard();
    // 初始化棋谱
    this.chessboard.initChessMap(chessMap);

    this.player.sitdown(this.chessboard);
    this.nextPlayer.sitdown(this.chessboard);

    // 黑方先行，多见于象棋残谱破解
    if (isBlackFirst) {
      this.turnToNext();
    }

    if (typeof afterSetup === 'function') {
      afterSetup.call(this, this);
    }
  }
  /**
   * 棋局执行下棋动作
   * @param {String} from
   * @param {String} to
   */
  playChess(from, to) {
    if (this.canPlay) {
      const playOrder = this.playRecord.length + 1;
      const playInfo = this.player.playChess(from, to, playOrder);

      if (playInfo === null) {
        return
      } else {
        this.playRecord.push(playInfo);
      }

      // 设置棋盘状态, 返回false说明棋局已决出胜负
      if (this.checkChessGameStatus()) {
        // 棋手轮转
        this.turnToNext();
      }
    }
  }
  /**
   * 悔棋
   */
  regretChess() {
    const record = this.playRecord.pop();
    const [playOrder, chess, track, discardedChess] = record.split(':');
    const [from, to] = track.split('=>');

    this.chessboard.getChess(to).setPosition(from);

    if (discardedChess !== undefined) {
      // 有吃棋子的行为，将吃掉的棋子恢复原位
      const restoredChess = this.chessboard.getDiscardedChess(Number(playOrder));

      restoredChess.setPosition(to, () => {
        restoredChess.playOrder = -1;
      });
    }

    this.turnToNext();
  }

  /**
   * 棋局控制权轮转到下一位
   */
  turnToNext() {
    const temp = this.player;

    this.player = this.nextPlayer;
    this.nextPlayer = temp;
  }
  /**
   * 判断下一位棋手的将帅棋是否被将军
   */
  checkJiangjun() {
    return (
      this.player.allChessTread.indexOf(
        this.nextPlayer.jiangshuaiChess.position
      ) > -1
    )
  }
  /**
   * 检测棋局状态
   *
   * 返回`false`表明棋局已决出胜负
   *
   * 返回`true`表明棋局还在对战中
   */
  checkChessGameStatus() {
    // 对方棋手的将帅棋子已经被吃
    if (this.nextPlayer.lostJiangshuaiChess) {
      this.status = CHESSGAME_STATUS.WIN;
      this.winner = this.player.name;

      return false
    }
    // 判断棋子是否会[将军]到对方的**将帅**
    if (this.checkJiangjun()) {
      this.status = CHESSGAME_STATUS.JIANG_JUN;
    }

    return true
  }
}

/**
 * 启动程序
 */

export default Chessgame;
