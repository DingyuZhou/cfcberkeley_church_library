import { getDb } from 'src/db/models'
import sendTextMessage from 'src/util/sms'
import { getTextInSelectedLanguage, getDbTextInSelectedLanguage } from 'src/constants/language'

async function bookReturnReminder(daysBeforeDueDate: number) {
  if (daysBeforeDueDate < 0) {
    throw new Error('Negative "daysBeforeDueDate" is not supported')
  }

  const { db } = getDb()
  let errorMessages: string[] = []

  const remindersNeeded = await db.query(
    `
      SELECT
        i.title,
        i.due_at,
        bb.first_name,
        bb.phone_number,
        bb.preferred_language
      FROM item AS i
      JOIN book_borrower AS bb ON i.borrower_id = bb.id
      WHERE i.due_at >= NOW() + (:daysBeforeDueDate || ' DAYS')::INTERVAL
        AND i.due_at < NOW() + ((:daysBeforeDueDate + 1) || ' DAYS')::INTERVAL;
    `,
    {
      type: db.QueryTypes.SELECT,
      replacements: {
        daysBeforeDueDate,
      },
    },
  )

  if (remindersNeeded?.length) {
    const reminderCount = remindersNeeded.length
    for (let ri = 0; ri < reminderCount; ++ri) {
      const reminder = remindersNeeded[ri]
      const preferredLanguage = reminder['preferred_language'] || ''
      const bookTitle = getDbTextInSelectedLanguage(reminder['title'], preferredLanguage)

      console.log('--- Process the reminder: ', reminder)

      let dueDateReminderStr = ''
      if (daysBeforeDueDate === 0) {
        dueDateReminderStr = getTextInSelectedLanguage('due today', preferredLanguage, [['{{bookTitle}}', bookTitle]])
      } else if (daysBeforeDueDate === 1) {
        dueDateReminderStr = getTextInSelectedLanguage('due tomorrow', preferredLanguage, [['{{bookTitle}}', bookTitle]])
      } else {
        dueDateReminderStr = getTextInSelectedLanguage('x days to due', preferredLanguage, [['{{bookTitle}}', bookTitle], ['{{days}}', daysBeforeDueDate.toString()]])
      }

      if (reminder && reminder['phone_number']) {
        try {
          await sendTextMessage(
            reminder['phone_number'],
            getTextInSelectedLanguage('sms - due reminder', preferredLanguage, [['{{borrowerName}}', reminder['first_name']], ['{{dueDateReminderStr}}', dueDateReminderStr]])
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

export default bookReturnReminder
