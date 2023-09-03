import { cookies } from 'next/headers'

import { getDb } from 'src/db/models'
import { IItem } from 'src/types'
import isAdmin from 'src/util/member/isAdmin'

import formatItemDataFromDb from '../formatItemDataFromDb'
import getItemCategories from '../getItemCategories'
import ItemList from '../ItemList'
import Main from './Main'

async function BorrowedItemListPage() {
  const appCookies = cookies()
  const { db } = getDb()

  const hasAdminPrivilege = await isAdmin(appCookies)

  if (hasAdminPrivilege) {
    const [allItemsResponse, itemCategoryInfo] = await Promise.all([
      db.query(
        `
          SELECT
            i.*,
            bb.first_name || ' ' || bb.last_name AS borrower_name,
            bb.phone_number AS borrower_phone_number
          FROM item AS i
          LEFT JOIN book_borrower AS bb ON i.borrower_id = bb.id
          WHERE (
            i.borrowed_at IS NOT NULL
            OR i.status = 'BORROWED'
          )
          ORDER BY i.borrowed_at NULLS FIRST, borrower_name;
        `,
        {
          type: db.QueryTypes.SELECT,
        },
      ),
      getItemCategories(),
    ])

    const allItems: IItem[] = []
    if (Array.isArray(allItemsResponse)) {
      allItemsResponse.forEach((rawItemData) => {
        const formattedItemData = formatItemDataFromDb(rawItemData, itemCategoryInfo.itemCategoryMap)
        if (formattedItemData) {
          allItems.push(formattedItemData)
        }
      })
    }

    return (
      <Main
        allItems={allItems}
        itemCategories={itemCategoryInfo.itemCategories}
        itemCategoryMap={itemCategoryInfo.itemCategoryMap}
      />
    )
  }

  return null
}

export default BorrowedItemListPage
