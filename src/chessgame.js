/**
 * 棋局
 */
import Player from './player'
import { CHESSGAME_STATUS } from './map'

export default class Chessgame {
  constructor() {
    /**
     * 当前棋手
     */
    this.player = null
    /**
     * 下一位棋手
     */
    this.nextPlayer = null
    /**
     * 棋局状态
     */
    this.status = CHESSGAME_STATUS.VS
    /**
     * 胜者
     */
    this.winner = ''
  }
  /**
   * 猜和
   * 返回`true`，表示第一位棋手为红方
   * 返回`false`，表示第二位棋手为红方
   */
  static guessFirst() {
    return Math.random() > 0.5
  }

  setup(firstPlayerName = 'jia_fang', secondPlayerName = 'yi_fang') {
    if (
      typeof firstPlayerName !== 'string' ||
      typeof secondPlayerName !== 'string' ||
      firstPlayerName === secondPlayerName
    ) {
      throw new Error('棋手名称不能重复，必须唯一！')
    }
    const firstPlayer = new Player(firstPlayerName)
    // 初始化棋手
    // 初始化棋盘
    // 加入甲方棋子
    // 加入乙方棋子
  }
}
