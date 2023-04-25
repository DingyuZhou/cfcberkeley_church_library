'use client'

import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { IItemCategory } from 'src/types'
import ItemCategoryEditForm from './ItemCategoryEditForm'

interface IProps {
  itemCategory: IItemCategory
  children: any
  onSave?: (editedItemCategory?: IItemCategory) => void
  dialogTitle?: string
}

export default function ItemCategoryEdit({ itemCategory, children, onSave, dialogTitle }: IProps) {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = async (savedItemCategory?: IItemCategory) => {
    if (onSave) {
      onSave(savedItemCategory)
    }
    setOpen(false)
  }

  return (
    <div style={{ width: '100%' }}>
      <div onClick={handleClickOpen} style={{ width: '100%' }}>{children}</div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{ dialogTitle ? dialogTitle : 'Edit Book' }</DialogTitle>
        <DialogContent style={{ padding: '20px 30px 40px 30px' }}>
          <ItemCategoryEditForm
            itemCategory={itemCategory}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
