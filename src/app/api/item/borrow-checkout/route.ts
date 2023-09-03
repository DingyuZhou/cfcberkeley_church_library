import { NextRequest, NextResponse } from 'next/server'
import moment from 'moment'

import { getDateDisplayString } from 'src/util/datetime'
import { getDb } from 'src/db/models'

export async function POST(request: NextRequest) {
  const { borrowerUuid, oneTimePassword, checkoutPasscode, itemId, isForRenew } = await request.json()

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

  return NextResponse.json({
    isSuccess: responseData?.['checkout_status'] === 'SUCCESS',
    errorMessage: responseData?.['error_message'] || '',
    itemId: responseData?.['item_id'],
    dueAt: getDateDisplayString(responseData?.['due_at']),
  })
}
