import { CHESS_COLOR } from './map'

/**
 * 当前棋面的评估函数
 */

function evaluate(chessPool, period) {
  let result = 0

  // 处理每个棋子的子力
  const totalZili = this.usableChessPool.reduce((total, chess) => {
    const zili = chess.getCurrentZili(period)

    if (chess.color === CHESS_COLOR.RED) {
      return total + zili
    } else {
      return total - zili
    }
  }, 0)

  result += totalZili

  return result
}

export default evaluate
