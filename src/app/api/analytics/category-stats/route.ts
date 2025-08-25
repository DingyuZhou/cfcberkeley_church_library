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
        ic.section AS book_category,
        COUNT(bbh.id) AS num_book_borrowed_in_category
      FROM book_borrow_history AS bbh
      JOIN item AS i ON bbh.item_id = i.id
      JOIN item_category AS ic ON i.item_category_id = ic.id
      WHERE bbh.borrowed_at > (NOW() - INTERVAL '10 Years')
      GROUP BY ic.section
      ORDER BY num_book_borrowed_in_category DESC
    `,
    {
      type: db.QueryTypes.SELECT,
    }
  )

  return NextResponse.json(result)
}