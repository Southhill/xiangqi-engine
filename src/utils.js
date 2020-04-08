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
