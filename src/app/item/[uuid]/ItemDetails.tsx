'use client'

import {
  Typography,
  Grid,
  Button,
} from '@mui/material'
import styled from "@emotion/styled"
import { useRouter } from 'next/navigation'

import { IItem } from 'src/types'

import BookBorrow from './BookBorrow'

interface IProps {
  hasAdminPrivilege: boolean
  clickToRedirectUrl?: string
  hasBorrowButton?: boolean
  item?: IItem
}

const ItemTypeDiv = styled.div`
  font-weight: bold;
  font-size: 30px;
`

const ClickableContainer = styled.div`
  cursor: pointer;

  :hover {
    background-color: #f9f9f9;
  }
`

const NonclickableContainer = styled.div``

export default function ItemDetails({ hasAdminPrivilege, clickToRedirectUrl, hasBorrowButton, item }: IProps) {
  const { push } = useRouter()

  const DetailContainer = clickToRedirectUrl ? ClickableContainer : NonclickableContainer

  const handleClickToRedirect = (event: any) => {
    if (event) {
      if (event.preventDefault) {
        event.preventDefault()
      }
      if (event.stopPropagation) {
        event.stopPropagation()
      }
    }

    if (clickToRedirectUrl) {
      push(clickToRedirectUrl)
    }
  }

  if (item?.itemId) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <DetailContainer onClick={handleClickToRedirect}>
            <Grid container>
              <Grid item xs={12}><ItemTypeDiv>{item.itemType || 'Book'}</ItemTypeDiv></Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>Title:</strong> {item.title}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>Category:</strong> {item.category}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>Author:</strong> {item.author}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>Translator:</strong> {item.translator}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>Publisher:</strong> {item.publisher}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>Library Number:</strong> {item.libraryNumber}</Typography>
              </Grid>
              {
                hasAdminPrivilege ? (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Note:</strong> {item.note}</Typography>
                  </Grid>
                ) : null
              }
              {
                hasAdminPrivilege ? (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>UUID:</strong> {item.uuid}</Typography>
                  </Grid>
                ) : null
              }
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>Status:</strong> {item.status}</Typography>
              </Grid>
            </Grid>
          </DetailContainer>
        </Grid>

        {
          (hasBorrowButton && item.isAvailable) ? (
            <Grid item xs={12} style={{ paddingTop: '20px' }}>
              <BookBorrow item={item}>
                <Button variant="contained" color="primary">Borrow the book</Button>
              </BookBorrow>
            </Grid>
          ) : null
        }
      </Grid>
    )
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}><h1>Sorry, no book found</h1></Grid>
    </Grid>
  )
}