import bookReturnReminder from './bookReturnReminder'
import overdueReminder from './overdueReminder'
import sendTextMessage from 'src/util/sms'

exports.handler = async function (event: any /*, context: any */) {
  console.log('--- event: ', event)

  const errorMessages: string[] = []

  try {
    let errorMessage = await bookReturnReminder(5)
    if (errorMessage) {
      errorMessages.push(errorMessage)
    }

    errorMessage = await bookReturnReminder(1)
    if (errorMessage) {
      errorMessages.push(errorMessage)
    }

    errorMessage = await bookReturnReminder(0)
    if (errorMessage) {
      errorMessages.push(errorMessage)
    }

    errorMessage = await overdueReminder()
    if (errorMessage) {
      errorMessages.push(errorMessage)
    }
  } catch (error: any) {
    console.log(error)
    errorMessages.push(error.message)
  }

  if (errorMessages.length > 0) {
    await sendTextMessage(
      process.env.WEB_ENGINEER_PHONE_NUMBER || '',
      `CFCBerkeley Library Reminder Errors: ${errorMessages.join(' | ')}
      `
    )
  }

  console.log('--- All Done! ---')
}
