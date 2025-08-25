'use client'

import { Box, Typography, Paper, Button } from '@mui/material'
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { getDateDisplayString } from 'src/util/datetime'
import { getPhoneNumberDisplayString } from 'src/util/item'
import CsvDownloader from 'react-csv-downloader'

interface AnalyticsTableProps {
  title: string
  data: any[]
  columns: GridColDef[]
  loading: boolean
  csvFilename: string
}

function CustomToolbar({ data, columns, filename }: { data: any[], columns: GridColDef[], filename: string }) {
  // Filter out hidden columns and prepare CSV data with proper headers
  const csvColumns = columns.filter(col => col.field && col.field !== 'borrowDateRaw' && col.field !== 'id')
  
  const csvData = data.map(row => {
    const csvRow: any = {}
    csvColumns.forEach(col => {
      const headerName = col.headerName || col.field
      csvRow[headerName] = row[col.field!]
    })
    return csvRow
  })

  return (
    <GridToolbarContainer>
      <CsvDownloader
        filename={filename}
        datas={csvData}
        columns={csvColumns.map(col => ({ 
          id: col.headerName || col.field!, 
          displayName: col.headerName || col.field! 
        }))}
        separator=","
        wrapColumnChar='"'
      >
        <Button size="small">Export to CSV</Button>
      </CsvDownloader>
    </GridToolbarContainer>
  )
}

function AnalyticsTable({ title, data, columns, loading, csvFilename }: AnalyticsTableProps) {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          loading={loading}
          autoHeight
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 15,
              },
            },
          }}
          pageSizeOptions={[15, 30, 50, 100]}
          disableRowSelectionOnClick
          slots={{
            toolbar: () => <CustomToolbar data={data} columns={columns} filename={csvFilename} />
          }}
        />
      </Box>
    </Paper>
  )
}

export default function AnalyticsTables() {
  const [yearlyBooksData, setYearlyBooksData] = useState<any[]>([])
  const [yearlyUsersData, setYearlyUsersData] = useState<any[]>([])
  const [borrowHistoryData, setBorrowHistoryData] = useState<any[]>([])
  const [categoryStatsData, setCategoryStatsData] = useState<any[]>([])
  const [overdueBooksData, setOverdueBooksData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [yearlyBooks, yearlyUsers, borrowHistory, categoryStats, overdueBooks] = await Promise.all([
          fetch('/api/analytics/books-borrowed-yearly').then(res => res.json()),
          fetch('/api/analytics/users-registered-yearly').then(res => res.json()),
          fetch('/api/analytics/borrow-history').then(res => res.json()),
          fetch('/api/analytics/category-stats').then(res => res.json()),
          fetch('/api/analytics/overdue-books').then(res => res.json()),
        ])

        setYearlyBooksData(yearlyBooks.map((item: any, index: number) => ({ 
          id: index, 
          year: item.year,
          numOfBookBorrowed: parseInt(item.num_of_book_borrowed)
        })))
        
        setYearlyUsersData(yearlyUsers.map((item: any, index: number) => ({ 
          id: index,
          year: item.year,
          numOfBorrowerRegistered: parseInt(item.num_of_borrower_registered)
        })))
        
        setBorrowHistoryData(borrowHistory.map((item: any, index: number) => ({ 
          id: index,
          borrowDate: getDateDisplayString(item.borrow_date),
          borrowDateRaw: item.borrow_date,
          book: item.book,
          bookCategory: item.book_category
        })))
        
        setCategoryStatsData(categoryStats.map((item: any, index: number) => ({ 
          id: index,
          bookCategory: item.book_category,
          numBookBorrowed: parseInt(item.num_book_borrowed_in_category)
        })))
        
        setOverdueBooksData(overdueBooks.map((item: any, index: number) => ({ 
          id: index,
          borrowDate: getDateDisplayString(item.borrow_date),
          borrowDateRaw: item.borrow_date,
          borrowerName: item.borrower_name,
          borrowerPhoneNumber: getPhoneNumberDisplayString(item.borrower_phone_number),
          notReturnedBook: item.not_returned_book,
          bookCategory: item.book_category,
          bookLibraryNumber: item.book_library_number
        })))
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const yearlyBooksColumns: GridColDef[] = [
    { field: 'year', headerName: 'Year', width: 150 },
    { field: 'numOfBookBorrowed', headerName: 'Number of Books Borrowed', flex: 1 },
  ]

  const yearlyUsersColumns: GridColDef[] = [
    { field: 'year', headerName: 'Year', width: 150 },
    { field: 'numOfBorrowerRegistered', headerName: 'Number of Users Registered', flex: 1 },
  ]

  const borrowHistoryColumns: GridColDef[] = [
    { 
      field: 'borrowDate', 
      headerName: 'Borrow Date', 
      width: 150,
      sortComparator: (v1, v2, param1, param2) => {
        const date1 = new Date(param1.api.getCellValue(param1.id, 'borrowDateRaw'))
        const date2 = new Date(param2.api.getCellValue(param2.id, 'borrowDateRaw'))
        return date1.getTime() - date2.getTime()
      }
    },
    { field: 'book', headerName: 'Book', flex: 1 },
    { field: 'bookCategory', headerName: 'Category', width: 200 },
  ]

  const categoryStatsColumns: GridColDef[] = [
    { field: 'bookCategory', headerName: 'Book Category', flex: 1 },
    { field: 'numBookBorrowed', headerName: 'Number Borrowed', width: 200 },
  ]

  const overdueBooksColumns: GridColDef[] = [
    { 
      field: 'borrowDate', 
      headerName: 'Borrow Date', 
      width: 120,
      sortComparator: (v1, v2, param1, param2) => {
        const date1 = new Date(param1.api.getCellValue(param1.id, 'borrowDateRaw'))
        const date2 = new Date(param2.api.getCellValue(param2.id, 'borrowDateRaw'))
        return date1.getTime() - date2.getTime()
      }
    },
    { field: 'borrowerName', headerName: 'Borrower', width: 150 },
    { field: 'borrowerPhoneNumber', headerName: 'Phone', width: 150 },
    { field: 'notReturnedBook', headerName: 'Book', flex: 1 },
    { field: 'bookCategory', headerName: 'Category', width: 150 },
    { field: 'bookLibraryNumber', headerName: 'Library #', width: 120 },
  ]

  return (
    <div>
      <AnalyticsTable
        title="Books Borrowed Each Year"
        data={yearlyBooksData}
        columns={yearlyBooksColumns}
        loading={loading}
        csvFilename="books_borrowed_yearly.csv"
      />
      
      <AnalyticsTable
        title="Users Registered Each Year"
        data={yearlyUsersData}
        columns={yearlyUsersColumns}
        loading={loading}
        csvFilename="users_registered_yearly.csv"
      />
      
      <AnalyticsTable
        title="Most Borrowed Book Categories"
        data={categoryStatsData}
        columns={categoryStatsColumns}
        loading={loading}
        csvFilename="book_categories_stats.csv"
      />
      
      <AnalyticsTable
        title="Book Borrow History (Past 10 Years)"
        data={borrowHistoryData}
        columns={borrowHistoryColumns}
        loading={loading}
        csvFilename="book_borrow_history.csv"
      />
      
      <AnalyticsTable
        title="Books Past Due Date"
        data={overdueBooksData}
        columns={overdueBooksColumns}
        loading={loading}
        csvFilename="overdue_books.csv"
      />
    </div>
  )
}