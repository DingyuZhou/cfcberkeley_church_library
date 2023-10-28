'use client'

import React, { useState } from "react"
import { TextField, Select, MenuItem, Button, Grid } from "@mui/material"
import axios from 'axios'
import styled from "@emotion/styled"

import { WEB_URL, BOOK_STATUS_AVAILABLE, ITEM_TYPE_ID } from 'src/constants'
import { TRADITIONAL } from 'src/constants/language'
import { IItem, IItemCategorySection, IItemCategoryMap } from 'src/types'
import { chineseSimplifiedToTraditionalConverter } from 'src/util/chineseConverter'
import useTisl from 'src/hooks/useTisl'

import ItemDetailsUi from './[itemIdOrUuid]/details/ItemDetailsUi'
import formatItemDataFromDb from './formatItemDataFromDb'

interface IProps {
  hasAdminPrivilege: boolean,
  itemCategorySections: IItemCategorySection[],
  itemCategoryMap: IItemCategoryMap
}

const ItemDetailsContainer = styled.div`
  padding: 10px 0;
`

const ALL_CATEGORY_SECTIONS = 'All'

function ItemSearch({ hasAdminPrivilege, itemCategorySections, itemCategoryMap }: IProps) {
  const [searchText, setSearchText] = useState("")
  const [searchCategorySection, setSearchCategorySection] = useState(ALL_CATEGORY_SECTIONS)
  const [results, setResults] = useState<IItem[]>([])
  const [hasUnsubmittedNewSearch, setHasUnsubmittedHasNewSearch] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { getTisl, selectedLanguage } = useTisl()

  const isInTraditionalChinese = selectedLanguage === TRADITIONAL

  const handleCategorySectionChange = (event: any) => {
    setSearchCategorySection(event.target.value as string)
    setHasUnsubmittedHasNewSearch(true)
  }

  const handleSearch = async (event: any) => {
    if (event) {
      event.preventDefault()
    }

    setIsSubmitting(true)

    try {
      let itemTypeId = ITEM_TYPE_ID.BOOK
      let categorySection = ALL_CATEGORY_SECTIONS
      if (searchCategorySection === ALL_CATEGORY_SECTIONS) {
        itemTypeId = ITEM_TYPE_ID.ALL
      } else {
        categorySection = searchCategorySection
      }

      const searchResponse = await axios.post(`${WEB_URL}/api/item/search`, { searchText, itemTypeId, categorySection })
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
          }, itemCategoryMap)

          if (formattedItem) {
            searchedItems.push(formattedItem)
          }
        }
      })

      setResults(searchedItems)
      setHasUnsubmittedHasNewSearch(false)
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
                label={getTisl('Search')}
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </Grid>
            <Grid item xs={8} md={2}>
              <Select
                fullWidth
                value={searchCategorySection}
                onChange={handleCategorySectionChange}
              >
                <MenuItem value={ALL_CATEGORY_SECTIONS}>{getTisl('All Categories')}</MenuItem>
                {
                  itemCategorySections.map((section) => {
                    return (
                      <MenuItem key={section.categorySection} value={section.categorySection}>
                        {getTisl('Book')} - {isInTraditionalChinese ? chineseSimplifiedToTraditionalConverter(section.categorySectionDisplayName) : section.categorySectionDisplayName}
                      </MenuItem>
                    )
                  })
                }
              </Select>
            </Grid>
            <Grid item xs={4} md={2}>
              <Button fullWidth type="submit" variant="contained" color="primary" size="large" sx={{ height: '55px' }} onClick={handleSearch}>
                {getTisl('Search')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>

      {
        !hasUnsubmittedNewSearch ? (
          results.length ? (
            results.map(result => (
              <Grid item xs={12} key={result.itemId} style={{ maxWidth: '1000px', padding: '10px 0 10px 0' }}>
                <ItemDetailsContainer>
                  <ItemDetailsUi
                    hasAdminPrivilege={hasAdminPrivilege}
                    clickToRedirectUrl={`/item/${result.itemId}/details`}
                    item={result}
                  />
                </ItemDetailsContainer>
              </Grid>
            ))
          ) : (
            <Grid item xs={12} style={{ maxWidth: '1000px', fontSize: '20px', padding: '40px 0 20px 0' }}>
              <div>
                <div>
                  Unfortunately, we could not find any matching results for your search.
                </div>
                <div style={{ padding: '15px 0 0 0' }}>
                  If you have any specific titles or keywords in mind, please try refining your search or feel free to ask for assistance. We are here to help!
                </div>
              </div>
            </Grid>
          )
        ) : null
      }
    </Grid>
  )
}

export default ItemSearch
