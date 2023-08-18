import fs from 'fs'
import PapaParse from 'papaparse'

import { getDb } from 'src/db/models'

async function verifyUuid() {
  console.log('--- verifyUuid: begin ---')

  const { db } = getDb()

  const books = await db.models.Item.findAll()
  const bookIdUuidMap: { [id: string]: string } = {}

  books.forEach((book: any) => {
    bookIdUuidMap[book.id.toString()] = book.uuid
  })

  const bookFilePath = 'src/scripts/2023_08_17_updateBookInfo/postgres_public_item.csv'
  const csvString = fs.readFileSync(bookFilePath, { encoding: 'utf8' })

  const lines = csvString.split('\n')

  // remove null characters and empty lines
  const lineCount = lines.length
  const validLines: string[] = []
  for (let li = 0; li < lineCount; ++li) {
    lines[li] = lines[li].replace(/\u0000/g, '').trim()
    if (lines[li].length > 0) {
      validLines.push(lines[li])
    }
  }

  const cleanedString = validLines.join('\n')
  const csvData = PapaParse.parse(cleanedString, { header: true })

  const dataCount = csvData.data.length

  for (let di = 0; di < dataCount; ++di) {
    const bookData: any = csvData.data[di]

    console.log('--- --- --- --- --- ---')
    console.log(bookData)
    console.log('Correct UUID is: ', bookIdUuidMap[bookData['id'].trim()])
    console.log('--- --- --- --- --- ---')
    console.log('')

    if (bookIdUuidMap[bookData['id'].trim()] !== bookData['uuid'].trim()) {
      throw new Error('Not match !!!')
    }
  }

  console.log('--- verifyUuid: end ---')
  console.log('')
}

verifyUuid()