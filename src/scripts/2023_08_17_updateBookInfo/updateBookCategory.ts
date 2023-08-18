import fs from 'fs'
import PapaParse from 'papaparse'

import { getDb } from 'src/db/models'
import chineseConverter from 'src/util/chineseConverter'

async function updateBookCategory() {
  console.log('--- updateBookCategory: begin ---')

  const { db } = getDb()

  const bookType = await db.models.ItemType.findOne({ name: 'Book' })
  const bookTypeId = bookType.id

  const bookCategoryFilePath = 'src/scripts/2023_08_17_updateBookInfo/book_edit_template - Book Category.csv'
  const csvString = fs.readFileSync(bookCategoryFilePath, { encoding: 'utf8' })

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
  let bulkData = []

  for (let di = 0; di < dataCount; ++di) {
    const data: any = csvData.data[di]

    const bookCategory = {
      name: chineseConverter(data['Name'].trim()),
      section: chineseConverter(data['Section'].trim()),
      itemTypeId: bookTypeId,
      libraryNumber: chineseConverter(data['Library Number'].trim()),
      location: null,
      details: null,
    }

    bulkData.push(bookCategory)
  }

  await db.models.ItemCategory.bulkCreate(bulkData, {
    updateOnDuplicate: [
      'libraryNumber',
      'location',
      'details',
    ],
  })

  console.log('--- updateBookCategory: end ---')
  console.log('')
}

updateBookCategory()