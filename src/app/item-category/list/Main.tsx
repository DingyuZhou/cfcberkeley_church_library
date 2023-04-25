'use client'

import { useState } from 'react'

import { IItemCategory } from "src/types"

import ItemCategoryList from '../ItemCategoryList'
import CreateItemCategory from './CreateItemCategory'

interface IProps {
  allItemCategories: IItemCategory[]
}

export default function Main({ allItemCategories }: IProps) {
  const [itemCategoryList, setItemCategoryList] = useState<IItemCategory[]>(allItemCategories)

  const handleItemCategoryCreated = (newCreatedItemCategory?: IItemCategory) => {
    if (newCreatedItemCategory) {
      setItemCategoryList([
        newCreatedItemCategory,
        ...itemCategoryList,
      ])
    }
  }

  return (
    <div style={{ padding: '5px 20px 60px 20px' }}>
      <h1 style={{ paddingBottom: '20px' }}>All Book Categories</h1>

      <div style={{ paddingBottom: '35px' }}>
        <CreateItemCategory onItemCategoryCreated={handleItemCategoryCreated} />
      </div>

      <ItemCategoryList
        allItemCategories={itemCategoryList}
      />
    </div>
  )
}
