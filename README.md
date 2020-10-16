# xiangqi

## description

xiangqi is chinese chess game engine

## xiangqi rules

### 1. chessboard rules
整个棋盘以“河界”分为相等的两部分。为了比赛记录和学习棋谱方便起见，现行规则规定：按九条竖线从右至左用中文数字一至九来表示红方的每条竖线，用阿拉伯数字1只至9来表示黑方的每条竖线。己方的棋子始终使用己方的线路编号，无论棋子是否“过河”。

### 2. play rules
对弈开始之前，红黑双方应该把棋子摆放在规定的位置。任何棋子每走一步，进就写“进”，退就写“退”，如果像车一样横着走，就写“平”。

## 3. record rules
现行的记谱法一般使用四个字来记录棋子的移动。
第一个字表示需要移动的棋子。
第二个字表示移动的棋子所在的直线编码（红黑方均为由己方底线从右向左数），红方用汉字，黑方用阿拉伯数字表示。当同一直线上有两个相同的棋子，则采用前、后来区别，如“后车平四”、“前马进7”。
第三个字表示棋子移动的方向，横走用”平“，向对方底线前进用”进“，向己方底线后退用”退“。
第四个字分为两类：棋子在直线上进退时，表示棋子进退的步数；当棋子平走或斜走的时候，表示所到达直线的编号。

## evaluate

<table border="1" style="width: 464px;">
  <tbody>
    <tr>
      <td colspan="2" align="center">棋子名称</td>
      <td colspan="3" align="center">活动范围</td>
      <td colspan="3" align="center">子力价值</td>
    </tr>
    <tr>
      <td align="center">红</td>
      <td align="center">黑</td>
      <td align="center">中央</td>
      <td align="center">边线</td>
      <td align="center">角落</td>
      <td align="center">开局</td>
      <td align="center">中局</td>
      <td align="center">残局</td>
    </tr>
    <tr>
      <td align="center">帅</td>
      <td align="center">将</td>
      <td align="center">
        <font face="Times New Roman">4</font>
      </td>
      <td align="center">
        <font face="Times New Roman">3</font>
      </td>
      <td align="center">
        <font face="Times New Roman">2</font>
      </td>
      <td align="center">
        <font face="Times New Roman">-</font>
      </td>
      <td align="center">
        <font face="Times New Roman">-</font>
      </td>
      <td align="center">
        <font face="Times New Roman">-</font>
      </td>
    </tr>
    <tr>
      <td align="center">仕</td>
      <td align="center">士</td>
      <td align="center">
        <font face="Times New Roman">4</font>
      </td>
      <td align="center">
        <font face="Times New Roman">-</font>
      </td>
      <td align="center">
        <font face="Times New Roman">1</font>
      </td>
      <td align="center">
        <font face="Times New Roman">1</font>
      </td>
      <td align="center">
        <font face="Times New Roman">2</font>
      </td>
      <td align="center">
        <font face="Times New Roman">2</font>
      </td>
    </tr>
    <tr>
      <td align="center">相</td>
      <td align="center">象</td>
      <td align="center">
        <font face="Times New Roman">4</font>
      </td>
      <td align="center">
        <font face="Times New Roman">2</font>
      </td>
      <td align="center">
        <font face="Times New Roman">-</font>
      </td>
      <td align="center">
        <font face="Times New Roman">2</font>
      </td>
      <td align="center">
        <font face="Times New Roman">2</font>
      </td>
      <td align="center">
        <font face="Times New Roman">3</font>
      </td>
    </tr>
    <tr>
      <td align="center">马</td>
      <td align="center">马</td>
      <td align="center">
        <font face="Times New Roman">8/6/4</font>
      </td>
      <td align="center">
        <font face="Times New Roman">4/3</font>
      </td>
      <td align="center">
        <font face="Times New Roman">2</font>
      </td>
      <td align="center">
        <font face="Times New Roman">4</font>
      </td>
      <td align="center">
        <font face="Times New Roman">5</font>
      </td>
      <td align="center">
        <font face="Times New Roman">5</font>
      </td>
    </tr>
    <tr>
      <td align="center">车</td>
      <td align="center">车</td>
      <td align="center">
        <font face="Times New Roman">17</font>
      </td>
      <td align="center">
        <font face="Times New Roman">17</font>
      </td>
      <td align="center">
        <font face="Times New Roman">17</font>
      </td>
      <td align="center">
        <font face="Times New Roman">10</font>
      </td>
      <td align="center">
        <font face="Times New Roman">10</font>
      </td>
      <td align="center">
        <font face="Times New Roman">10</font>
      </td>
    </tr>
    <tr>
      <td align="center">炮</td>
      <td align="center">炮</td>
      <td align="center">
        <font face="Times New Roman">17/13</font>
      </td>
      <td align="center">
        <font face="Times New Roman">17/14</font>
      </td>
      <td align="center">
        <font face="Times New Roman">17/15</font>
      </td>
      <td align="center">
        <font face="Times New Roman">5</font>
      </td>
      <td align="center">
        <font face="Times New Roman">5</font>
      </td>
      <td align="center">
        <font face="Times New Roman">6</font>
      </td>
    </tr>
    <tr>
      <td align="center">兵</td>
      <td align="center">卒</td>
      <td align="center">
        <font face="Times New Roman">1/3</font>
      </td>
      <td align="center">
        <font face="Times New Roman">1/2</font>
      </td>
      <td align="center">
        <font face="Times New Roman">1</font>
      </td>
      <td align="center">
        <font face="Times New Roman">2</font>
      </td>
      <td align="center">
        <font face="Times New Roman">1/3/5</font>
      </td>
      <td align="center">
        <font face="Times New Roman">3/2/1</font>
      </td>
    </tr>
  </tbody>
</table>

## reference links
1. [象棋（棋类益智游戏）_百度百科](https://baike.baidu.com/item/%E8%B1%A1%E6%A3%8B/30665?fr=aladdin)
