'use client'

import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { IItem } from 'src/types'

import BookBorrowForm from './BookBorrowForm'

interface IProps {
  children: any
  item: IItem
}

export default function BookBorrow({ item, children }: IProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleClickOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    if (isSuccess) {
      window.location.reload()
    }
    setIsOpen(false)
  }

  const handleBookBorrowed = () => {
    setIsSuccess(true)
  }

  return (
    <div style={{ width: '100%' }}>
      <div onClick={handleClickOpen} style={{ width: '100%' }}>{children}</div>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Borrow The Book</DialogTitle>
        <DialogContent style={{ padding: '20px 30px 40px 30px' }}>
          {
            isSuccess ? (
              <div>The book, {item.title}, has been successfully borrowed. Enjoy!</div>
            ) : (
              <BookBorrowForm itemId={item.itemId} onBookBorrowed={handleBookBorrowed} />
            )
          }
        </DialogContent>
      </Dialog>
    </div>
  )
}
