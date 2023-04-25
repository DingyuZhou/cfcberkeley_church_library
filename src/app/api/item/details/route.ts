import { NextRequest, NextResponse } from 'next/server'

import { getDb } from 'src/db/models'

export async function POST(request: NextRequest) {
  const { uuid } = await request.json()

  const { models } = getDb()
  const item = await models.Item.findOne({ where: { uuid } })

  return NextResponse.json({
    title: item.title,
  })
}
