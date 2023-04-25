import fs from 'fs'
import PapaParse from 'papaparse'

import { getDb } from 'src/db/models'
import chineseConverter from 'src/util/chineseConverter'

function getCategoryInfo(rowData: string[]) {
  if (
    rowData[2]
    && !rowData[0]
    && !rowData[1]
    && !rowData[3]
  ) {
    const category = rowData[2].trim().replace(/\s+/g, ' ').split(' ')
    const categoryNumber = category.shift()
    const categoryName = category.join(' ').trim()
    if (!isNaN(parseInt(categoryNumber || '', 10))) {
      return {
        categoryName,
        categoryNumber,
      }
    }
  }
  return null
}

function getSubCategoryInfo(rowData: string[]) {
  if (
    rowData[0]
    && !rowData[1]
    && !rowData[2]
    && !rowData[3]
  ) {
    const subCategory = rowData[0].trim().replace(/\s+/g, ' ').split(' ')
    if (!isNaN(parseInt(subCategory[1] || '', 10))) {
      subCategory.shift()
    }
    const subCategoryNumber = subCategory.shift()
    const subCategoryName = subCategory.join(' ').trim()
    if (!isNaN(parseInt(subCategoryNumber || '', 10))) {
      return {
        subCategoryName,
        subCategoryNumber,
      }
    }
  }
  return null
}

function getBookInfo(rowData: string[]) {
  if (rowData[1]) {
    const title = rowData[1].trim()
    if (title !== '书名') {
      return {
        libraryNumber: rowData[0].trim(),
        title: chineseConverter(title.replace(/\s+/g, ' ')),
        author: chineseConverter(rowData[2].trim().replace(/\s+/g, ' ')),
        translator: chineseConverter(rowData[3].trim().replace(/\s+/g, ' ')),
        publisher: chineseConverter(rowData[4].trim().replace(/\s+/g, ' ')),
        bookCount: parseInt(rowData[5], 10) || 1,
      }
    }
  }
  return null
}

async function ingestBookInfo() {
  console.log('--- ingestBookInfo: begin ---')

  const { db } = getDb()

  const bookType = await db.models.ItemType.findOne({ name: 'Book' })
  const bookTypeId = bookType.id

  const bookInfoFilePath = '/tmp/cfcberkeley/CFC Berkeley library book list - CFC Library Catalog(revised).csv'
  const csvString = fs.readFileSync(bookInfoFilePath, { encoding: 'utf8' })

  const lines = csvString.split('\n')
  lines.splice(0, 3)

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
  const csvData = PapaParse.parse(cleanedString, { header: false })
  const rowCount = csvData.data.length

  let section: string | null = null
  let currentSubCategoryId: number = -1

  for (let ri = 0; ri < rowCount; ++ri) {
    const rowData = csvData.data[ri] as string[]
    const categoryInfo = getCategoryInfo(rowData)

    if (categoryInfo) {
      section = `${categoryInfo.categoryNumber} - ${categoryInfo.categoryName}`
    }

    const subCategoryInfo = getSubCategoryInfo(rowData)
    if (subCategoryInfo) {
      const newSubCategory = await db.models.ItemCategory.bulkCreate([{
        section,
        itemTypeId: bookTypeId,
        name: subCategoryInfo.subCategoryName,
        libraryNumber: subCategoryInfo.subCategoryNumber,
      }], { updateOnDuplicate: ['section', 'libraryNumber', 'updatedAt'] })

      currentSubCategoryId = newSubCategory[0].id
    }

    const bookInfo = getBookInfo(rowData)
    if (bookInfo) {
      for (let bi = 0; bi < bookInfo.bookCount; ++bi) {
        await db.models.Item.bulkCreate([{
          ...bookInfo,
          itemTypeId: bookTypeId,
          itemCategoryId: currentSubCategoryId,
          uuid: `temp-${bookInfo.title}-${bi}`
        }], { updateOnDuplicate: ['updatedAt'] })
      }
    }
  }

  console.log('--- ingestBookInfo: end ---')
  console.log('')
}

ingestBookInfo()