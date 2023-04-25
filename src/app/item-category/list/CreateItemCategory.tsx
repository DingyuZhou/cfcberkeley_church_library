'use client'

import { Button } from '@mui/material'

import { ITEM_TYPE_ID } from 'src/constants'

import ItemCategoryEdit from '../ItemCategoryEdit'
import { IItemCategory } from 'src/types'

interface IProps {
  onItemCategoryCreated: (newCreatedItemCategory?: IItemCategory) => void
}

export default function CreateItemCategory({ onItemCategoryCreated }: IProps) {
  return (
    <ItemCategoryEdit
      itemCategory={{
        itemTypeId: ITEM_TYPE_ID.BOOK,
      }}
      onSave={onItemCategoryCreated}
      dialogTitle="Add a new book category"
    >
      <Button variant="contained" color="primary">
        Add a new book category
      </Button>
    </ItemCategoryEdit>
  )
}
