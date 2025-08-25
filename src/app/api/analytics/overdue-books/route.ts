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
        bbh.borrowed_at::DATE AS borrow_date,
        (bb.first_name || ' ' || bb.last_name) AS borrower_name,
        bb.phone_number AS borrower_phone_number,
        i.title AS not_returned_book,
        ic.section AS book_category,
        i.library_number AS book_library_number
      FROM book_borrow_history AS bbh
      JOIN book_borrower AS bb ON bbh.borrower_id = bb.id
      JOIN item AS i ON bbh.item_id = i.id
      JOIN item_category AS ic ON i.item_category_id = ic.id
      WHERE (bbh.returned_at IS NULL AND bbh.borrowed_at < (NOW() - INTERVAL '30 DAYS'))
      ORDER BY bbh.borrowed_at DESC
    `,
    {
      type: db.QueryTypes.SELECT,
    }
  )

  return NextResponse.json(result)
}