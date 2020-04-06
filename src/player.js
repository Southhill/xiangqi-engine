/**
 * 棋手
 * 甲方在前，乙方在后
 */
import { PLAYER_TYPE } from './map'

 export default class Player {
     constructor(type, chessboard) {
         /**
          * 棋手的势力：甲方，乙方
          */
         this.type = type
         /**
          * 棋盘
          */
         this.chessboard = chessboard
     }

     get ownChessboard() {
        if (this.type === PLAYER_TYPE.JIA_FANG) {
            return this.chessboard.grid.slice(0, 5)
        } else {
           return this.chessboard.grid.slice(5)
        }
    }
    get ownChessboardScope() {
       if (this.type === PLAYER_TYPE.JIA_FANG) {
           return [[0, 0], [4, 8]]
       } else {
           return [[5, 0], [9, 8]]
       }
    }
 }
