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
        TO_CHAR(bb.created_at, 'YYYY') AS year,
        COUNT(DISTINCT bb.phone_number) AS num_of_borrower_registered
      FROM book_borrower AS bb
      WHERE bb.created_at > (NOW() - INTERVAL '10 Years')
      GROUP BY year
      ORDER BY year
    `,
    {
      type: db.QueryTypes.SELECT,
    }
  )

  return NextResponse.json(result)
}