'use client'

import CsvDownloader from 'react-csv-downloader'
import { Button } from '@mui/material'

interface IProps {
  bookList: {
    [key: string]: string
  }[]
  header: {
    id: string
    displayName: string
  }[]
}

export default function BookListCsvDownload({ bookList, header }: IProps) {
  return (
    <CsvDownloader datas={bookList} columns={header} filename="book_list.csv">
      <Button variant="contained" color="primary">Download the Book List</Button>
    </CsvDownloader>
  )
}