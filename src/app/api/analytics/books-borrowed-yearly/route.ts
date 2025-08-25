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
        TO_CHAR(bbh.borrowed_at, 'YYYY') AS year,
        COUNT(bbh.id) AS num_of_book_borrowed
      FROM book_borrow_history AS bbh
      WHERE bbh.borrowed_at > (NOW() - INTERVAL '10 Years')
      GROUP BY year
      ORDER BY year DESC;
    `,
    {
      type: db.QueryTypes.SELECT,
    }
  )

  return NextResponse.json(result)
}