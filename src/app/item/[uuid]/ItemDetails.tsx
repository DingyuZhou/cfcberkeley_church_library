'use client'

import {
  Typography,
  Grid,
  Button,
} from '@mui/material'

import { IItem } from 'src/types'

interface IProps {
  hasAdminPrivilege: boolean
  item?: IItem
}

export default function ItemDetails({ hasAdminPrivilege, item }: IProps) {
  if (item?.itemId) {
    return (
      <Grid container spacing={2} rowSpacing={2}>
        <Grid item xs={12}><h1>Book</h1></Grid>
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
        <Grid item xs={12} sm={6}>
          <Typography variant="body1"><strong>UUID:</strong> {item.uuid}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary">Borrow the book</Button>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}><h1>Sorry, no book found</h1></Grid>
    </Grid>
  )
}