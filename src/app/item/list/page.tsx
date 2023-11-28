import { cookies } from 'next/headers'

import { getDb } from 'src/db/models'
import { IItem } from 'src/types'
import isAdmin from 'src/util/member/isAdmin'

import formatItemDataFromDb from '../formatItemDataFromDb'
import getItemCategories from '../getItemCategories'
import ItemList from '../ItemList'

async function ItemListPage() {
  const appCookies = cookies()
  const { db, models } = getDb()

  const [
    hasAdminPrivilege,
    allItemsResponse,
    itemCategoryInfo,
    bookCountResponse,
  ] = await Promise.all([
    isAdmin(appCookies),
    models.Item.findAll({
      order: [
        ['itemCategoryId', 'ASC'],
        ['libraryNumber', 'ASC'],
        ['title', 'ASC'],
        ['author', 'ASC'],
        ['id', 'ASC'],
      ],
    }),
    getItemCategories(),
    db.query(
      `
        SELECT
          i.status::TEXT AS status,
          COUNT(i.id)::INTEGER AS book_count
        FROM item AS i
        JOIN item_type AS it ON i.item_type_id = it.id
        WHERE it.name = 'Book'
        GROUP BY i.status
        ORDER BY i.status;
      `,
      {
        type: db.QueryTypes.SELECT,
      },
    )
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

  if (hasAdminPrivilege) {
    const tdStyle = {
      border: '1px solid gray',
      padding: '5px 10px',
    }

    return (
      <div style={{ padding: '5px 20px 60px 20px' }}>
        <h1 style={{ paddingBottom: '20px' }}>All Books</h1>

        <table style={{
          margin: '0 0 40px 0',
          tableLayout: 'fixed',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'left',
          border: '2px solid gray',
          borderCollapse: 'collapse',
        }}>
          <thead>
            <tr>
              <th style={tdStyle}>BOOK STATUS</th>
              <th style={tdStyle}>BOOK COUNT</th>
            </tr>
          </thead>

          <tbody>
            {
              bookCountResponse.map((rawData: any) => {
                return (
                  <tr key={rawData['status']}>
                    <td style={tdStyle}>{rawData['status']}</td>
                    <td style={tdStyle}>{rawData['book_count']}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

        <ItemList
          allItems={allItems}
          itemCategories={itemCategoryInfo.itemCategories}
          itemCategoryMap={itemCategoryInfo.itemCategoryMap}
          visibleFields={[
            'edit',
            'title',
            'author',
            'publisher',
            'category',
            'categorySection',
            'libraryNumber',
            'status',
          ]}
          isNewBookAddingEnabled={true}
        />
      </div>
    )
  }

  return null
}

export default ItemListPage
