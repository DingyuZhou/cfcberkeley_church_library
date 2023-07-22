import { NextRequest, NextResponse } from 'next/server'

import { getDb } from 'src/db/models'
import chineseConverter from 'src/util/chineseConverter'

export async function POST(request: NextRequest) {
  const { searchText, searchItemType } = await request.json()

  const { db } = getDb()
  const searchResponse = await db.query(
    `
      WITH
        search_results AS (
          SELECT
            GREATEST(LENGTH((i.title || ' ' || i.author || ' ' || i.publisher )), LENGTH(:searchText)) - levenshtein((i.title || ' ' || i.author || ' ' || i.publisher ), :searchText) AS rank1,
            similarity(:searchText, (i.title || ' ' || i.author || ' ' || i.publisher )) AS rank2,
            it.name AS item_type,
            ic.name AS item_category,
            i.*
          FROM item AS i
          JOIN item_type AS it ON i.item_type_id = it.id
          JOIN item_category AS ic ON i.item_category_id = ic.id
          WHERE i.status != 'UNAVAILABLE'
            AND (it.name = :itemType OR :itemType = 'All')
            AND (
              (i.title || ' ' || i.author || ' ' || i.publisher ) % :searchText
              OR GREATEST(LENGTH((i.title || ' ' || i.author || ' ' || i.publisher )), LENGTH(:searchText)) - levenshtein((i.title || ' ' || i.author || ' ' || i.publisher ), :searchText) > 0
            )
        )

      SELECT
        sr.item_type, sr.item_category, sr.title, sr.publisher, sr.author, sr.translator, sr.library_number,
        jsonb_agg(jsonb_build_object('id', sr.id, 'uuid', sr.uuid, 'status', sr.status)) AS all_items,
        MAX(rank1) AS max_rank1,
        MAX(rank2) AS max_rank2
      FROM search_results AS sr
      GROUP BY sr.item_type, sr.item_category, sr.title, sr.publisher, sr.author, sr.translator, sr.library_number
      ORDER BY max_rank1 DESC, max_rank2 DESC, sr.title, sr.item_type
      LIMIT 50;
    `,
    {
      replacements: {
        itemType: searchItemType,
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
