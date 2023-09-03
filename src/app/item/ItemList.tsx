'use client'

import { useEffect, useState } from 'react'
import { Box, Button, Grid } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import axios from 'axios'
import Link from 'next/link'

import { WEB_URL, ITEM_TYPE_ID, DEFAULT_CATEGORY_ID, BOOK_STATUS_AVAILABLE } from 'src/constants'
import { IItem, IItemCategory, IItemCategoryMap } from 'src/types'
import AlertDialog from 'src/components/AlertDialog'

import formatItemDataFromDb from './formatItemDataFromDb'
import ItemEdit from './ItemEdit'

interface IProps {
  allItems: IItem[]
  itemCategories: IItemCategory[],
  itemCategoryMap: IItemCategoryMap,
  visibleFields: string[]
  uuidToLink?: string
  onItemLinked?: (linkedItem: IItem) => void
  onItemUpdated?: (updatedItem: IItem) => void
  isNewBookAddingEnabled: boolean
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
  allItems, itemCategories, itemCategoryMap, visibleFields, uuidToLink, onItemLinked, onItemUpdated, isNewBookAddingEnabled
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

  const handleLinkUuidAndItem = async () => {
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

  const handleNewBookAdded = (newAddedItem?: IItem) => {
    if (newAddedItem) {
      const newTableRows = [
        {
          ...newAddedItem,
          id: newAddedItem.itemId
        },
        ...tableRows
      ]

      setTableRows(newTableRows)
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

      if (onItemUpdated) {
        onItemUpdated(savedItem)
      }
    }
  }

  const allColumnDefs: GridColDef[] = [
    {
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
    },
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
        )
      },
    },
    {
      field: 'title',
      headerName: 'Title',
      filterable: true,
      hideable: false,
      minWidth: 250,
      flex: 3,
      renderCell: (params) => {
        return (
          <Link href={`/item/${params?.row?.itemId}/details`}>{params?.row?.title}</Link>
        )
      },
    },
    {
      field: 'author',
      headerName: 'Author',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
    },
    {
      field: 'publisher',
      headerName: 'Publisher',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
    },
    {
      field: 'category',
      headerName: 'Category',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
    },
    {
      field: 'categorySection',
      headerName: 'Section',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
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
      field: 'status',
      headerName: 'Status',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
    },
    {
      field: 'borrowedAt',
      headerName: 'Borrowed',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
    },
    {
      field: 'dueAt',
      headerName: 'Due',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
      renderCell: (params) => {
        const overdueDays = params?.row?.overdueDays || 0
        return overdueDays > 0 ? (
          <strong style={{ color: 'red' }}>{params?.row?.dueAt}</strong>
        ) : params?.row?.dueAt
      },
    },
    {
      field: 'hasRenewed',
      headerName: 'Renewed',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
      renderCell: (params) => {
        return params?.row?.hasRenewed ? 'Yes' : 'No'
      },
    },
    {
      field: 'overdueDays',
      headerName: 'Overdue Days',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
      renderCell: (params) => {
        const overdueDays = params?.row?.overdueDays || 0
        return overdueDays > 0 ? (
          <strong style={{ color: 'red' }}>{overdueDays}</strong>
        ) : 0
      },
    },
    {
      field: 'borrowerName',
      headerName: 'Borrower Name',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
    },
    {
      field: 'borrowerPhoneNumber',
      headerName: 'Phone Number',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
    },
  ]

  const visibleFieldsSet = new Set(visibleFields || [])
  const columnDefs: GridColDef[] = []

  allColumnDefs.forEach((colDef) => {
    if (visibleFieldsSet.has(colDef.field)) {
      columnDefs.push(colDef)
    }
  })

  return (
    <Box sx={{ width: '100%' }}>
      <AlertDialog
        isOpen={alertProps?.isOpen}
        title={alertProps?.title}
        onYes={handleLinkUuidAndItem}
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

      {
        isNewBookAddingEnabled ? (
          <div style={{ padding: '0 0 20px 0' }}>
            <ItemEdit
              item={{
                uuid: '',
                itemTypeId: ITEM_TYPE_ID.BOOK,
                itemCategoryId: DEFAULT_CATEGORY_ID,
                status: BOOK_STATUS_AVAILABLE,
              }}
              itemCategories={itemCategories}
              itemCategoryMap={itemCategoryMap}
              onSave={handleNewBookAdded}
              dialogTitle="Add a new book"
            >
              <Button variant="contained" color="primary">Add a new book</Button>
            </ItemEdit>
          </div>
        ): null
      }

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
