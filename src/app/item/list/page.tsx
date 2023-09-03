import { cookies } from 'next/headers'

import { getDb } from 'src/db/models'
import { IItem } from 'src/types'
import isAdmin from 'src/util/member/isAdmin'

import formatItemDataFromDb from '../formatItemDataFromDb'
import getItemCategories from '../getItemCategories'
import ItemList from '../ItemList'

async function ItemListPage() {
  const appCookies = cookies()
  const { models } = getDb()

  const [hasAdminPrivilege, allItemsResponse, itemCategoryInfo] = await Promise.all([
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
    return (
      <div style={{ padding: '5px 20px 60px 20px' }}>
        <h1 style={{ paddingBottom: '20px' }}>All Books</h1>
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
