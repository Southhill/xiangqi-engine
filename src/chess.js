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
   * 棋子位置的别名
   */
  get aliasPosition() {}
  /**
   * 设置棋子的位置
   */
  setPosition(position) {
    this.position = position
  }
}

class JIANG_SHUAI_Chess extends BaseChess {
  constructor(position, color) {
    super(position, color)
    /**
     * 棋子类型
     */
    this.type = CHESS_TYPE.JIANG_SHUAI
  }
  /**
   * 下一步的走法位置枚举
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
   * 创造棋子
   */
  create() {}
}

export { JIANG_SHUAI_Chess }
