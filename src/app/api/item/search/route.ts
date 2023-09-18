import { NextRequest, NextResponse } from 'next/server'

import isAdmin from 'src/util/member/isAdmin'
import { getDb } from 'src/db/models'
import chineseConverter from 'src/util/chineseConverter'

export async function POST(request: NextRequest) {
  const hasAdminPrivilege = await isAdmin(request.cookies)
  const { searchText, itemTypeId, categorySection } = await request.json()

  const { db } = getDb()
  let searchResponse = null

  if (hasAdminPrivilege) {
    searchResponse = await db.query(
      `
        WITH
          search_results AS (
            SELECT
              GREATEST(LENGTH((i.title || ' ' || i.author || ' ' || i.publisher )), LENGTH(:searchText)) - levenshtein((i.title || ' ' || i.author || ' ' || i.publisher ), :searchText) AS rank1,
              similarity(:searchText, (i.title || ' ' || i.author || ' ' || i.publisher )) AS rank2,
              i.*
            FROM item AS i
            JOIN item_category AS ic ON i.item_category_id = ic.id
            WHERE (ic.item_type_id = :itemTypeId OR :itemTypeId = 0)
              AND (ic.section = :categorySection OR :categorySection = 'All')
              AND (
                :searchText = ''
                OR (i.title || ' ' || i.author || ' ' || i.publisher ) % :searchText
                OR GREATEST(LENGTH((i.title || ' ' || i.author || ' ' || i.publisher )), LENGTH(:searchText)) - levenshtein((i.title || ' ' || i.author || ' ' || i.publisher ), :searchText) > 0.2
              )
          )

        SELECT
          sr.item_category_id, sr.title, sr.publisher, sr.author, sr.translator,
          jsonb_agg(jsonb_build_object('id', sr.id, 'uuid', sr.uuid, 'status', sr.status, 'libraryNumber', sr.library_number)) AS all_items,
          MAX(rank1) AS max_rank1,
          MAX(rank2) AS max_rank2,
          MAX(sr.library_number) AS book_library_number
        FROM search_results AS sr
        GROUP BY sr.id, sr.item_category_id, sr.title, sr.publisher, sr.author, sr.translator
        ORDER BY max_rank1 DESC, max_rank2 DESC, sr.title, book_library_number, sr.id;
      `,
      {
        replacements: {
          itemTypeId,
          categorySection,
          searchText: chineseConverter(searchText || ''),
        },
        type: db.QueryTypes.SELECT,
      },
    )
  } else {
    searchResponse = await db.query(
      `
        WITH
          search_results AS (
            SELECT
              GREATEST(LENGTH((i.title || ' ' || i.author || ' ' || i.publisher )), LENGTH(:searchText)) - levenshtein((i.title || ' ' || i.author || ' ' || i.publisher ), :searchText) AS rank1,
              similarity(:searchText, (i.title || ' ' || i.author || ' ' || i.publisher )) AS rank2,
              i.*
            FROM item AS i
            JOIN item_category AS ic ON i.item_category_id = ic.id
            WHERE i.status IN ('AVAILABLE', 'BORROWED')
              AND (ic.item_type_id = :itemTypeId OR :itemTypeId = 0)
              AND (ic.section = :categorySection OR :categorySection = 'All')
              AND i.uuid NOT LIKE 'temp-%'
              AND (
                :searchText = ''
                OR (i.title || ' ' || i.author || ' ' || i.publisher ) % :searchText
                OR GREATEST(LENGTH((i.title || ' ' || i.author || ' ' || i.publisher )), LENGTH(:searchText)) - levenshtein((i.title || ' ' || i.author || ' ' || i.publisher ), :searchText) > 0.2
              )
          )

        SELECT
          sr.item_category_id, sr.title, sr.publisher, sr.author, sr.translator,
          jsonb_agg(jsonb_build_object('id', sr.id, 'uuid', sr.uuid, 'status', sr.status, 'libraryNumber', sr.library_number)) AS all_items,
          MAX(rank1) AS max_rank1,
          MAX(rank2) AS max_rank2
        FROM search_results AS sr
        GROUP BY sr.item_category_id, sr.title, sr.publisher, sr.author, sr.translator
        ORDER BY max_rank1 DESC, max_rank2 DESC, sr.title;
      `,
      {
        replacements: {
          itemTypeId,
          categorySection,
          searchText: chineseConverter(searchText || ''),
        },
        type: db.QueryTypes.SELECT,
      },
    )
  }

  const items: any[] = []

  if (searchResponse) {
    searchResponse.forEach((rawItemData: any) => {
      if (rawItemData) {
        items.push({ ...rawItemData})
      }
    })
  }

  return NextResponse.json(items)
}
