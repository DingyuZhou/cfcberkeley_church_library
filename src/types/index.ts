export interface IItem {
  uuid: string
  itemType?: string
  itemTypeId: string
  itemCategoryId: string
  itemId?: string
  title?: string
  category?: string
  categorySection?: string
  categorySectionDisplayString?: string
  libraryNumber?: string
  author?: string
  translator?: string
  publisher?: string
  url?: string
  releasedAt?: string
  note?: string
  details?: any
  status?: string
  isAvailable?: boolean
  isBorrowed?: boolean
  borrowedAt?: string
  dueAt?: string
  borrowerId?: string
  borrowerName?: string
  borrowerPhoneNumber?: string
  hasRenewed?: boolean
  overdueDays?: number
  isEligibleToRenew?: boolean
}

export interface IItemCategory {
  itemTypeId: string
  categoryId?: string
  name?: string
  section?: string
  libraryNumber?: string
  location?: string
  details?: any
}

export interface IItemCategorySection {
  categorySection: string
  categorySectionDisplayName: string
}

export interface IItemCategoryMap {
  [categoryId: string]: IItemCategory
}

export interface IItemCategoryInfo {
  itemCategories: IItemCategory[]
  itemCategorySections: IItemCategorySection[]
  itemCategoryMap: IItemCategoryMap
}