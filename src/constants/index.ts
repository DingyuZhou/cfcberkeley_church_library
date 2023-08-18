export const WEB_URL = (process.env.NODE_ENV === 'production') ? 'https://library.cfcberkeley.church' : 'http://localhost:3000'

export function getBookQrcodeUrl(bookUuid: string) {
  return `${WEB_URL}/item/${bookUuid}`
}

export const ITEM_TYPE_ID = {
  BOOK: '1',
}

export const UNCATEGORIZED_CATEGORY_ID = '-1'

export const UNEXPECTED_INTERNAL_ERROR =  'Unexpected internal error. Please try it again later'

export const BOOK_STATUS_AVAILABLE = 'AVAILABLE'
export const BOOK_STATUS_LENT = 'LENT'
export const BOOK_STATUS_DELETED = 'DELETED'
export const BOOK_STATUS_MISSING = 'MISSING'
