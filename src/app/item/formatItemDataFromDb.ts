import { IItem, IItemCategoryMap } from 'src/types'
import { BOOK_STATUS_AVAILABLE, BOOK_STATUS_LENT } from 'src/constants'

export const itemStatusMap: { [status: string]: string } = {
  [BOOK_STATUS_AVAILABLE]: 'Available',
  [BOOK_STATUS_LENT]: 'Borrowed',
}

export default function formatItemDataFromDb(rawItemData: any, itemCategoryMap?: IItemCategoryMap) {
  if (rawItemData) {
    const itemCategoryId = rawItemData.itemCategoryId || rawItemData['item_category_id'] || ''

    const formattedItemData: IItem = {
      itemCategoryId,
      itemType: rawItemData['item_type'] || '',
      itemId: rawItemData.id,
      uuid: rawItemData.uuid,
      title: rawItemData.title || '',
      category: itemCategoryMap?.[itemCategoryId]?.name || rawItemData['item_category'] || '',
      libraryNumber: rawItemData.libraryNumber || rawItemData['library_number'] || '',
      author: rawItemData.author || '',
      translator: rawItemData.translator || '',
      publisher: rawItemData.publisher || '',
      itemTypeId: rawItemData.itemTypeId || rawItemData['item_type_id'] || '',
      url: rawItemData.url || '',
      releasedAt: rawItemData.releasedAt || rawItemData['released_at'] || '',
      note: rawItemData.note || '',
      details: rawItemData.details,
      status: itemStatusMap[rawItemData.status] || 'Not Available',
      isAvailable: (rawItemData.status === BOOK_STATUS_AVAILABLE),
    }

    return formattedItemData
  }

  return undefined
}
