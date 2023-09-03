import { IItem, IItemCategoryMap } from 'src/types'
import { BOOK_STATUS_AVAILABLE, BOOK_STATUS_BORROWED, BOOK_STATUS_DELETED, BOOK_STATUS_MISSING } from 'src/constants'
import { getDateDisplayString } from 'src/util/datetime'
import { getCategorySectionDisplayString } from 'src/util/itemCategory'
import { getPhoneNumberDisplayString, getOverdueDays, getIsEligibleToRenew } from 'src/util/item'

export const itemStatusDisplayStringMap: { [status: string]: string } = {
  [BOOK_STATUS_AVAILABLE]: 'Available',
  [BOOK_STATUS_BORROWED]: 'Borrowed',
  [BOOK_STATUS_DELETED]: 'Deleted',
  [BOOK_STATUS_MISSING]: 'Missing',
}

export default function formatItemDataFromDb(rawItemData: any, itemCategoryMap?: IItemCategoryMap) {
  if (rawItemData) {
    const itemCategoryId = rawItemData.itemCategoryId || rawItemData['item_category_id'] || ''

    const categorySection = itemCategoryMap?.[itemCategoryId]?.section || ''
    const categorySectionDisplayString = getCategorySectionDisplayString(categorySection)

    const formattedItemData: IItem = {
      itemCategoryId,
      categorySection,
      categorySectionDisplayString,
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
      status: rawItemData.status || BOOK_STATUS_AVAILABLE,
      isAvailable: (rawItemData.status === BOOK_STATUS_AVAILABLE),
      isBorrowed: (rawItemData.status === BOOK_STATUS_BORROWED),
      borrowedAt: getDateDisplayString(rawItemData.borrowedAt || rawItemData['borrowed_at']),
      dueAt: getDateDisplayString(rawItemData.dueAt || rawItemData['due_at']),
      borrowerId: rawItemData['borrower_id'] || null,
      borrowerName: rawItemData['borrower_name'] || '',
      borrowerPhoneNumber: getPhoneNumberDisplayString(rawItemData['borrower_phone_number'] || ''),
      hasRenewed: !!(rawItemData.hasRenewed || rawItemData['has_renewed']),
      overdueDays: getOverdueDays(rawItemData.dueAt || rawItemData['due_at']),
      isEligibleToRenew: getIsEligibleToRenew(rawItemData.borrowedAt || rawItemData['borrowed_at']),
    }

    return formattedItemData
  }

  return undefined
}
