/**
 * 棋局
 */
import Player from './player'
import Chessboard from './chessboard'
import PlayRecord from './playrecord'

import defaultConfig from './config'
import {
  CHESSGAME_STATUS,
  CHESS_COLOR,
  END_CHESSGAME_REASON,
  CHESSGAME_PERIOD,
} from './map'

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
     * 棋局结束的原因
     */
    this.reason = ''
    /**
     * 胜者
     */
    this.winner = ''
    /**
     * 棋盘
     */
    this.chessboard = null
    /**
     * 走法记录表：用于悔棋(撤销)
     */
    this.playRecordTable = []
    /**
     * 棋局的对局状态
     */
    this._status = CHESSGAME_STATUS.VS
    /**
     * 应用的状态，有如下值：chaos(混沌), setuping(设置中), running(正在运行), end(结束)
     */
    this._appStatus = 'chaos'
  }
  get status() {
    return this._status
  }
  set status(value) {
    this._status = value

    if (value === CHESSGAME_STATUS.WIN) {
      this.winner = this.player.name
    }
  }
  get appStatus() {
    return this._appStatus
  }
  set appStatus(val) {
    this.runLifeCycleHook(`${this.appStatus}->${val}`)

    this._appStatus = val
  }
  /**
   * 判断当前棋局处于什么阶段
   * 基本上来说前6个回合算开局
   * （任意一方）车马炮6个大子死掉半数以上就算残局了
   * 除了开局和残局其它都算中局
   */
  get chessGamePeriod() {
    // 开局阶段默认为前6个回合
    if (this.playRecordTable.length <= defaultConfig.roundNumForStart * 2) {
      return CHESSGAME_PERIOD.START
    }

    const redBigChesses = this.chessboard.bigChesses.filter(
      (chess) => chess.color === CHESS_COLOR.RED
    )
    const blackBigChesses = this.chessboard.bigChesses.filter(
      (chess) => chess.color === CHESS_COLOR.BLACK
    )
    if (Math.min(redBigChesses.length, blackBigChesses.length) <= 3) {
      return CHESSGAME_PERIOD.MIDDLE
    }

    return CHESSGAME_PERIOD.LAST
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
  get isJiangJun() {
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
      // eslint-disable-next-line no-unused-vars
      const [playOrder, chess, track, discardedChess] = record.split(':')
      const [color] = chess.split('-')
      const [from, to] = track.split('=>')
      const pr = new PlayRecord(from, to, color, this.chessboard)

      return pr.getPlayRecord()
    })
  }
  /**
   * 猜先
   *
   * 返回`true`，表示第一位棋手为红方
   *
   * 返回`false`，表示第二位棋手为红方
   */
  static guessFirst() {
    return Math.random() > 0.5
  }

  runLifeCycleHook(str) {
    const funcMap = {
      'chaos->setuping': 'beforeSetup',
      'setuping->running': 'afterSetup',
    }
    const hookName = funcMap[str] || 'unknown'

    if (typeof this[hookName] === 'function') {
      this[hookName].call(this)
    }
  }

  setup(
    firstPlayerName = defaultConfig.firstPlayerName,
    secondPlayerName = defaultConfig.secondPlayerName,
    opts = {}
  ) {
    this.appStatus = 'setuping'
    /**
     * chessMap：初始化的棋谱
     * letFirstPlayer：让先，逻辑为：该棋手的归属方设置为红方，如果没有让先的值，则使用猜先逻辑
     * isBlackFirst: 黑棋先行
     */
    const { chessMap, letFirstPlayer, isBlackFirst = false } = opts

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
        firstPlayer.setColor(CHESS_COLOR.RED)
        secondPlayer.setColor(CHESS_COLOR.BLACK)

        this.player = firstPlayer
        this.nextPlayer = secondPlayer
      } else {
        firstPlayer.setColor(CHESS_COLOR.BLACK)
        secondPlayer.setColor(CHESS_COLOR.RED)

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

    this.appStatus = 'running'
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
      // todo：评估当前棋局
      this.chessboard.evaluate(this.chessGamePeriod)

      if (playInfo === null) {
        return
      } else {
        this.playRecordTable.push(playInfo)
      }

      // 设置棋盘状态, 返回false说明棋局已决出胜负
      if (this.checkGameStatus()) {
        // 棋手轮转
        this.turnToNext()
      }
    }
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
   * 悔棋
   */
  regretChess() {
    // 丢弃棋招记录
    const record = this.playRecordTable.pop()
    // eslint-disable-next-line no-unused-vars
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
   * 默认为当前棋手主动认输
   */
  confess(color = this.player.color) {
    this.status = CHESSGAME_STATUS.WIN
    this.reason = END_CHESSGAME_REASON.REN_SHU

    if (color === this.player.color) {
      this.winner = this.nextPlayer.name
    } else {
      this.winner = this.player.name
    }
  }
  /**
   * 主持人结束棋局
   */
  finishGameByHost() {}

  /**
   * 判断下一位棋手的将帅棋是否被将军
   */
  checkJiangJun() {
    return this.player.allChessTread.includes(
      this.nextPlayer.jiangChess.position
    )
  }
  /**
   * 检测棋局状态
   *
   * 返回`false`表明棋局已决出胜负
   *
   * 返回`true`表明棋局还在对战中
   */
  checkGameStatus() {
    if (this.checkEndGame()) {
      this.appStatus = 'end'
      return false
    }
    // 判断棋子是否会[将军]到对方的**将帅**
    if (this.checkJiangJun()) {
      this.status = CHESSGAME_STATUS.JIANG_JUN
    }

    return true
  }
  /**
   * 判断是否能够结束游戏，有如下情况：
   *
   * 将死，困毙，认输，长打，（违规，违纪，超时）
   */
  checkEndGame() {
    // 将死，对方棋手的将帅棋子已经被吃
    if (this.nextPlayer.lostJiangChess) {
      this.status = CHESSGAME_STATUS.WIN
      this.reason = END_CHESSGAME_REASON.JIANG_SI

      return true
    }
    // 困毙
    if (!this.nextPlayer.allChessTread.length) {
      this.status = CHESSGAME_STATUS.WIN
      this.reason = END_CHESSGAME_REASON.KUN_BI

      return true
    }

    return false
  }
}
