const defaultConfig = {
  firstPlayerName: 'jia',
  secondPlayerName: 'yi',
  roundNumForStart: 6, // 开局回合数
  i18nMap: null
}

export function setConfig(obj) {
  if (!isObject(obj)) {
    return
  }

  Object.keys(obj).forEach((key) => {
    if (key in defaultConfig) {
      defaultConfig[key] = obj[key]
    }
  })
}

const conf = new Proxy(defaultConfig, {
  get(target, key) {
    return target[key]
  },
  set(target, key, value) {
    return true
  }
})

export default conf
