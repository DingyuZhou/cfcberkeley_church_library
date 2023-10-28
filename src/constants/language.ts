export const TRADITIONAL = 'zh-TW'
export const SIMPLIFIED = 'zh-CN'
export const ENGLISH = 'en-US'

export const SUPPORTED_LANGUAGES = [
  { code: TRADITIONAL, name: '繁體中文' },
  { code: SIMPLIFIED, name: '简体中文' },
  { code: ENGLISH, name: 'English' },
]
export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0]

const TEXT_IN_MULTIPLE_LANGUAGES: {
  [textInEnglish: string] : {
    [selectedLanguage: string]: string
  }
} = {
  'Welcome!': {
    [ENGLISH]: 'Welcome!',
    [TRADITIONAL]: '歡迎！',
    [SIMPLIFIED]: '欢迎！',
  },
  'Search': {
    [ENGLISH]: 'Search',
    [TRADITIONAL]: '搜索',
    [SIMPLIFIED]: '搜索',
  },
  'CFC Berkeley Library': {
    [ENGLISH]: 'CFC Berkeley Library',
    [TRADITIONAL]: 'CFC Berkeley圖書館',
    [SIMPLIFIED]: 'CFC Berkeley图书馆',
  },
  'Sign In': {
    [ENGLISH]: 'Sign In',
    [TRADITIONAL]: '用戶登錄',
    [SIMPLIFIED]: '用户登录',
  },
  'Donate Book': {
    [ENGLISH]: 'Donate Book',
    [TRADITIONAL]: '捐贈書籍',
    [SIMPLIFIED]: '捐赠书籍',
  },
  'All Categories': {
    [ENGLISH]: 'All',
    [TRADITIONAL]: '所有類別',
    [SIMPLIFIED]: '所有类别',
  },
  'Book': {
    [ENGLISH]: 'Book',
    [TRADITIONAL]: '書籍',
    [SIMPLIFIED]: '书籍',
  },
}

export function getTextInSelectedLanguage(textInEnglish: string, selectedLanguage: string) {
  return (
    TEXT_IN_MULTIPLE_LANGUAGES[textInEnglish]?.[selectedLanguage] ||
    TEXT_IN_MULTIPLE_LANGUAGES[textInEnglish]?.[ENGLISH] ||
    textInEnglish
  )
}
