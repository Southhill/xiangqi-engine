/**
 * 棋局
 */
import Player from './player'
import Chessboard from './chessboard'
import PlayRecord from './playrecord'

import { CHESSGAME_STATUS, PLAYER_COLOR } from './map'

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
    /**
     * 棋局结束的原因
     */
    this.reason = ''
    /**
     * 棋盘
     */
    this.chessboard = null
    /**
     * 走法记录表：用于悔棋，撤销
     */
    this.playRecordTable = []
  }
  /**
   * 当前在棋盘内的的棋子
   */
  get chessPool() {
    return this.chessboard.usableChessPool
  }
  /**
   * 棋盘处于将军状态,
   * 当前待下棋者为被将军方
   */
  get isJiangjun() {
    return this.status === CHESSGAME_STATUS.JIANG_JUN
  }
  /**
   * 当前执棋者可以下棋
   */
  get canPlay() {
    // 棋局处于对战, 或将军状态并且当前棋手有棋子可下
    return [CHESSGAME_STATUS.VS, CHESSGAME_STATUS.JIANG_JUN].includes(
      this.status
    )
  }
  get readPlayRecordTable() {
    return this.playRecordTable.map((record) => {
      const [playOrder, chess, track, discardedChess] = record.split(':')
      const [color] = chess.split('-')
      const [from, to] = track.split('=>')
      const pr = new PlayRecord(from, to, color, this.chessboard)

      return pr.getPlayRecord()
    })
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
    } = opts

    if (typeof beforeSetup === 'function') {
      beforeSetup.call(this, this)
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
      ![firstPlayerName, secondPlayerName].includes(letFirstPlayer)
    ) {
      throw new Error('让先[letFirstPlayer]的值为任一棋手的名称！')
    }

    const firstPlayer = new Player(firstPlayerName)
    const secondPlayer = new Player(secondPlayerName)
    const guessFirstResult = Chessgame.guessFirst()
    const belongtoPlayer = (isFirst) => {
      if (isFirst) {
        firstPlayer.setColor(PLAYER_COLOR.RED)
        secondPlayer.setColor(PLAYER_COLOR.BLACK)

        this.player = firstPlayer
        this.nextPlayer = secondPlayer
      } else {
        firstPlayer.setColor(PLAYER_COLOR.BLACK)
        secondPlayer.setColor(PLAYER_COLOR.RED)

        this.player = secondPlayer
        this.nextPlayer = firstPlayer
      }
    }

    // 如果有设置让先，则让先，否则猜先
    if (letFirstPlayer !== undefined) {
      belongtoPlayer(letFirstPlayer === firstPlayerName)
    } else {
      belongtoPlayer(guessFirstResult)
    }

    // 初始化棋盘
    this.chessboard = new Chessboard()
    // 初始化棋谱
    this.chessboard.initChessMap(chessMap)

    this.player.sitdown(this.chessboard)
    this.nextPlayer.sitdown(this.chessboard)

    // 黑方先行，多见于象棋残谱破解
    if (isBlackFirst) {
      this.turnToNext()
    }

    if (typeof afterSetup === 'function') {
      afterSetup.call(this, this)
    }
  }
  /**
   * 棋局执行下棋动作
   * @param {String} from
   * @param {String} to
   */
  playChess(from, to) {
    if (this.canPlay) {
      const playOrder = this.playRecordTable.length + 1
      const playInfo = this.player.playChess(from, to, playOrder)

      if (playInfo === null) {
        return
      } else {
        this.playRecordTable.push(playInfo)
      }

      // 设置棋盘状态, 返回false说明棋局已决出胜负
      if (this.checkChessGameStatus()) {
        // 棋手轮转
        this.turnToNext()
      }
    }
  }
  /**
   * 悔棋
   */
  regretChess() {
    // 丢弃棋招记录
    const record = this.playRecordTable.pop()
    const [playOrder, chess, track, discardedChess] = record.split(':')
    const [from, to] = track.split('=>')

    this.chessboard.getChess(to).setPosition(from)

    if (discardedChess !== undefined) {
      // 有吃棋子的行为，将吃掉的棋子恢复原位
      const restoredChess = this.chessboard.getDiscardedChess(Number(playOrder))

      restoredChess.setPosition(to, () => {
        restoredChess.playOrder = -1
      })
    }

    this.turnToNext()
  }

  /**
   * 棋局控制权轮转到下一位
   */
  turnToNext() {
    const temp = this.player

    this.player = this.nextPlayer
    this.nextPlayer = temp
  }
  /**
   * 判断下一位棋手的将帅棋是否被将军
   */
  checkJiangjun() {
    return this.player.allChessTread.includes(
      this.nextPlayer.jiangshuaiChess.position
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
      this.status = CHESSGAME_STATUS.WIN
      this.winner = this.player.name

      return false
    }
    // 判断棋子是否会[将军]到对方的**将帅**
    if (this.checkJiangjun()) {
      this.status = CHESSGAME_STATUS.JIANG_JUN
    }

    return true
  }
}
