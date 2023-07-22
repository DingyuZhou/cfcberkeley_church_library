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
        GREATEST(LENGTH((i.title || ' ' || i.author || ' ' || i.publisher )), LENGTH(:searchText)) - levenshtein((i.title || ' ' || i.author || ' ' || i.publisher ), :searchText) AS rank2,
        similarity(:searchText, (i.title || ' ' || i.author || ' ' || i.publisher )) AS rank3,
        i.*
      FROM item AS i
      JOIN item_type AS it ON i.item_type_id = it.id
      WHERE it.name = 'Book'
        AND (
          (i.title || ' ' || i.author || ' ' || i.publisher ) % :searchText
          OR GREATEST(LENGTH((i.title || ' ' || i.author || ' ' || i.publisher )), LENGTH(:searchText)) - levenshtein((i.title || ' ' || i.author || ' ' || i.publisher ), :searchText) > 0
          OR i.library_number LIKE (:searchText::TEXT || '%')
        )
      ORDER BY rank1 DESC, rank2 DESC, rank3 DESC, i.id
      LIMIT 100;
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
