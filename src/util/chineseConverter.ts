import * as OpenCC from 'opencc-js'

const chineseConverter = OpenCC.Converter({ from: 'tw', to: 'cn' })

export const chineseSimplifiedToTraditionalConverter = OpenCC.Converter({ from: 'cn', to: 'tw' })

export default chineseConverter
