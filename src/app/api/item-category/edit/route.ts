import { NextRequest, NextResponse } from 'next/server'

import { getDb } from 'src/db/models'
import chineseConverter from 'src/util/chineseConverter'
import isAdmin from 'src/util/member/isAdmin'

const itemCategoryUpdateSql = `
  INSERT INTO item_category (id, item_type_id, name, library_number, section, location)
  VALUES (:id, :itemTypeId, :name, :libraryNumber, :section, :location)
  ON CONFLICT (id) DO UPDATE
  SET item_type_id = EXCLUDED.item_type_id,
    name= EXCLUDED.name,
    library_number = EXCLUDED.library_number,
    section = EXCLUDED.section,
    location = EXCLUDED.location
  RETURNING *;
`

const itemCategoryCreateSql = `
  INSERT INTO item_category (item_type_id, name, library_number, section, location)
  VALUES (:itemTypeId, :name, :libraryNumber, :section, :location)
  RETURNING *;
`

export async function POST(request: NextRequest) {
  const hasAdminPrivilege = await isAdmin(request.cookies)

  if (hasAdminPrivilege) {
    const { itemCategory } = await request.json()

    const { db } = getDb()
    const editResponse = await db.query(
      itemCategory?.id ? itemCategoryUpdateSql : itemCategoryCreateSql,
      {
        replacements: {
          id: itemCategory?.id || null,
          itemTypeId: itemCategory?.itemTypeId || null,
          name: chineseConverter(itemCategory?.name || '').trim(),
          libraryNumber: chineseConverter(itemCategory?.libraryNumber || '').trim(),
          section: chineseConverter(itemCategory?.section || '').trim(),
          location: chineseConverter(itemCategory?.location || '').trim(),
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
