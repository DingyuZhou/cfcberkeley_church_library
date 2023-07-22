'use client'

import React, { useState } from "react"
import { TextField, Select, MenuItem, Button, Grid } from "@mui/material"
import axios from 'axios'
import styled from "@emotion/styled"

import { WEB_URL, BOOK_STATUS_AVAILABLE } from 'src/constants'
import { IItem } from 'src/types'

import ItemDetails from './[uuid]/ItemDetails'
import formatItemDataFromDb from './formatItemDataFromDb'

const ItemDetailsContainer = styled.div`
  padding: 10px 0;
`

const ItemSearch: React.FC = () => {
  const [searchText, setSearchText] = useState("")
  const [searchItemType, setSearchItemType] = useState('All')
  const [results, setResults] = useState<IItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSearch = async (event: any) => {
    if (event) {
      event.preventDefault()
    }

    setIsSubmitting(true)

    try {
      const searchResponse = await axios.post(`${WEB_URL}/api/item/search`, { searchText, searchItemType })
      const searchResponseData = searchResponse.data || []

      const searchedItems: IItem[] = []

      searchResponseData.forEach((rawData: any) => {
        const allItems = rawData?.['all_items']
        if (Array.isArray(allItems) && allItems.length > 0) {
          let firstItem = allItems[0]

          const itemCount = allItems.length
          for (let ii = 0; ii < itemCount; ++ii) {
            const rawItemData = allItems[ii]
            if (rawItemData?.['status'] === BOOK_STATUS_AVAILABLE) {
              firstItem = rawItemData
              break
            }
          }

          const formattedItem = formatItemDataFromDb({
            ...rawData,
            ...firstItem,
          })

          if (formattedItem) {
            searchedItems.push(formattedItem)
          }
        }
      })

      setResults(searchedItems)
    } catch (error) {
      console.error(error)
    }

    setIsSubmitting(false)
  }

  return (
    <Grid container spacing={0} alignItems="center" justifyItems="center" justifyContent="center">
      <Grid item xs={12} style={{ maxWidth: '1000px' }}>
        <form>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </Grid>
            <Grid item xs={8} md={2}>
              <Select
                fullWidth
                value={searchItemType}
                onChange={(event) => setSearchItemType(event.target.value as string)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Book">Book</MenuItem>
                <MenuItem value="Video">Video</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={4} md={2}>
              <Button fullWidth type="submit" variant="contained" color="primary" size="large" sx={{ height: '55px' }} onClick={handleSearch}>
                Search
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>

      {results.map(result => (
        <Grid item xs={12} key={result.itemId} style={{ maxWidth: '1000px' }}>
          <ItemDetailsContainer>
            <ItemDetails
              hasAdminPrivilege={false}
              clickToRedirectUrl={`/item/${result.uuid}`}
              item={result}
            />
          </ItemDetailsContainer>
        </Grid>
      ))}
    </Grid>
  )
}

export default ItemSearch
