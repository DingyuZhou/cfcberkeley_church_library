import { IItemCategory } from 'src/types'

export default function formatItemCategoryDataFromDb(rawItemCategoryData: any) {
  if (rawItemCategoryData) {
    const formattedItemData: IItemCategory = {
      categoryId: rawItemCategoryData.id,

      name: rawItemCategoryData.name || '',
      section: rawItemCategoryData.section || '',
      libraryNumber: rawItemCategoryData.libraryNumber || rawItemCategoryData['library_number'] || '',
      location: rawItemCategoryData.location || '',
      itemTypeId: rawItemCategoryData.itemTypeId || rawItemCategoryData['item_type_id'] || '',
      details: rawItemCategoryData.details,
    }

    return formattedItemData
  }

  return undefined
}
