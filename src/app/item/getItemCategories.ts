import { getDb } from 'src/db/models'
import { IItemCategory, IItemCategorySection, IItemCategoryMap } from 'src/types'
import { getCategorySectionDisplayString } from 'src/util/itemCategory'

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
  const itemCategorySections: IItemCategorySection[] = []
  const itemCategoryMap: IItemCategoryMap = {}

  const categorySectionSet = new Set<string>()

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

        if (rawCategory.id > 0) {
          categorySectionSet.add(rawCategory.section)
        }

        itemCategoryMap[formattedCategory.categoryId] = formattedCategory
      }
    })
  }

  Array.from(categorySectionSet).sort((sectionA: string, sectionB: string) => {
    return sectionA.localeCompare(sectionB);
  }).forEach((categorySection) => {
    itemCategorySections.push({
      categorySection,
      categorySectionDisplayName: getCategorySectionDisplayString(categorySection),
    })
  })

  return {
    itemCategories,
    itemCategorySections,
    itemCategoryMap,
  }
}
