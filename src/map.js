/**
 * 常量类型
 */

export const CHESS_TYPE = {
  /**
   * 将（帅）
   */
  JIANG: 'jiang',
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
  /**
   * 该局无效
   */
  INVALID: 'invalid',
}

/**
 * 棋局当前所处的期间：开局，中局，残局
 */
export const CHESSGAME_PERIOD = {
  /**
   * 开局
   */
  START: 'start',
  /**
   * 中局
   */
  MIDDLE: 'middle',
  /**
   * 残局
   */
  LAST: 'last',
}

export const END_CHESSGAME_REASON = {
  /**
   * 将死
   */
  JIANG_SI: '将死',
  /**
   * 困毙
   */
  KUN_BI: '困毙',
  /**
   * 认输
   */
  REN_SHU: '认输',
  /**
   * 长打
   */
  CHANG_DA: '长打',
  /**
   * 违规
   */
  WEI_GUI: '违规',
  /**
   * 违纪
   */
  WEI_JI: '违纪',
  /**
   * 超时
   */
  CHAO_SHI: '超时',
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
