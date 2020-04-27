/**
 * 常量类型
 */

export const CHESS_TYPE = {
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
  ZU: 'zu',
}

export const PLAYER_COLOR = {
  /**
   * 红方
   */
  RED: 'red',
  /**
   * 黑方
   */
  BLACK: 'black',
}

export const CHESSGAME_STATUS = {
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
  HE: 'he',
}

export const FINISH_CHESSGAME_REASON = {
  /**
   * 将死
   */
  jiangsi: '将死',
  /**
   * 困毙
   */
  kunbi: '困毙',
  /**
   * 认输
   */
  renshu: '认输',
  /**
   * 长打
   */
  changda: '长打',
  /**
   * 违规
   */
  weigui: '违规',
  /**
   * 违纪
   */
  weiji: '违纪',
  /**
   * 超时
   */
  chaoshi: '超时',
}

export const RED_PLAY_STEP = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '七',
  8: '八',
  9: '九',
}

/**
 * 表示该棋子在棋盘外，也即处于废弃状态
 */
export const DISCARDED_CHESS = '-1,-1'
