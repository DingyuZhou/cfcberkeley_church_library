import { getDb } from 'src/db/models'
import sendTextMessage from 'src/util/sms'

async function overdueReminder() {
  const { db } = getDb()
  let errorMessages: string[] = []

  const overdues = await db.query(
    `
      SELECT
        i.title,
        i.due_at,
        bb.first_name,
        bb.phone_number
      FROM item AS i
      JOIN book_borrower AS bb ON i.borrower_id = bb.id
      WHERE i.due_at < NOW()
        AND i.due_at >= NOW() - INTERVAL '3 DAYS';
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
        try {
          await sendTextMessage(
            reminder['phone_number'],
            `Hi ${reminder['first_name']}, the due date of the book, ${reminder['title']}, you borrowed has passed. Please remember to return it. We appreciate your cooperation!`
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
