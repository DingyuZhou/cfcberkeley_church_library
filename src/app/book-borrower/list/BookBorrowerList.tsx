'use client'

import { Box } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'

import { SUGGESTED_MAX_NUM_BOOKS_CONCURRENTLY_BORROWED } from 'src/constants'

interface IProps {
  bookBorrowers: {
    id: string
    borrowerId: string
    borrowerName: string
    borrowerPhoneNumber: string
    numBookCurrentlyBorrrowed: number
    numBookTotalBorrowed: number
    lastBorrowedAt: string
  }[]
}

export default function BookBorrowerList({ bookBorrowers }: IProps) {
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
      renderCell: (params) => {
        return (
          <Link href={`/book-borrower/${params?.row?.borrowerId}/history`}>{params?.row?.borrowerName}</Link>
        )
      },
    },
    {
      field: 'numBookCurrentlyBorrrowed',
      headerName: '# Currently Borrrowed',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
      renderCell: (params) => {
        const numBookCurrentlyBorrrowed = params?.row?.numBookCurrentlyBorrrowed || 0
        return numBookCurrentlyBorrrowed > SUGGESTED_MAX_NUM_BOOKS_CONCURRENTLY_BORROWED ? (
          <strong style={{ color: 'red' }}>{numBookCurrentlyBorrrowed}</strong>
        ) : numBookCurrentlyBorrrowed
      },
    },
    {
      field: 'numBookTotalBorrowed',
      headerName: '# Total Borrrowed',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
    },
    {
      field: 'lastBorrowedAt',
      headerName: 'Last Borrowed',
      filterable: true,
      hideable: true,
      minWidth: 200,
      flex: 2,
    },
  ]

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={bookBorrowers}
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
