'use client'

import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { IItem, IItemCategory, IItemCategoryMap } from 'src/types'
import ItemEditForm from './ItemEditForm'

interface IProps {
  item: IItem
  itemCategories: IItemCategory[]
  itemCategoryMap: IItemCategoryMap
  children: any
  onSave?: (editedItem?: IItem) => void
  dialogTitle?: string
}

export default function ItemEdit({ item, itemCategories, itemCategoryMap, children, onSave, dialogTitle }: IProps) {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = async (savedItem?: IItem) => {
    if (onSave) {
      onSave(savedItem)
    }
    setOpen(false)
  }

  return (
    <div style={{ width: '100%' }}>
      <div onClick={handleClickOpen} style={{ width: '100%' }}>{children}</div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{ dialogTitle ? dialogTitle : 'Edit Book' }</DialogTitle>
        <DialogContent style={{ padding: '20px 30px 40px 30px' }}>
          <ItemEditForm
            item={item}
            itemCategories={itemCategories}
            itemCategoryMap={itemCategoryMap}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
