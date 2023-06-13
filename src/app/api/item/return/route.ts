import { NextRequest, NextResponse } from 'next/server';

import { getDb } from 'src/db/models'

export async function POST(request: NextRequest) {
  const { itemId } = await request.json()

  const { db } = getDb()
  const returnResponse = await db.query(
    `
      SELECT * FROM return_book(:itemId);
    `,
    {
      type: db.QueryTypes.SELECT,
      replacements: {
        itemId,
      },
    },
  )

  const responseData = returnResponse?.[0]

  return NextResponse.json({
    isSuccess: responseData?.['status'] === 'SUCCESS',
    errorMessage: responseData?.['error_message'] || '',
  })
}
