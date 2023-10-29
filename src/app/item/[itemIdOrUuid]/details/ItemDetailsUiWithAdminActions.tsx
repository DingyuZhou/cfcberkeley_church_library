'use client'

import { useState } from 'react'
import { Grid } from '@mui/material'
import { Button } from '@mui/material'
import axios from 'axios'

import { ITEM_TYPE_ID, DEFAULT_CATEGORY_ID, BOOK_STATUS_AVAILABLE, WEB_URL } from 'src/constants'
import { IItem, IItemCategory, IItemCategoryMap } from 'src/types'
import formatItemDataFromDb from '../../formatItemDataFromDb'

import ItemEdit from '../../ItemEdit'
import ItemDetailsUi from './ItemDetailsUi'
import AdminBookSearch from './AdminBookSearch'
import BookReturn from './BookReturn'

interface IProps {
  uuid: string
  itemCategories: IItemCategory[]
  itemCategoryMap: IItemCategoryMap
  hasAdminPrivilege: boolean
  hasBorrowButton: boolean
  item?: IItem
}

export default function ItemDetailsUiWithAdminActions({ uuid, itemCategories, itemCategoryMap, hasAdminPrivilege, hasBorrowButton, item }: IProps) {
  const [displayedItem, setDisplayedItem] = useState<IItem>(
    item || {
      uuid,
      itemTypeId: ITEM_TYPE_ID.BOOK,
      itemCategoryId: DEFAULT_CATEGORY_ID,
      status: BOOK_STATUS_AVAILABLE,
    }
  )

  const handleItemUpdated = (newUpdatedItem?: IItem) => {
    if (newUpdatedItem) {
      setDisplayedItem(newUpdatedItem)
    }
  }

  const handleItemLinked = (linkedItem?: IItem) => {
    if (linkedItem) {
      setDisplayedItem(linkedItem)
    }
  }

  const handleItemChange = async () => {
    if (item?.itemId) {
      let response: any = null
      try {
        response = await axios.post(`${WEB_URL}/api/item/fetch`, {
          itemId: item?.itemId,
        })
      } catch (error: any) {
        // do nothing
      }

      if (response) {
        const updatedItem = formatItemDataFromDb(response.data?.itemResponse, itemCategoryMap)
        if (updatedItem) {
          setDisplayedItem(updatedItem)
          return
        }
      }

      window.location.reload()
    }
  }

  const hasBook = !!(displayedItem?.itemId) || false

  return (
    <Grid container rowSpacing={5} style={{ paddingTop: '50px' }}>
      <Grid item xs={12}>
        <ItemDetailsUi
          item={displayedItem}
          hasAdminPrivilege={hasAdminPrivilege}
          hasBorrowButton={hasBorrowButton}
          handleItemChange={handleItemChange}
        />
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
                  onSave={handleItemUpdated}
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
                (hasBook && displayedItem?.isBorrowed) ? (
                  <Grid item xs={12} style={{ paddingTop: '30px' }}>
                    <BookReturn item={displayedItem}>
                      <Button variant="contained" color="primary">Mark the book as returned</Button>
                    </BookReturn>
                  </Grid>
                ) : null
              }

              {
                !hasBook ? (
                  <Grid item xs={12}>
                    <AdminBookSearch
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
