import { NextRequest, NextResponse } from 'next/server'

import sendTextMessage from 'src/util/sms'
import { getDateDisplayString } from 'src/util/datetime'
import { getDb } from 'src/db/models'
import { getTextInSelectedLanguage } from 'src/constants/language'

export async function POST(request: NextRequest) {
  const { borrowerUuid, oneTimePassword, checkoutPasscode, itemId, itemTitle, isForRenew, preferredLanguage } = await request.json()

  let sql = isForRenew
    ? 'SELECT * FROM renew_book(:borrowerUuid, :oneTimePassword, :checkoutPasscode, :itemId);'
    : 'SELECT * FROM book_borrow_checkout(:borrowerUuid, :oneTimePassword, :checkoutPasscode, :itemId);'

  const { db } = getDb()
  const registerResponse = await db.query(
    sql,
    {
      type: db.QueryTypes.SELECT,
      replacements: {
        borrowerUuid,
        oneTimePassword,
        checkoutPasscode,
        itemId,
      },
    },
  )

  const responseData = registerResponse?.[0]
  const isSuccess = responseData?.['checkout_status'] === 'SUCCESS'
  const dueAt = getDateDisplayString(responseData?.['due_at'])

  if (isSuccess) {
    const phoneNumber = responseData?.['phone_number']
    if (phoneNumber) {
      const textMessage = isForRenew ? getTextInSelectedLanguage(
        'sms - renewed notice',
        preferredLanguage,
        [['{{itemTitle}}', itemTitle], ['{{dueAt}}', dueAt]]
      ) : getTextInSelectedLanguage(
        'sms - borrowed notice',
        preferredLanguage,
        [['{{itemTitle}}', itemTitle], ['{{dueAt}}', dueAt]]
      )

      await sendTextMessage(phoneNumber, textMessage)
    }
  }

  return NextResponse.json({
    isSuccess,
    dueAt,
    errorMessage: responseData?.['error_message'] || '',
    itemId: responseData?.['item_id'],
  })
}
