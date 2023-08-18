import { NextRequest, NextResponse } from 'next/server'

import { getDb } from 'src/db/models'
import chineseConverter from 'src/util/chineseConverter'
import isAdmin from 'src/util/member/isAdmin'

const itemUpdateSql = `
  INSERT INTO item (id, uuid, item_type_id, item_category_id, title, author, translator, publisher, library_number, note, status)
  VALUES (:id, :uuid, :itemTypeId, :itemCategoryId, :title, :author, :translator, :publisher, :libraryNumber, :note, :status)
  ON CONFLICT (id) DO UPDATE
  SET uuid = EXCLUDED.uuid,
    item_type_id = EXCLUDED.item_type_id,
    item_category_id= EXCLUDED.item_category_id,
    title = EXCLUDED.title,
    author = EXCLUDED.author,
    translator = EXCLUDED.translator,
    publisher = EXCLUDED.publisher,
    library_number = EXCLUDED.library_number,
    note = EXCLUDED.note,
    status = EXCLUDED.status
  RETURNING *;
`

const itemCreateSql = `
  INSERT INTO item (uuid, item_type_id, item_category_id, title, author, translator, publisher, library_number, note, status)
  VALUES (:uuid, :itemTypeId, :itemCategoryId, :title, :author, :translator, :publisher, :libraryNumber, :note, :status)
  RETURNING *;
`

export async function POST(request: NextRequest) {
  const hasAdminPrivilege = await isAdmin(request.cookies)

  if (hasAdminPrivilege) {
    const { item } = await request.json()

    const { db } = getDb()
    const editResponse = await db.query(
      item?.id ? itemUpdateSql : itemCreateSql,
      {
        replacements: {
          id: item?.id || null,
          uuid: item?.uuid,
          itemTypeId: item?.itemTypeId || null,
          itemCategoryId: item?.itemCategoryId || null,
          title: chineseConverter(item?.title || '').trim(),
          author: chineseConverter(item?.author || '').trim(),
          translator: chineseConverter(item?.translator || '').trim(),
          publisher: chineseConverter(item?.publisher || '').trim(),
          libraryNumber: chineseConverter(item?.libraryNumber || '').trim(),
          note: chineseConverter(item?.note || '').trim(),
          status: item?.status,
        },
        type: db.QueryTypes.SELECT,
      },
    )

    return NextResponse.json(editResponse?.[0])
  }

  return new NextResponse(
    JSON.stringify({ 'error': { message: 'Permission denied' } }),
    { status: 401 }
  )
}
