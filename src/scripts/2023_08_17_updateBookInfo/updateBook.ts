import fs from 'fs'
import PapaParse from 'papaparse'
import { v4 as uuidv4 } from 'uuid'

import { getDb } from 'src/db/models'
import chineseConverter from 'src/util/chineseConverter'

async function updateBook() {
  console.log('--- updateBook: begin ---')

  const { db } = getDb()

  const bookType = await db.models.ItemType.findOne({ name: 'Book' })
  const bookTypeId = bookType.id

  const bookCategories = await db.models.ItemCategory.findAll()
  const bookCategoryIdMap: { [categoryKey: string]: number } = {}

  bookCategories.forEach((category: any) => {
    bookCategoryIdMap[`${category.name} |||| ${category.section}`] = category.id
  })

  const bookFilePath = 'src/scripts/2023_08_17_updateBookInfo/book_edit_template - Book.csv'
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

    const bookCategory = `${chineseConverter(bookData['Category 2'].trim())} |||| ${chineseConverter(bookData['Book Category 1'].trim())}`
    const rawBookStatus = bookData['Status'].trim()

    let bookStatus = 'AVAILABLE'
    if (rawBookStatus) {
      if (rawBookStatus === 'deleted') {
        bookStatus = 'DELETED'
      } else if (rawBookStatus === 'missing') {
        bookStatus = 'MISSING'
      } else {
        throw new Error(`Found unknown book status: ${JSON.stringify(bookData)}`)
      }
    }

    const book = {
      id: parseInt(bookData['ID'].trim()),
      uuid: `temp-${uuidv4()}`,
      itemTypeId: bookTypeId,
      itemCategoryId: bookCategoryIdMap[bookCategory] || -2,
      title: chineseConverter(bookData['Title'].trim()),
      author: chineseConverter(bookData['Author'].trim()),
      translator: chineseConverter(bookData['Translator'].trim()),
      publisher: chineseConverter(bookData['Publisher'].trim()),
      libraryNumber: chineseConverter(bookData['Library Number'].trim()),
      status: bookStatus,
    }

    const updatedBook = await db.query(
      `
        INSERT INTO item (id, uuid, item_type_id, item_category_id, title, author, translator, publisher, library_number, status, updated_at)
        VALUES (:id, :uuid, :itemTypeId, :itemCategoryId, :title, :author, :translator, :publisher, :libraryNumber, :status, NOW())
        ON CONFLICT (id) DO UPDATE
        SET item_type_id = excluded.item_type_id,
          item_category_id = excluded.item_category_id,
          title = excluded.title,
          author = excluded.author,
          translator = excluded.translator,
          publisher = excluded.publisher,
          library_number = excluded.library_number,
          status = excluded.status,
          updated_at = excluded.updated_at
        RETURNING *;
      `,
      {
        type: db.QueryTypes.SELECT,
        replacements: book,
      },
    )

    console.log('--- --- --- --- --- ---')
    console.log('--- Book to update: ', book)
    console.log('--- Updated book: ', updatedBook)
    console.log('--- --- --- --- --- ---')
    console.log('')
  }

  console.log('--- updateBook: end ---')
  console.log('')
}

updateBook()