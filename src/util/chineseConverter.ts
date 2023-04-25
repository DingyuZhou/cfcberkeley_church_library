import * as OpenCC from 'opencc-js'

const chineseConverter = OpenCC.Converter({ from: 'hk', to: 'cn' })

export default chineseConverter
