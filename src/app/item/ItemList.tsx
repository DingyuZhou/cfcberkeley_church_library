'use client'

import { useEffect, useState } from 'react'
import { Box, Button, Grid } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import axios from 'axios'

import { WEB_URL } from 'src/constants'
import { IItem, IItemCategory, IItemCategoryMap } from 'src/types'
import AlertDialog from 'src/components/AlertDialog'

import formatItemDataFromDb from './formatItemDataFromDb'
import ItemEdit from './ItemEdit'

interface IProps {
  allItems: IItem[]
  itemCategories: IItemCategory[],
  itemCategoryMap: IItemCategoryMap,
  uuidToLink?: string
  onItemLinked?: (linkedItem: IItem) => void
}

interface IAlertProps {
  isOpen: boolean
  title: string
  item: {
    itemId: string
    title: string
    author: string
    publisher: string
  }
}

interface tableRowData extends IItem {
  id?: string
}

const defaultAlertProps = {
  isOpen: false,
  title: '',
  item: {
    itemId: '',
    title: '',
    author: '',
    publisher: '',
  }
}

export default function ItemList({
  allItems, itemCategories, itemCategoryMap, uuidToLink, onItemLinked
}: IProps) {
  const [isLinking, setIsLinking] = useState(false)
  const [tableRows, setTableRows] = useState<tableRowData[]>([])
  const [alertProps, setAlertProps] = useState<IAlertProps>(defaultAlertProps)

  useEffect(() => {
    const initialTableRows = (allItems || []).map((itemData: IItem) => {
      return {
        ...itemData,
        id: itemData?.itemId,
      }
    })
    setTableRows(initialTableRows)
  }, [allItems, itemCategories, itemCategoryMap, uuidToLink])

  const closeAlertDialog = () => {
    setAlertProps({
      ...alertProps,
      isOpen: false,
    })
  }

  const handLinkUuidAndItem = async () => {
    const itemId = alertProps?.item?.itemId
    closeAlertDialog()
    if (itemId && uuidToLink) {
      setIsLinking(true)
      try {
        const linkResponse = await axios.post(`${WEB_URL}/api/item/link`, { itemId, itemUuid: uuidToLink })
        const linkedItem = formatItemDataFromDb(linkResponse?.data, itemCategoryMap)
        if (linkedItem && onItemLinked) {
          onItemLinked(linkedItem)
        }
      } catch (error) {
        console.error(error)
      }

      setIsLinking(false)
    }
  }

  const handleItemSave = (savedItem?: IItem) => {
    if (savedItem) {
      const newTableRows = [...tableRows]
      const itemRowIndex = newTableRows.findIndex((rowData) => {
        return (rowData.itemId === savedItem.itemId)
      })
      newTableRows[itemRowIndex] = {
        ...savedItem,
        id: savedItem.itemId
      }
      setTableRows(newTableRows)
    }
  }

  const columnDefs: GridColDef[] = [
    {
      field: "edit",
      headerName: "",
      sortable: false,
      hideable: false,
      filterable: false,
      width: 90,
      renderCell: (params) => {
        return (
          <ItemEdit
            item={params?.row}
            itemCategories={itemCategories}
            itemCategoryMap={itemCategoryMap}
            onSave={handleItemSave}
          >
            <Button fullWidth variant="contained" color="info">
              Edit
            </Button>
          </ItemEdit>
        );
      },
    },
    {
      field: 'title',
      headerName: 'Title',
      filterable: true,
      hideable: false,
      minWidth: 250,
      flex: 3,
    },
    {
      field: 'author',
      headerName: 'Author',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 3,
    },
    {
      field: 'publisher',
      headerName: 'Publisher',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 3,
    },
    {
      field: 'category',
      headerName: 'Category',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 3,
    },
    {
      field: 'libraryNumber',
      headerName: 'Library Number',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
    },
    {
      field: 'note',
      headerName: 'Note',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
    },
  ]

  if (uuidToLink) {
    columnDefs.unshift({
      field: "link",
      headerName: "",
      sortable: false,
      hideable: false,
      filterable: false,
      width: 90,
      renderCell: (params) => {
        return (
          <Button
            fullWidth
            disabled={isLinking}
            variant="outlined"
            color="info"
            onClick={() => {
              const item = params?.row
              setAlertProps({
                isOpen: true,
                title: 'Are you sure to link the book:',
                item: {
                  itemId: item?.itemId,
                  title: item?.title,
                  author: item?.author,
                  publisher: item?.publisher,
                }
              })
            }}
          >
            {
              (params?.row?.uuid || '').indexOf("temp-") === 0 ? 'Link' : 'Re-Link'
            }
          </Button>
        )
      }
    })
  }

  return (
    <Box sx={{ width: '100%' }}>
      <AlertDialog
        isOpen={alertProps?.isOpen}
        title={alertProps?.title}
        onYes={handLinkUuidAndItem}
        onNo={closeAlertDialog}
      >
        <Grid container spacing={2}>
          <Grid item xs={4} style={{ textAlign: 'right', fontWeight: 700 }}>书名</Grid>
          <Grid item xs={8}>{alertProps?.item?.title}</Grid>
          <Grid item xs={4} style={{ textAlign: 'right', fontWeight: 700 }}>作者</Grid>
          <Grid item xs={8}>{alertProps?.item?.author}</Grid>
          <Grid item xs={4} style={{ textAlign: 'right', fontWeight: 700 }}>出版商</Grid>
          <Grid item xs={8}>{alertProps?.item?.publisher}</Grid>
        </Grid>
      </AlertDialog>

      <DataGrid
        rows={tableRows}
        columns={columnDefs}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[20, 50, 100]}
        disableRowSelectionOnClick
      />
    </Box>
  )
}
