'use client'

import { useState } from 'react'
import { Grid } from '@mui/material'
import axios from 'axios'

import { WEB_URL, UNEXPECTED_INTERNAL_ERROR } from 'src/constants'
import { IItem } from 'src/types'
import AlertDialog from 'src/components/AlertDialog'

interface IProps {
  children: any
  item?: IItem
}

export default function BookReturn({ item, children }: IProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleClickOpen = () => {
    setIsLoading(false)
    setErrorMessage('')
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleBookReturned = async () => {
    setIsLoading(true)

    let response: any = null
    try {
      response = await axios.post(`${WEB_URL}/api/item/return`, {
        itemId: item?.itemId,
      })

      if (response?.data?.isSuccess) {
        handleClose()
      } else {
        setErrorMessage(response?.data?.errorMessage || UNEXPECTED_INTERNAL_ERROR)
        setIsLoading(false)
      }
    } catch (error: any) {
      setErrorMessage(UNEXPECTED_INTERNAL_ERROR)
      setIsLoading(true)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <div onClick={handleClickOpen} style={{ width: '100%' }}>{children}</div>
      <AlertDialog
        isOpen={isOpen}
        title="Are you sure to mark the book as returned?"
        onYes={handleBookReturned}
        onNo={handleClose}
        isLoading={isLoading}
        errorMessage={errorMessage}
      >
        <Grid container spacing={2}>
          <Grid item xs={4} style={{ textAlign: 'right', fontWeight: 700 }}>书名</Grid>
          <Grid item xs={8}>{item?.title}</Grid>
          <Grid item xs={4} style={{ textAlign: 'right', fontWeight: 700 }}>作者</Grid>
          <Grid item xs={8}>{item?.author}</Grid>
          <Grid item xs={4} style={{ textAlign: 'right', fontWeight: 700 }}>出版商</Grid>
          <Grid item xs={8}>{item?.publisher}</Grid>
        </Grid>
      </AlertDialog>
    </div>
  )
}
