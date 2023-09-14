export function formatPhoneNumberWhileTyping(existedPhoneNumberStr: string, newInput: string) {
  // Remove all non-digit characters from the input
  let digitsOnly = newInput.replace(/\D/g, '')

  if (
    existedPhoneNumberStr.length > newInput.length
    && existedPhoneNumberStr.indexOf(newInput) === 0
    && digitsOnly === existedPhoneNumberStr.replace(/\D/g, '')
  ) {
    digitsOnly = digitsOnly.slice(0, -1)
  }

  // Format the phone number
  let formattedNumber = ''

  if (digitsOnly.length >= 1) {
    formattedNumber += `(${digitsOnly.slice(0, 3)}`
  }

  if (digitsOnly.length >= 3) {
    formattedNumber += `) ${digitsOnly.slice(3, 6)}`
  }
  if (digitsOnly.length >= 6) {
    formattedNumber += `-${digitsOnly.slice(6, 10)}`
  }

  return formattedNumber
}