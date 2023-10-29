import { NextRequest, NextResponse } from 'next/server'

import { getDb } from 'src/db/models'

export async function POST(request: NextRequest) {
  const { itemId } = await request.json()

  const { models } = getDb()
  const itemResponse = await models.Item.findOne({ where: { id: itemId } })

  return NextResponse.json({
    itemResponse
  })
}
