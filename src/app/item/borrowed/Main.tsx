'use client'

import { IItem, IItemCategory, IItemCategoryMap } from 'src/types'
import ItemList from '../ItemList'

interface IProps {
  allItems: IItem[]
  itemCategories: IItemCategory[]
  itemCategoryMap: IItemCategoryMap
}

function Main({ allItems, itemCategories, itemCategoryMap }: IProps) {
  const handleItemUpdated = () => {
    window.location.reload()
  }

  return (
    <div style={{ padding: '5px 20px 60px 20px' }}>
      <h1 style={{ paddingBottom: '20px' }}>All Borrowed Books</h1>
      <ItemList
        allItems={allItems}
        itemCategories={itemCategories}
        itemCategoryMap={itemCategoryMap}
        visibleFields={[
          'edit',
          'title',
          'libraryNumber',
          'borrowedAt',
          'dueAt',
          'hasRenewed',
          'overdueDays',
          'borrowerName',
          'borrowerPhoneNumber',
        ]}
        onItemUpdated={handleItemUpdated}
        isNewBookAddingEnabled={false}
      />
    </div>
  )
}

export default Main
