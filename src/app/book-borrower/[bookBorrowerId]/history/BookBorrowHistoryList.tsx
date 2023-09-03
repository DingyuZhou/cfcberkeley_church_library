'use client'

import { Box } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

interface IProps {
  bookBorrowHistory: {
    id: string
    borrowerPhoneNumber: string
    borrowerName: string
    itemTitle: string
    itemAuthor: string
    itemPublisher: string
    borrowedAt: string
    returnedAt: string
    overdueDays: number
  }[]
}

export default function BookBorrowHistoryList({ bookBorrowHistory }: IProps) {
  const columnDefs: GridColDef[] = [
    {
      field: 'borrowerPhoneNumber',
      headerName: 'Phone Number',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
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
      field: 'itemTitle',
      headerName: 'Book Title',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 3,
    },
    {
      field: 'itemAuthor',
      headerName: 'Author',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
    },
    {
      field: 'itemPublisher',
      headerName: 'Publisher',
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
      renderCell: (params) => {
        const overdueDays = params?.row?.overdueDays || 0
        return overdueDays > 0 ? (
          <strong style={{ color: 'red' }}>{params?.row?.borrowedAt}</strong>
        ) : params?.row?.borrowedAt
      },
    },
    {
      field: 'returnedAt',
      headerName: 'Returned',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
    },
  ]

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={bookBorrowHistory}
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
