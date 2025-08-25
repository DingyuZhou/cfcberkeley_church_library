import { NextRequest, NextResponse } from 'next/server'
import { getDb } from 'src/db/models'
import isAdmin from 'src/util/member/isAdmin'

export async function GET(request: NextRequest) {
  const hasAdminPrivilege = await isAdmin(request.cookies)

  if (!hasAdminPrivilege) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { db } = getDb()

  const result = await db.query(
    `
      SELECT
        (bbh.borrowed_at AT TIME ZONE 'America/Los_Angeles')::DATE AS borrow_date,
        i.title AS book,
        ic.section AS book_category
      FROM book_borrow_history AS bbh
      JOIN item AS i ON bbh.item_id = i.id
      JOIN item_category AS ic ON i.item_category_id = ic.id
      WHERE bbh.borrowed_at > (NOW() - INTERVAL '10 Years')
      ORDER BY bbh.borrowed_at DESC
    `,
    {
      type: db.QueryTypes.SELECT,
    }
  )

  return NextResponse.json(result)
}