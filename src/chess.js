/**
 * 棋子
 */
import { CHESS_TYPE } from './map'

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
   * 该棋子处于将军位置
   */
  get jiangjun() {}
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
   * 走法
   */
  get treads() {
    return []
  }

  /**
   * 该类型棋子行走范围
   * 将帅棋只能走九宫格
   */
  get walkScope() {
    return ''
  }

  /**
   * 创造棋子
   */
  create() {}
}

export { JIANG_SHUAI_Chess }
