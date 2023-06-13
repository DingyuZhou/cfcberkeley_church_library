'use client'

import { useState } from 'react'
import { Grid } from '@mui/material'
import { Button } from '@mui/material'

import { ITEM_TYPE_ID, UNCATEGORIZED_CATEGORY_ID } from 'src/constants'
import { IItem, IItemCategory, IItemCategoryMap } from 'src/types'

import ItemEdit from '../ItemEdit'
import ItemDetails from './ItemDetails'
import ItemSearch from './ItemSearch'
import BookReturn from './BookReturn'

interface IProps {
  uuid: string
  itemCategories: IItemCategory[]
  itemCategoryMap: IItemCategoryMap
  hasAdminPrivilege: boolean
  item?: IItem
}

export default function Main({ uuid, itemCategories, itemCategoryMap, hasAdminPrivilege, item }: IProps) {
  const [displayedItem, setDisplayedItem] = useState<IItem>(
    item || {
      uuid,
      itemTypeId: ITEM_TYPE_ID.BOOK,
      itemCategoryId: UNCATEGORIZED_CATEGORY_ID,
    }
  )

  const handleItemCreated = (newCreatedItem?: IItem) => {
    if (newCreatedItem) {
      setDisplayedItem(newCreatedItem)
    }
  }

  const handleItemLinked = (linkedItem?: IItem) => {
    if (linkedItem) {
      setDisplayedItem(linkedItem)
    }
  }

  const hasBook = !!(displayedItem?.itemId) || false

  return (
    <Grid container rowSpacing={5} style={{ paddingTop: '50px' }}>
      <Grid item xs={12}>
        <ItemDetails item={displayedItem} hasAdminPrivilege={hasAdminPrivilege} />
      </Grid>

      {
        hasAdminPrivilege ? (
          <Grid item xs={12}>
            <Grid container rowSpacing={5}>
              <Grid item xs={12}>
                <ItemEdit
                  item={displayedItem}
                  itemCategories={itemCategories}
                  itemCategoryMap={itemCategoryMap}
                  onSave={handleItemCreated}
                  dialogTitle={
                    hasBook ? 'Edit the book' : 'Add a new book'
                  }
                >
                  <Button variant="contained" color="primary">
                    {
                      hasBook ? 'Edit the book' : 'Add a new book'
                    }
                  </Button>
                </ItemEdit>
              </Grid>

              {
                hasBook ? (
                  <Grid item xs={12} style={{ paddingTop: '30px' }}>
                    <BookReturn item={item}>
                      <Button variant="contained" color="primary">Mark the book as returned</Button>
                    </BookReturn>
                  </Grid>
                ) : null
              }

              {
                !hasBook ? (
                  <Grid item xs={12}>
                    <ItemSearch
                      itemUuid={uuid}
                      itemCategories={itemCategories}
                      itemCategoryMap={itemCategoryMap}
                      onItemLinked={handleItemLinked}
                    />
                  </Grid>
                ) : null
              }
            </Grid>
          </Grid>
        ) : null
      }
    </Grid>
  )
}
