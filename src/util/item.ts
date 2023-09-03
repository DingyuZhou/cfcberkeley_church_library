import moment from 'moment'

import { RENEW_BUTTON_DELAY_DAYS } from 'src/constants'

export function getPhoneNumberDisplayString(phoneNumberFromDb: string): string {
  // Remove any non-numeric characters from the input string
  const numericOnly = phoneNumberFromDb.replace(/\D/g, '')

  // Check if the numericOnly string has 10 digits, which is the expected format for a US phone number
  if (numericOnly.length === 11) {
    // Use string interpolation to format the phone number
    return `(${numericOnly.slice(1, 4)}) ${numericOnly.slice(4, 7)}-${numericOnly.slice(7)}`
  } else {
    // If the input doesn't have 10 digits, return it as is (unformatted)
    return phoneNumberFromDb
  }
}

export function getOverdueDays(dueAt: string) {
  if (dueAt) {
    // Parse the input due date string using Moment.js
    const dueDate = moment(dueAt)

    // Get the current date
    const currentDate = moment()

    // Calculate the difference in days
    const overdueDays = currentDate.diff(dueDate, 'days')

    // Ensure the result is a positive number (if the due date is in the future, it will be negative)
    return Math.max(0, overdueDays)
  }

  return 0
}

export function getIsEligibleToRenew(borrowedAt: string) {
  if (borrowedAt) {
    const borrowedDate = moment(borrowedAt)
    const currentDate = moment()
    const daysBetween = currentDate.diff(borrowedDate, 'days')
    if (daysBetween > RENEW_BUTTON_DELAY_DAYS) {
      return true
    }
  }
  return false
}
