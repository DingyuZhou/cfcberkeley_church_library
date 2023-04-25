import { IItem, IItemCategoryMap } from 'src/types'

export default function formatItemDataFromDb(rawItemData: any, itemCategoryMap: IItemCategoryMap) {
  if (rawItemData) {
    const itemCategoryId = rawItemData.itemCategoryId || rawItemData['item_category_id'] || ''

    const formattedItemData: IItem = {
      itemCategoryId,
      itemId: rawItemData.id,
      uuid: rawItemData.uuid,
      title: rawItemData.title || '',
      category: itemCategoryMap[itemCategoryId]?.name || '',
      libraryNumber: rawItemData.libraryNumber || rawItemData['library_number'] || '',
      author: rawItemData.author || '',
      translator: rawItemData.translator || '',
      publisher: rawItemData.publisher || '',
      itemTypeId: rawItemData.itemTypeId || rawItemData['item_type_id'] || '',
      url: rawItemData.url || '',
      releasedAt: rawItemData.releasedAt || rawItemData['released_at'] || '',
      note: rawItemData.note || '',
      details: rawItemData.details,
    }

    return formattedItemData
  }

  return undefined
}
