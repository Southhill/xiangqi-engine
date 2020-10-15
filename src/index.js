import Chessgame from './chessgame'
import { generateI18n } from './utils'

Chessgame.config = (opts = {}) => {
  const { i18nMap } = opts

  Chessgame.i18ner = generateI18n(i18nMap)
}

Chessgame.i18ner = (str) => str // 默认的i18n函数
Chessgame.version = '__VERSION__'

export default Chessgame
