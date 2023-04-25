'use client'

import { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import { IItemCategory } from 'src/types'

import ItemCategoryEdit from './ItemCategoryEdit'

interface IProps {
  allItemCategories: IItemCategory[]
}

interface tableRowData extends IItemCategory {
  id?: string
}

export default function ItemCategoryList({ allItemCategories }: IProps) {
  const [tableRows, setTableRows] = useState<tableRowData[]>([])

  useEffect(() => {
    const initialTableRows = (allItemCategories || []).map((itemCategoryData: IItemCategory) => {
      return {
        ...itemCategoryData,
        id: itemCategoryData?.categoryId,
      }
    })
    setTableRows(initialTableRows)
  }, [allItemCategories])

  const handleItemCategorySave = (savedItemCategory?: IItemCategory) => {
    if (savedItemCategory) {
      const newTableRows = [...tableRows]
      const itemRowIndex = newTableRows.findIndex((rowData) => {
        return (rowData.categoryId === savedItemCategory.categoryId)
      })
      if (itemRowIndex >= 0) {
        newTableRows[itemRowIndex] = {
          ...savedItemCategory,
          id: savedItemCategory.categoryId
        }
      } else {
        newTableRows.unshift({
          ...savedItemCategory,
          id: savedItemCategory.categoryId
        })
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
          <ItemCategoryEdit
            itemCategory={params?.row}
            onSave={handleItemCategorySave}
          >
            <Button fullWidth variant="contained" color="info">
              Edit
            </Button>
          </ItemCategoryEdit>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      filterable: true,
      hideable: false,
      minWidth: 250,
      flex: 3,
    },
    {
      field: 'libraryNumber',
      headerName: 'Library Number',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 3,
    },
    {
      field: 'section',
      headerName: 'Section',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 3,
    },
    {
      field: 'location',
      headerName: 'Location',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
    },
  ]

  return (
    <Box sx={{ width: '100%' }}>
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
