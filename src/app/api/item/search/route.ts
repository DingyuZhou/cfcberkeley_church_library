import { NextRequest, NextResponse } from 'next/server'

import { getDb } from 'src/db/models'
import chineseConverter from 'src/util/chineseConverter'

export async function POST(request: NextRequest) {
  const { searchText } = await request.json()

  const { db } = getDb()
  const searchResponse = await db.query(
    `
      SELECT
        CASE
          WHEN i.library_number LIKE (:searchText::TEXT || '%') THEN similarity(:searchText, i.library_number)
          ELSE 0
        END AS rank1,
        GREATEST(LENGTH(i.title), LENGTH(:searchText)) - levenshtein(i.title, :searchText) AS rank2,
        similarity(:searchText, i.title) AS rank3,
        *
      FROM item AS i
      WHERE (
        i.title % :searchText
        OR GREATEST(LENGTH(i.title), LENGTH(:searchText)) - levenshtein(i.title, :searchText) > 0
        OR i.library_number LIKE (:searchText::TEXT || '%')
      )
      ORDER BY rank1 DESC, rank2 DESC, rank3 DESC, i.id;
    `,
    {
      replacements: {
        searchText: chineseConverter(searchText || ''),
      },
      type: db.QueryTypes.SELECT,
    },
  )

  const items: any[] = []

  searchResponse.forEach((rawItemData: any) => {
    if (rawItemData) {
      items.push({ ...rawItemData})
    }
  })

  return NextResponse.json(items)
}
