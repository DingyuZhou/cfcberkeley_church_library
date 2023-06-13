import { NextRequest, NextResponse } from 'next/server';

import { getDb } from 'src/db/models'

export async function POST(request: NextRequest) {
  const { borrowerUuid, oneTimePassword, checkoutPasscode, itemId } = await request.json()

  const { db } = getDb()
  const registerResponse = await db.query(
    `
      SELECT * FROM book_borrow_checkout(:borrowerUuid, :oneTimePassword, :checkoutPasscode, :itemId);
    `,
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
  })
}
