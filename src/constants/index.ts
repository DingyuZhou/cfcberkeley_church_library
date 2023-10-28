export const WEB_URL = (process.env.NODE_ENV === 'production') ? 'https://library.cfcberkeley.church' : 'http://localhost:3000'

export function getBookQrcodeUrl(bookUuid: string) {
  return `${WEB_URL}/item/${bookUuid}`
}

export const DISPLAY_DATE_FORMAT = 'M/D/YYYY'

export const SUGGESTED_MAX_NUM_BOOKS_CONCURRENTLY_BORROWED = 5
export const RENEW_BUTTON_DELAY_DAYS = 20

export const ITEM_TYPE_ID = {
  ALL: '0',
  BOOK: '1',
}

export const DEFAULT_CATEGORY_ID = '1'

export const UNEXPECTED_INTERNAL_ERROR =  'Unexpected internal error. Please try it again later'

export const BOOK_STATUS_AVAILABLE = 'AVAILABLE'
export const BOOK_STATUS_BORROWED = 'BORROWED'
export const BOOK_STATUS_DELETED = 'DELETED'
export const BOOK_STATUS_MISSING = 'MISSING'

