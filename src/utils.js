import { CHESS_COLOR } from './map'

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
 * 当前棋子是否位于己方的棋盘边界上
 * @param {Array} point 棋子位置, 例如: [5, 4]
 * @param {String} color 棋子颜色
 */
export function locateSelfEdge(point, color) {
  const [x, y] = point

  if (color === CHESS_COLOR.RED) {
    return x === 0 || x === 4 || y === 0 || y === 8
  } else {
    return x === 5 || x === 9 || y === 0 || y === 8
  }
}
/**
 * 当前棋子是否位于己方的棋盘角落上
 * @param {String} position 棋子位置, 例如: '5,4'
 * @param {String} color 棋子颜色
 */
export function locateSelfCorner(position, color) {
  if (color === CHESS_COLOR.RED) {
    return ['0,0', '0,8', '4,0', '4,8'].includes(position)
  } else {
    return ['5,0', '5,8', '9,0', '9,8'].includes(position)
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
