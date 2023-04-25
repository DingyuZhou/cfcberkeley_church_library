import { NextRequest, NextResponse } from 'next/server';

import { getDb } from 'src/db/models'

export async function POST(request: NextRequest) {
  const { itemId, itemUuid } = await request.json()

  const { db } = getDb()
  const updateResponse = await db.query(
    `
      UPDATE item SET uuid = :itemUuid WHERE id = :itemId RETURNING *;
    `,
    {
      replacements: {
        itemId,
        itemUuid,
      },
      type: db.QueryTypes.SELECT,
    },
  )

  return NextResponse.json(updateResponse?.[0])
}
