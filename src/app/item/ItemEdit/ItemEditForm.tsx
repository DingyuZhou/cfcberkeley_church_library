'use client'

import React, { ChangeEvent, FormEvent, useState } from "react"
import axios from "axios"
import { Grid, TextField, Button, Autocomplete } from '@mui/material'

import { WEB_URL, ITEM_TYPE_ID } from 'src/constants'
import { IItem, IItemCategory, IItemCategoryMap } from 'src/types'
import formatItemDataFromDb from '../formatItemDataFromDb'

interface IProps {
  item: IItem
  itemCategories: IItemCategory[],
  itemCategoryMap: IItemCategoryMap
  onSave?: (editedItem?: IItem) => void
}

const ItemEditForm = ({ item, itemCategories, itemCategoryMap, onSave }: IProps) => {
  const category = itemCategoryMap[item?.itemCategoryId]

  const [editedItem, setEditedItem] = useState<IItem>(item)
  const [categorySelectValue, setCategorySelectValue] = useState({
    label: `${category?.libraryNumber} - ${category?.name}`,
    itemCategoryId: category?.categoryId,
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setEditedItem({
      ...editedItem,
      [name]: value
    })
  }

  const handleItemCategoryChange = (_: any, selectedCategoryValue: any) => {
    setCategorySelectValue(selectedCategoryValue)
  }

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    let editedItemData: IItem | undefined = undefined

    try {
      const response = await axios.post(
        `${WEB_URL}/api/item/edit`,
        {
          item: {
            ...editedItem,
            id: editedItem.itemId,
            itemCategoryId: categorySelectValue.itemCategoryId,
            itemTypeId: ITEM_TYPE_ID.BOOK,
            uuid: item?.uuid,
          }
        }
      )
      editedItemData = formatItemDataFromDb(response?.data, itemCategoryMap)
    } catch (error: any) {
      console.log(error)
    }
    setIsSubmitting(false)

    if (onSave) {
      onSave(editedItemData)
    }
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="title"
            label="Title"
            variant="outlined"
            value={editedItem.title}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            disablePortal
            value={categorySelectValue}
            options={itemCategories.map((category) => {
              return {
                label: `${category.libraryNumber} - ${category.name}`,
                itemCategoryId: category.categoryId,
              }
            })}
            renderInput={(params) => <TextField {...params} label="Category" />}
            onChange={handleItemCategoryChange}
            isOptionEqualToValue={(option: any, value: any) => {
              if (option.itemCategoryId === value.itemCategoryId) {
                return true
              }
              return false
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="libraryNumber"
            label="Library Number"
            variant="outlined"
            value={editedItem.libraryNumber}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="author"
            label="Author"
            variant="outlined"
            value={editedItem.author}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="translator"
            label="Translator"
            variant="outlined"
            value={editedItem.translator}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="publisher"
            label="Publisher"
            variant="outlined"
            value={editedItem.publisher}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="note"
            label="Note"
            variant="outlined"
            value={editedItem.note}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button disabled={isSubmitting} type="submit" variant="contained" color="primary" fullWidth>
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default ItemEditForm
