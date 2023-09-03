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
  isForRenew: boolean
}

export default function BookBorrow({ item, children, isForRenew }: IProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [dueAt, setDueAt] = useState('')

  const handleClickOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    if (isSuccess) {
      window.location.reload()
    }
    setIsOpen(false)
  }

  const handleBookBorrowed = (dueAt: string) => {
    setDueAt(dueAt)
    setIsSuccess(true)
  }

  return (
    <div style={{ width: '100%' }}>
      <div onClick={handleClickOpen} style={{ width: '100%' }}>{children}</div>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>{ isForRenew ? 'Renew' : 'Borrow' } The Book</DialogTitle>
        <DialogContent style={{ padding: '20px 30px 40px 30px' }}>
          {
            isSuccess ? (
              <div style={{ fontSize: '20px' }}>
                <div>The book, <strong><i>{item.title}</i></strong>, has been successfully { isForRenew ? 'renewed' : 'borrowed' }. Enjoy!</div>
                {
                  dueAt ? (
                    <div style={{ padding: '20px 0 0 0' }}>The due date for the book return is{ isForRenew ? ' extended to' : '' }: <strong>{dueAt}</strong></div>
                  ) : null
                }
              </div>
            ) : (
              <BookBorrowForm itemId={item.itemId} onBookBorrowed={handleBookBorrowed} isForRenew={isForRenew} />
            )
          }
        </DialogContent>
      </Dialog>
    </div>
  )
}
