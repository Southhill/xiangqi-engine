import { CHESS_COLOR } from './map'

function flips(num) {
  return num ^ 1
}
export function isObject(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1) === 'Object'
}

/**
 * 判断给定位置是否在限定的矩形框内
 */
export function posInRange(pos, range) {
  const [x, y] = pos
  const [rangeStart, rangeEnd] = range
  const [startX, startY] = rangeStart
  const [endX, endY] = rangeEnd

  return x >= startX && x <= endX && y >= startY && y <= endY
}
/**
 * 获取田字格两端坐标的中心点
 */
export function halfPoint(pointStart, pointEnd) {
  const [startX, startY] = pointStart.split(',').map(Number)
  const [endX, endY] = pointEnd.split(',').map(Number)

  return `${(startX + endX) / 2},${(startY + endY) / 2}`
}
/**
 * 当前棋子是否位于（己方）棋盘边界上
 * @param {Array} point 棋子位置, 例如: [5, 4]
 * @param {String} color 棋子颜色，不传该参数时，判断该棋子是否位于棋盘边线上。否则判断棋子是否位于己方边线上
 */
export function locateEdge(point, color) {
  const [x, y] = point

  if (color === CHESS_COLOR.RED) {
    return x === 0 || x === 4 || y === 0 || y === 8
  } else if (color === CHESS_COLOR.BLACK) {
    return x === 5 || x === 9 || y === 0 || y === 8
  } else {
    return x === 0 || x === 9 || y === 0 || y === 8
  }
}
/**
 * 该棋子是否位于对方底线上
 */
export function locateBaseline(point, color, isNegation) {
  const [x] = point

  if (color !== undefined && isNegation) {
    color = flips(color)
  }

  return color === CHESS_COLOR.RED ? x === 9 : x === 0
}
/**
 * 该棋子是否位于对方低线上
 */
export function locateLowerBaseline(point, color, isNegation) {
  const [x] = point

  if (color !== undefined && isNegation) {
    color = flips(color)
  }

  return color === CHESS_COLOR.RED ? [8, 9].includes(x) : [0, 1].includes(x)
}
/**
 * 当前棋子是否位于（己方）棋盘角落上
 * @param {String} position 棋子位置, 例如: '5,4'
 * @param {String} color 棋子颜色，不传该参数时，判断该棋子是否位于棋盘边线上。否则判断棋子是否位于己方边线上
 */
export function locateCorner(position, color) {
  if (color === CHESS_COLOR.RED) {
    return ['0,0', '0,8', '4,0', '4,8'].includes(position)
  } else if (color === CHESS_COLOR.BLACK) {
    return ['5,0', '5,8', '9,0', '9,8'].includes(position)
  } else {
    return ['0,0', '0,8', '9,0', '9,8'].includes(position)
  }
}
/**
 * 当前棋子是否位于（己方）棋盘角落上在过的一个位置，也即标准棋盘开局时馬的位置
 * @param {String} position 棋子位置, 例如: '5,4'
 * @param {String} color 棋子颜色，不传该参数时，判断该棋子是否位于棋盘边线上。否则判断棋子是否位于己方边线上
 */
export function locateMinorCorner(position, color) {
  if (color === CHESS_COLOR.RED) {
    return ['0,1', '0,7', '1,0', '1,8'].includes(position)
  } else if (color === CHESS_COLOR.BLACK) {
    return ['8,0', '8,8', '9,1', '9,7'].includes(position)
  } else {
    return ['0,1', '0,7', '1,0', '1,8', '8,0', '8,8', '9,1', '9,7'].includes(
      position
    )
  }
}
/**
 * 当前棋子是否位于（对方）九宫中
 * @param {Array} point 棋子位置
 * @param {String} color 棋子颜色
 */
export function locateNinePalaces(point, color) {
  if (color === CHESS_COLOR.RED) {
    return posInRange(point, [
      [7, 3],
      [9, 5],
    ])
  } else if (color === CHESS_COLOR.BLACK) {
    return posInRange(point, [
      [0, 3],
      [2, 5],
    ])
  } else {
    return (
      posInRange(point, [
        [7, 3],
        [9, 5],
      ]) ||
      posInRange(point, [
        [0, 3],
        [2, 5],
      ])
    )
  }
}
/**
 * 创建棋盘网格的二维数组
 */
export function createChessboardGrid() {
  return Array.from(Array(10), (_, index) =>
    Array.from(Array(9), (_, idx) => `${index},${idx}`)
  )
}
/**
 * 【马】棋，获取马腿位置
 */
export function horseLegPoint(pointStart, pointEnd) {
  const [startX, startY] = pointStart.split(',').map(Number)
  const [endX, endY] = pointEnd.split(',').map(Number)
  const diffX = Math.abs(endX - startX)
  const diffY = Math.abs(endY - startY)

  if (diffX > diffY) {
    return `${(startX + endX) / 2},${startY}`
  } else {
    return `${startX},${(startY + endY) / 2}`
  }
}

export function generateI18n(i18nMap) {
  return function i18ner(str, opts = {}) {
    if (!isObject(i18nMap)) {
      return str
    }

    const { isStepI18n = false } = opts

    if (isStepI18n) {
      return str
        .split('')
        .map((s) => i18nMap[s] || s)
        .join('')
    }

    return i18nMap[str] || str
  }
}
