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
import useTisl from 'src/hooks/useTisl'

import { itemStatusDisplayStringMap } from '../../formatItemDataFromDb'
import BookBorrow from './BookBorrow'
import { BOOK_STATUS_AVAILABLE } from 'src/constants'

interface IProps {
  hasAdminPrivilege: boolean
  clickToRedirectUrl?: string
  hasBorrowButton?: boolean
  item?: IItem
  handleItemChange?: () => any
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

export default function ItemDetailsUi({ hasAdminPrivilege, clickToRedirectUrl, hasBorrowButton, item, handleItemChange }: IProps) {
  const { push } = useRouter()
  const { getUiTisl, getDbTisl } = useTisl()

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
              <Grid item xs={12}><ItemTypeDiv>{getUiTisl(item.itemType || 'Book')}</ItemTypeDiv></Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>{getUiTisl('Book Title')}:</strong> {getDbTisl(item.title)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>{getUiTisl('Category')}:</strong> {getDbTisl(item.categorySectionDisplayString)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>{getUiTisl('Author')}:</strong> {getDbTisl(item.author)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>{getUiTisl('Translator')}:</strong> {getDbTisl(item.translator)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>{getUiTisl('Publisher')}:</strong> {getDbTisl(item.publisher)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>{getUiTisl('Library Number')}:</strong> {getDbTisl(item.libraryNumber)}</Typography>
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
                <Typography variant="body1">
                  <strong>{getUiTisl('Book Status')}:</strong>
                  <span style={{ color: (item.status === BOOK_STATUS_AVAILABLE ? 'green' : 'red') }}>
                    {' '}{getUiTisl(itemStatusDisplayStringMap[item.status || ''] || '')}
                  </span>
                </Typography>
              </Grid>
              {
                item.borrowedAt ? (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>{getUiTisl('Borrowed On')}:</strong> {item.borrowedAt || ''}</Typography>
                  </Grid>
                ) : null
              }
              {
                item.dueAt ? (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>{getUiTisl('Return Due Date')}:</strong> {item.dueAt || ''}</Typography>
                  </Grid>
                ) : null
              }
            </Grid>
          </DetailContainer>
        </Grid>

        {
          (hasBorrowButton && item.isAvailable) ? (
            <Grid item xs={12} style={{ paddingTop: '20px' }}>
              <BookBorrow item={item} isForRenew={false} handleItemChange={handleItemChange}>
                <Button variant="contained" color="primary">{getUiTisl('Borrow Book')}</Button>
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
              <BookBorrow item={item} isForRenew={true} handleItemChange={handleItemChange}>
                <Button variant="contained" color="primary">{getUiTisl('Renew Book')}</Button>
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