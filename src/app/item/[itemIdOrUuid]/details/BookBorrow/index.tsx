'use client'

import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { IItem } from 'src/types'
import useTisl from 'src/hooks/useTisl'

import BookBorrowForm from './BookBorrowForm'

interface IProps {
  children: any
  item: IItem
  isForRenew: boolean
  handleItemChange?: () => any
}

export default function BookBorrow({ item, children, isForRenew, handleItemChange }: IProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [dueAt, setDueAt] = useState('')
  const { getUiTisl, getDbTisl } = useTisl()

  const handleClickOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    if (isSuccess && handleItemChange) {
      handleItemChange()
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
        <DialogTitle>{ isForRenew ? getUiTisl('Renew Book') : getUiTisl('Borrow Book') }</DialogTitle>
        <DialogContent style={{ padding: '20px 30px 40px 30px' }}>
          {
            isSuccess ? (
              <div style={{ fontSize: '20px' }}>
                <div><strong style={{ paddingRight: '5px' }}><i>{getDbTisl(item.title)}</i></strong> { isForRenew ? getUiTisl('is successfully renewed') : getUiTisl('is successfully borrowed') }</div>
                {
                  dueAt ? (
                    <div style={{ padding: '20px 0 0 0' }}>{ isForRenew ? getUiTisl('Due date renews to:') : getUiTisl('Due date is:') } <strong>{dueAt}</strong></div>
                  ) : null
                }
              </div>
            ) : (
              <BookBorrowForm itemId={item.itemId} itemTitle={getDbTisl(item.title)} onBookBorrowed={handleBookBorrowed} isForRenew={isForRenew} />
            )
          }
        </DialogContent>
      </Dialog>
    </div>
  )
}
