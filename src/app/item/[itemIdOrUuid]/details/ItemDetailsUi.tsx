'use client'

import {
  Typography,
  Grid,
  Button,
} from '@mui/material'
import styled from '@emotion/styled'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { IItem } from 'src/types'

import { itemStatusDisplayStringMap } from '../../formatItemDataFromDb'
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

export default function ItemDetailsUi({ hasAdminPrivilege, clickToRedirectUrl, hasBorrowButton, item }: IProps) {
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
                <Typography variant="body1"><strong>Category:</strong> {item.categorySectionDisplayString}</Typography>
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
                (hasAdminPrivilege && (item.note || '').trim()) ? (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Note:</strong> {item.note}</Typography>
                  </Grid>
                ) : null
              }
              {
                hasAdminPrivilege ? (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Item ID:</strong> <Link href={`/item/${item.itemId}/details`}>{item.itemId}</Link></Typography>
                  </Grid>
                ) : null
              }
              {
                hasAdminPrivilege ? (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>UUID:</strong> {
                        (item.uuid || '').substring(0, 5) === 'temp-'
                          ? 'Not UUID Linked Yet'
                          : (<Link href={`/item/${item.uuid}`}>{item.uuid}</Link>)
                      }
                    </Typography>
                  </Grid>
                ) : null
              }
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>Status:</strong> {itemStatusDisplayStringMap[item.status || ''] || ''}</Typography>
              </Grid>
              {
                item.borrowedAt ? (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Borrowed On:</strong> {item.borrowedAt || ''}</Typography>
                  </Grid>
                ) : null
              }
              {
                item.dueAt ? (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Return Due Date:</strong> {item.dueAt || ''}</Typography>
                  </Grid>
                ) : null
              }
            </Grid>
          </DetailContainer>
        </Grid>

        {
          (hasBorrowButton && item.isAvailable) ? (
            <Grid item xs={12} style={{ paddingTop: '20px' }}>
              <BookBorrow item={item} isForRenew={false}>
                <Button variant="contained" color="primary">Borrow the book</Button>
              </BookBorrow>
            </Grid>
          ) : null
        }

        {
          (
            hasBorrowButton
            && item.isBorrowed
            && !item.hasRenewed
            && item.isEligibleToRenew
          ) ? (
            <Grid item xs={12} style={{ paddingTop: '20px' }}>
              <BookBorrow item={item} isForRenew={true}>
                <Button variant="contained" color="primary">Renew the book</Button>
              </BookBorrow>
            </Grid>
          ) : null
        }
      </Grid>
    )
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}><h1>Sorry, no book is found</h1></Grid>
    </Grid>
  )
}