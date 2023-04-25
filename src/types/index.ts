export interface IItem {
  uuid: string
  itemTypeId: string
  itemCategoryId: string
  itemId?: string
  title?: string
  category?: string
  libraryNumber?: string
  author?: string
  translator?: string
  publisher?: string
  url?: string
  releasedAt?: string
  note?: string
  details?: any
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

export interface IItemCategoryMap {
  [categoryId: string]: IItemCategory
}
