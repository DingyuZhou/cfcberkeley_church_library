import { getDb } from 'src/db/models'
import sendTextMessage from 'src/util/sms'
import { getTextInSelectedLanguage, getDbTextInSelectedLanguage } from 'src/constants/language'

async function overdueReminder() {
  const { db } = getDb()
  let errorMessages: string[] = []

  const overdues = await db.query(
    `
      SELECT
        i.title,
        i.due_at,
        bb.first_name,
        bb.phone_number,
        bb.preferred_language
      FROM item AS i
      JOIN book_borrower AS bb ON i.borrower_id = bb.id
      WHERE i.due_at >= NOW() - INTERVAL '3 DAYS'
        AND i.due_at < NOW();
    `,
    {
      type: db.QueryTypes.SELECT,
    },
  )

  if (overdues?.length) {
    const reminderCount = overdues.length
    for (let ri = 0; ri < reminderCount; ++ri) {
      const reminder = overdues[ri]

      console.log('--- Process the reminder: ', reminder)

      if (reminder && reminder['phone_number']) {
        const preferredLanguage = reminder['preferred_language'] || ''
        const bookTitle = getDbTextInSelectedLanguage(reminder['title'], preferredLanguage)

        try {
          await sendTextMessage(
            reminder['phone_number'],
            getTextInSelectedLanguage('sms - overdue reminder', preferredLanguage, [['{{borrowerName}}', reminder['first_name']], ['{{itemTitle}}', bookTitle]])
          )
        } catch (error: any) {
          console.log(error)
          errorMessages.push(error.message)
          // do not stop
        }
      }
    }
  }

  if (errorMessages.length > 0) {
    return errorMessages.join(' | ')
  }

  return ''
}

export default overdueReminder
