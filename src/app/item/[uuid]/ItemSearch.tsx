'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { Grid, TextField, Button } from '@mui/material'

import { WEB_URL } from 'src/constants'
import { IItem, IItemCategory, IItemCategoryMap } from 'src/types'
import formatItemDataFromDb from 'src/app/item/formatItemDataFromDb'

import ItemList from '../ItemList'

interface IProps {
  itemUuid: string
  itemCategories: IItemCategory[]
  itemCategoryMap: IItemCategoryMap
  onItemLinked: (linkedItem: IItem) => void
}

function ItemSearch({ itemUuid, itemCategories, itemCategoryMap, onItemLinked }: IProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchedItems, setSearchedItems] = useState([])

  const handleSearch = async (event: any) => {
    if (event?.preventDefault) {
      event.preventDefault()
    }

    setIsSubmitting(true)

    try {
      const searchResponse = await axios.post(`${WEB_URL}/api/item/search`, { searchText })
      setSearchedItems((searchResponse.data || []).map((rawItemData: any) => {
        return formatItemDataFromDb(rawItemData, itemCategoryMap)
      }))
    } catch (error) {
      console.error(error)
    }

    setIsSubmitting(false)
  }

  const handleInputChange = (event: any) => {
    setSearchText(event?.target?.value)
  }

  return (
    <Grid
      container
      rowSpacing={3}
    >
      <Grid item xs={12}>
        <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '400px' }}>
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={8}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                value={searchText}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                disabled={isSubmitting}
                type="submit"
                variant="contained"
                color="primary"
                size="medium"
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>

      {
        searchedItems.length ? (
          <Grid item xs={12}>
            <ItemList
              allItems={searchedItems}
              itemCategories={itemCategories}
              itemCategoryMap={itemCategoryMap}
              uuidToLink={itemUuid}
              onItemLinked={onItemLinked}
            />
          </Grid>
        ) : null
      }
    </Grid>
  )
}

export default ItemSearch