import moment from 'moment'

import { DISPLAY_DATE_FORMAT } from 'src/constants'

export function getDateDisplayString(dateFromDb: string) {
  if (dateFromDb) {
    const date = moment(dateFromDb)

    if (date.isValid()) {
      return date.format(DISPLAY_DATE_FORMAT)
    }
  }

  return ''
}