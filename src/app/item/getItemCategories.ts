import { getDb } from 'src/db/models'
import { IItemCategory, IItemCategoryMap } from 'src/types'

export default async function getItemCategories() {
  const { models } = getDb()

  const itemCategorieResponse = await models.ItemCategory.findAll({
    order: [
      ['libraryNumber', 'ASC'],
      ['name', 'ASC'],
      ['id', 'ASC'],
    ],
  })

  const itemCategories: IItemCategory[] = []
  const itemCategoryMap: IItemCategoryMap = {}

  if (Array.isArray(itemCategorieResponse)) {
    itemCategorieResponse.forEach((rawCategory: any) => {
      if (rawCategory) {
        const formattedCategory = {
          categoryId: rawCategory.id,
          name: rawCategory.name,
          section: rawCategory.section,
          libraryNumber: rawCategory.libraryNumber,
          location: rawCategory.location,
          itemTypeId: rawCategory.itemTypeId,
          details: rawCategory.details,
        }

        itemCategories.push(formattedCategory)

        itemCategoryMap[formattedCategory.categoryId] = formattedCategory
      }
    })
  }

  return {
    itemCategories,
    itemCategoryMap,
  }
}
