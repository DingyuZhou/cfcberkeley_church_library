import chineseConverter, { chineseSimplifiedToTraditionalConverter } from 'src/util/chineseConverter'

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
  'Admin Login': {
    [ENGLISH]: 'Admin Login',
    [TRADITIONAL]: '管理員登錄',
    [SIMPLIFIED]: '管理员登录',
  },
  'Sign In': {
    [ENGLISH]: 'Sign In',
    [TRADITIONAL]: '登錄',
    [SIMPLIFIED]: '登录',
  },
  'Password': {
    [ENGLISH]: 'Password',
    [TRADITIONAL]: '登錄密碼',
    [SIMPLIFIED]: '登录密码',
  },
  'The email or password may not be correct': {
    [ENGLISH]: 'The email or password may not be correct',
    [TRADITIONAL]: '賬號或密碼不正確',
    [SIMPLIFIED]: '账号或密码不正确',
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

  'no matching result': {
    [ENGLISH]: 'Unfortunately, we could not find any matching results for your search',
    [TRADITIONAL]: '非常抱歉，沒有找到任何您搜索的內容',
    [SIMPLIFIED]: '非常抱歉，没有找到任何您搜索的内容',
  },

  'try to search other keywords': {
    [ENGLISH]: 'If you have any specific titles or keywords in mind, please try refining your search or feel free to ask for assistance. We are here to help!',
    [TRADITIONAL]: '請嘗試使用其他關鍵詞進行搜索，或者您也可以聯繫我們的工作人員',
    [SIMPLIFIED]: '请尝试使用其他关键词进行搜索，或者您也可以联系我们的工作人员',
  },

  'Book Title': {
    [ENGLISH]: 'Title',
    [TRADITIONAL]: '書名',
    [SIMPLIFIED]: '书名',
  },

  'Category': {
    [ENGLISH]: 'Category',
    [TRADITIONAL]: '類別',
    [SIMPLIFIED]: '类别',
  },

  'Author': {
    [ENGLISH]: 'Author',
    [TRADITIONAL]: '作者',
    [SIMPLIFIED]: '作者',
  },

  'Translator': {
    [ENGLISH]: 'Translator',
    [TRADITIONAL]: '譯者',
    [SIMPLIFIED]: '译者',
  },

  'Publisher': {
    [ENGLISH]: 'Publisher',
    [TRADITIONAL]: '出版社',
    [SIMPLIFIED]: '出版社',
  },

  'Library Number': {
    [ENGLISH]: 'Library Number',
    [TRADITIONAL]: '圖書編碼',
    [SIMPLIFIED]: '图书编码',
  },

  'Book Status': {
    [ENGLISH]: 'Status',
    [TRADITIONAL]: '借閱狀況',
    [SIMPLIFIED]: '借阅状况',
  },

  'Available': {
    [ENGLISH]: 'Available',
    [TRADITIONAL]: '可借閱',
    [SIMPLIFIED]: '可借阅',
  },

  'Borrowed': {
    [ENGLISH]: 'Borrowed',
    [TRADITIONAL]: '已借出',
    [SIMPLIFIED]: '已借出',
  },

  'Borrowed On': {
    [ENGLISH]: 'Borrowed On',
    [TRADITIONAL]: '借出日期',
    [SIMPLIFIED]: '借出日期',
  },

  'Return Due Date': {
    [ENGLISH]: 'Return Due Date',
    [TRADITIONAL]: '歸還日期',
    [SIMPLIFIED]: '归还日期',
  },

  'Thanks for donation': {
    [ENGLISH]: 'Thanks for your donation! Please fill out the form below. Our team will contact you shortly.',
    [TRADITIONAL]: '感謝您的捐贈！請填寫下面的表格，我們的團隊會盡快與您聯繫',
    [SIMPLIFIED]: '感谢您的捐赠！请填写下面的表格，我们的团队会尽快与您联系',
  },

  'First Name': {
    [ENGLISH]: 'First Name',
    [TRADITIONAL]: '名字',
    [SIMPLIFIED]: '名字',
  },

  'Last Name': {
    [ENGLISH]: 'Last Name',
    [TRADITIONAL]: '姓氏',
    [SIMPLIFIED]: '姓氏',
  },

  'US Phone Number': {
    [ENGLISH]: 'US Phone Number',
    [TRADITIONAL]: '美國電話號碼',
    [SIMPLIFIED]: '美国电话号码',
  },

  'Email': {
    [ENGLISH]: 'Email',
    [TRADITIONAL]: '電子郵箱',
    [SIMPLIFIED]: '电子邮箱',
  },

  'Books wish to donate': {
    [ENGLISH]: 'The books you wish to donate, or any other information you would like us to know',
    [TRADITIONAL]: '您想要捐贈的書籍，或者您想讓我們知道的其他信息',
    [SIMPLIFIED]: '您想要捐赠的书籍，或者您想让我们知道的其他信息',
  },

  'Notes for donation': {
    [ENGLISH]: 'Notes for your donation',
    [TRADITIONAL]: '捐贈備註',
    [SIMPLIFIED]: '捐赠备注',
  },

  'Submit': {
    [ENGLISH]: 'Submit',
    [TRADITIONAL]: '提交',
    [SIMPLIFIED]: '提交',
  },

  'Submitting': {
    [ENGLISH]: 'Notes for your donation',
    [TRADITIONAL]: '正在提交中',
    [SIMPLIFIED]: '正在提交中',
  },

  'Back to the library home page': {
    [ENGLISH]: 'Back to the library home page',
    [TRADITIONAL]: '返回圖書館主頁',
    [SIMPLIFIED]: '返回图书馆主页',
  },

  'First name is required': {
    [ENGLISH]: 'The first name is required',
    [TRADITIONAL]: '請填寫您的名字',
    [SIMPLIFIED]: '请填写您的名字',
  },

  'Last name is required': {
    [ENGLISH]: 'The last name is required',
    [TRADITIONAL]: '請填寫您的姓氏',
    [SIMPLIFIED]: '请填写您的姓氏',
  },

  'Phone number is invalid': {
    [ENGLISH]: 'The phone number is invalid',
    [TRADITIONAL]: '電話號碼格式不正確',
    [SIMPLIFIED]: '电话号码格式不正确',
  },

  'Email address is invalid': {
    [ENGLISH]: 'The email address is invalid',
    [TRADITIONAL]: '電子郵箱格式不正確',
    [SIMPLIFIED]: '电子邮箱格式不正确',
  },

  '* marked fields are required': {
    [ENGLISH]: '* marked fields are required',
    [TRADITIONAL]: '*標記的欄位需要填寫',
    [SIMPLIFIED]: '*标记的栏位需要填写',
  },

  'Checkout passcode is invalid': {
    [ENGLISH]: 'The checkout passcode is invalid',
    [TRADITIONAL]: '無效的借閱驗證碼',
    [SIMPLIFIED]: '无效的借阅验证码',
  },

  'Renew passcode is invalid': {
    [ENGLISH]: 'The renew passcode is invalid',
    [TRADITIONAL]: '無效的續借驗證碼',
    [SIMPLIFIED]: '无效的续借验证码',
  },

  'Get checkout passcode': {
    [ENGLISH]: 'Get a checkout passcode',
    [TRADITIONAL]: '獲取借閱驗證碼',
    [SIMPLIFIED]: '获取借阅验证码',
  },

  'Get renew passcode': {
    [ENGLISH]: 'Get a renew passcode',
    [TRADITIONAL]: '獲取續借驗證碼',
    [SIMPLIFIED]: '获取续借验证码',
  },

  'Checkout': {
    [ENGLISH]: 'Checkout',
    [TRADITIONAL]: '借閱',
    [SIMPLIFIED]: '借阅',
  },

  'Renew': {
    [ENGLISH]: 'Renew',
    [TRADITIONAL]: '續借',
    [SIMPLIFIED]: '续借',
  },

  'Checkout Passcode': {
    [ENGLISH]: 'Checkout Passcode',
    [TRADITIONAL]: '借閱驗證碼',
    [SIMPLIFIED]: '借阅验证码',
  },

  'Renew Passcode': {
    [ENGLISH]: 'Renew',
    [TRADITIONAL]: '續借驗證碼',
    [SIMPLIFIED]: '续借验证码',
  },

  'Checkout passcode has sent': {
    [ENGLISH]: 'The checkout passcode has just sent you via SMS. It may take a few minutes for it to arrive. Thanks for your patience!',
    [TRADITIONAL]: '借閱驗證碼剛剛已經通過短信發送給您。可能需要幾分鐘才能收到。非常感謝您的耐心等待！',
    [SIMPLIFIED]: '借阅验证码刚刚已经通过短信发送给您。可能需要几分钟才能收到。非常感谢您的耐心等待！',
  },

  'Renew passcode has sent': {
    [ENGLISH]: 'The renew passcode has just sent you via SMS. It may take a few minutes for it to arrive. Thanks for your patience!',
    [TRADITIONAL]: '續借驗證碼剛剛已經通過短信發送給您。可能需要幾分鐘才能收到。非常感謝您的耐心等待！',
    [SIMPLIFIED]: '续借验证码刚刚已经通过短信发送给您。可能需要几分钟才能收到。非常感谢您的耐心等待！',
  },

  'The renew passcode is not correct': {
    [ENGLISH]: 'The renew passcode is not correct',
    [TRADITIONAL]: '續借驗證碼不正確',
    [SIMPLIFIED]: '续借验证码不正确',
  },

  'The checkout passcode is not correct': {
    [ENGLISH]: 'The checkout passcode is not correct',
    [TRADITIONAL]: '借閱驗證碼不正確',
    [SIMPLIFIED]: '借阅验证码不正确',
  },

  'Borrow Book': {
    [ENGLISH]: 'Borrow The Book',
    [TRADITIONAL]: '借閱此書',
    [SIMPLIFIED]: '借阅此书'
  },

  'Renew Book': {
    [ENGLISH]: 'Renew The Book',
    [TRADITIONAL]: '續借此書',
    [SIMPLIFIED]: '续借此书',
  },

  'is successfully borrowed': {
    [ENGLISH]: 'has been successfully borrowed. Enjoy!',
    [TRADITIONAL]: '已經被您成功借出！',
    [SIMPLIFIED]: '已经被您成功借出！',
  },

  'is successfully renewed': {
    [ENGLISH]: 'has been successfully renewed. Enjoy!',
    [TRADITIONAL]: '已經被您成功續借！',
    [SIMPLIFIED]: '已经被您成功续借！',
  },

  'Due date is:': {
    [ENGLISH]: 'The due date for the book return is:',
    [TRADITIONAL]: '此書的歸還日期是：',
    [SIMPLIFIED]: '此书的归还日期是：',
  },

  'Due date renews to:': {
    [ENGLISH]: 'The due date for the book return has been extended to:',
    [TRADITIONAL]: '此書的歸還日期已經被延長至：',
    [SIMPLIFIED]: '此书的归还日期已经被延长至：',
  },

  'Resend': {
    [ENGLISH]: 'Resend',
    [TRADITIONAL]: '重發',
    [SIMPLIFIED]: '重发',
  },

  'Searching': {
    [ENGLISH]: 'Searching ...',
    [TRADITIONAL]: '正在搜索中，請稍等。。。',
    [SIMPLIFIED]: '正在搜索中，请稍等。。。',
  },

  'unexpected internal error': {
    [ENGLISH]: 'Unexpected internal error. Please try it again later',
    [TRADITIONAL]: '意外的系統錯誤，請稍後再試',
    [SIMPLIFIED]: '意外的系统错误，请稍后再试',
  },

  'due today': {
    [ENGLISH]: 'the book, {{bookTitle}}, you borrowed is due today',
    [TRADITIONAL]: '今天是您借的書《{{bookTitle}}》的歸還日期',
    [SIMPLIFIED]: '今天是您借的书《{{bookTitle}}》的归还日期',
  },

  'due tomorrow': {
    [ENGLISH]: 'the book, {{bookTitle}}, you borrowed is due tomorrow',
    [TRADITIONAL]: '明天是您借的書《{{bookTitle}}》的歸還日期',
    [SIMPLIFIED]: '明天是您借的书《{{bookTitle}}》的归还日期',
  },

  'x days to due': {
    [ENGLISH]: 'the due date of the book, {{bookTitle}}, you borrowed is approaching in just {{days}} days',
    [TRADITIONAL]: '您借的書《{{bookTitle}}》還有{{days}}天就到歸還日期了',
    [SIMPLIFIED]: '您借的书《{{bookTitle}}》还有{{days}}天就到归还日期了',
  },

  'sms - your checkout passcode is': {
    [ENGLISH]: 'Your 6-digit checkout passcode to borrow a book from CFC Berkeley Church library is: {{passcode}}',
    [TRADITIONAL]: '您此次在CFC Berkeley教會圖書館，借閱書籍的驗證碼是：{{passcode}}',
    [SIMPLIFIED]: '您此次在CFC Berkeley教会图书馆，借阅书籍的验证码是：{{passcode}}',
  },

  'sms - your renew passcode is': {
    [ENGLISH]: 'Your 6-digit passcode to renew a book from CFC Berkeley Church library is: {{passcode}}',
    [TRADITIONAL]: '您此次在CFC Berkeley教會圖書館，續借書籍的驗證碼是：{{passcode}}',
    [SIMPLIFIED]: '您此次在CFC Berkeley教会图书馆，续借书籍的验证码是：{{passcode}}',
  },

  'sms - borrowed notice': {
    [ENGLISH]: 'The book, {{itemTitle}}, has been successfully borrowed. The due date for the return is: {{dueAt}}. Enjoy!',
    [TRADITIONAL]: '《{{itemTitle}}》已經被您成功借出。其歸還日期是: {{dueAt}}。謝謝！',
    [SIMPLIFIED]: '《{{itemTitle}}》已经被您成功借出。其归还日期是: {{dueAt}}。 谢谢！',
  },

  'sms - renewed notice': {
    [ENGLISH]: 'The book, {{itemTitle}}, has been successfully renewed. The due date for the return has been extended to: {{dueAt}}. Enjoy!',
    [TRADITIONAL]: '《{{itemTitle}}》已經被您成功續借。其歸還日期延後至: {{dueAt}}。謝謝！',
    [SIMPLIFIED]: '《{{itemTitle}}》已经被您成功续借。其归还日期延后至: {{dueAt}}。 谢谢！',
  },

  'sms - due reminder': {
    [ENGLISH]: 'Hi {{borrowerName}}, {{dueDateReminderStr}}. Please remember to return it. We appreciate your cooperation!',
    [TRADITIONAL]: '{{borrowerName}}您好，{{dueDateReminderStr}}。請按時歸回，感謝合作！',
    [SIMPLIFIED]: '{{borrowerName}}您好，{{dueDateReminderStr}}。请按时归还，感谢合作！',
  },

  'sms - overdue reminder': {
    [ENGLISH]: 'Hi {{borrowerName}}, the due date of the book, {{itemTitle}}, you borrowed has passed. Please remember to return it. We appreciate your cooperation!',
    [TRADITIONAL]: '{{borrowerName}}您好，您借的書《{{itemTitle}}》已經逾期。請趕緊歸回，感謝合作！',
    [SIMPLIFIED]: '{{borrowerName}}您好，您借的书《{{itemTitle}}》已经逾期。请赶紧归还，感谢合作！',
  },
}


// An example for the parameter "replacements": [['{{itemTitle}}', 'Bible'], ['{{days}}', '3']]
export function getTextInSelectedLanguage(textInEnglish: string, selectedLanguage: string, replacements?: string[][]) {
  let textInSelectedLanguage = (
    TEXT_IN_MULTIPLE_LANGUAGES[textInEnglish]?.[selectedLanguage] ||
    TEXT_IN_MULTIPLE_LANGUAGES[textInEnglish]?.[ENGLISH] ||
    textInEnglish
  )

  if (replacements) {
    replacements.forEach((oneReplacement) => {
      textInSelectedLanguage = textInSelectedLanguage.replace(
        (new RegExp(oneReplacement?.[0] || '', 'g')),
        (oneReplacement?.[1] || '')
      )
    })
  }

  return textInSelectedLanguage
}

// get text that is fetched from database in the selected language
export function getDbTextInSelectedLanguage(textFromDatabase: string, selectedLanguage: string) {
  switch (selectedLanguage) {
    case TRADITIONAL:
      return chineseSimplifiedToTraditionalConverter(textFromDatabase || '')
    case SIMPLIFIED:
      return chineseConverter(textFromDatabase || '')
    default:
      return textFromDatabase
  }
}