import { getDb } from 'src/db/models'
import sendTextMessage from 'src/util/sms'

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
        bb.phone_number
      FROM item AS i
      JOIN book_borrower AS bb ON i.borrower_id = bb.id
      WHERE i.due_at > NOW() - ((:daysBeforeDueDate + 1) || ' DAYS')::INTERVAL
        AND i.due_at <= NOW() - (:daysBeforeDueDate || ' DAYS')::INTERVAL;
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

      console.log('--- Process the reminder: ', reminder)

      let dueDateReminderStr = ''
      if (daysBeforeDueDate === 0) {
        dueDateReminderStr = `the book, ${reminder['title']}, you borrowed is due today`
      } else if (daysBeforeDueDate === 1) {
        dueDateReminderStr = `the book, ${reminder['title']}, you borrowed is due tomorrow`
      } else {
        dueDateReminderStr = `the due date of the book, ${reminder['title']}, you borrowed is approaching in just ${daysBeforeDueDate} days`
      }

      if (reminder && reminder['phone_number']) {
        try {
          await sendTextMessage(
            reminder['phone_number'],
            `Hi ${reminder['first_name']}, ${dueDateReminderStr}. Please remember to return it. We appreciate your cooperation!`
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
