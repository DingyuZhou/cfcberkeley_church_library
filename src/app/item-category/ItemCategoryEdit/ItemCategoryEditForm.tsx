'use client'

import React, { ChangeEvent, FormEvent, useState } from "react"
import axios from "axios"
import { Grid, TextField, Button } from '@mui/material'

import { WEB_URL, ITEM_TYPE_ID } from 'src/constants'
import { IItemCategory } from "src/types"
import formatItemCategoryDataFromDb from '../formatItemCategoryDataFromDb'

interface IProps {
  itemCategory: IItemCategory
  onSave?: (editedItemCategory?: IItemCategory) => void
}

const ItemCategoryEditForm = ({ itemCategory, onSave }: IProps) => {
  const [editedItemCategory, setEditedItemCategory] = useState<IItemCategory>(itemCategory)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setEditedItemCategory({
      ...editedItemCategory,
      [name]: value
    })
  }

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    let editedItemCategoryData: IItemCategory | undefined = undefined

    try {
      const response = await axios.post(
        `${WEB_URL}/api/item-category/edit`,
        {
          itemCategory: {
            ...editedItemCategory,
            id: editedItemCategory.categoryId,
            itemTypeId: ITEM_TYPE_ID.BOOK,
          }
        }
      )
      editedItemCategoryData = formatItemCategoryDataFromDb(response?.data)
    } catch (error: any) {
      console.log(error)
    }
    setIsSubmitting(false)

    if (onSave) {
      onSave(editedItemCategoryData)
    }
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="name"
            label="Name"
            variant="outlined"
            value={editedItemCategory.name}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="libraryNumber"
            label="Library Number"
            variant="outlined"
            value={editedItemCategory.libraryNumber}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="section"
            label="Section"
            variant="outlined"
            value={editedItemCategory.section}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="location"
            label="Location"
            variant="outlined"
            value={editedItemCategory.location}
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

export default ItemCategoryEditForm
