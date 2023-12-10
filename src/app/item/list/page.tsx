import { cookies } from 'next/headers'

import { getDb } from 'src/db/models'
import { IItem } from 'src/types'
import isAdmin from 'src/util/member/isAdmin'

import formatItemDataFromDb from '../formatItemDataFromDb'
import getItemCategories from '../getItemCategories'
import ItemList from '../ItemList'
import BookListCsvDownload from './BookListCsvDownload'

const escapeForCsv = (str?: string) => {
  if (!str) {
    return ''
  }
  // Replace double quotes with two double quotes
  const escapedStr = str.replace(/"/g, '""');
  // Wrap the string in double quotes if it contains a comma
  return str.includes(',') ? `"${escapedStr}"` : escapedStr;
}

async function ItemListPage() {
  const appCookies = cookies()
  const { db, models } = getDb()

  const [
    hasAdminPrivilege,
    allItemsResponse,
    itemCategoryInfo,
    bookCountResponse,
  ] = await Promise.all([
    isAdmin(appCookies),
    models.Item.findAll({
      order: [
        ['itemCategoryId', 'ASC'],
        ['libraryNumber', 'ASC'],
        ['title', 'ASC'],
        ['author', 'ASC'],
        ['id', 'ASC'],
      ],
    }),
    getItemCategories(),
    db.query(
      `
        SELECT
          i.status::TEXT AS status,
          COUNT(i.id)::INTEGER AS book_count
        FROM item AS i
        JOIN item_type AS it ON i.item_type_id = it.id
        WHERE it.name = 'Book'
        GROUP BY i.status
        ORDER BY i.status;
      `,
      {
        type: db.QueryTypes.SELECT,
      },
    )
  ])

  const allItems: IItem[] = []
  if (Array.isArray(allItemsResponse)) {
    allItemsResponse.forEach((rawItemData) => {
      const formattedItemData = formatItemDataFromDb(rawItemData, itemCategoryInfo.itemCategoryMap)
      if (formattedItemData) {
        allItems.push(formattedItemData)
      }
    })
  }

  if (hasAdminPrivilege) {
    const tdStyle = {
      border: '1px solid gray',
      padding: '5px 10px',
    }

    const itemListCsvData: {
      [key: string]: string
    }[] = allItems.map((item) => {
      return {
        bookId: escapeForCsv(item.itemId),
        title: escapeForCsv(item.title),
        author: escapeForCsv(item.author),
        translator: escapeForCsv(item.translator),
        publisher: escapeForCsv(item.publisher),
        libraryNumber: escapeForCsv(item.libraryNumber),
        category: escapeForCsv(item.categorySection),
        subCategory: escapeForCsv(item.category),
        status: escapeForCsv(item.status),
        note: escapeForCsv(item.note),
      }
    }).sort((bookA, bookB) => {
      // Convert bookId to numbers for numeric comparison
      const bookIdA = parseInt(bookA.bookId);
      const bookIdB = parseInt(bookB.bookId);

      // Compare bookId values
      if (bookIdA < bookIdB) {
        return -1;
      } else if (bookIdA > bookIdB) {
        return 1;
      } else {
        return 0;
      }
    })

    const itemListCsvHeader = [
      { id: 'bookId', displayName: 'Book ID' },
      { id: 'title', displayName: 'Title' },
      { id: 'author', displayName: 'Author' },
      { id: 'translator', displayName: 'Translator' },
      { id: 'publisher', displayName: 'Publisher' },
      { id: 'libraryNumber', displayName: 'Library Number' },
      { id: 'category', displayName: 'Category' },
      { id: 'subCategory', displayName: 'Subcategory' },
      { id: 'status', displayName: 'Book Status' },
      { id: 'note', displayName: 'Note' },
    ]

    return (
      <div style={{ padding: '5px 20px 60px 20px' }}>
        <h1 style={{ paddingBottom: '20px' }}>All Books</h1>

        <table style={{
          margin: '0 0 20px 0',
          tableLayout: 'fixed',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'left',
          border: '2px solid gray',
          borderCollapse: 'collapse',
        }}>
          <thead>
            <tr>
              <th style={tdStyle}>BOOK STATUS</th>
              <th style={tdStyle}>BOOK COUNT</th>
            </tr>
          </thead>

          <tbody>
            {
              bookCountResponse.map((rawData: any) => {
                return (
                  <tr key={rawData['status']}>
                    <td style={tdStyle}>{rawData['status']}</td>
                    <td style={tdStyle}>{rawData['book_count']}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

        <div style={{ padding: '0 0 20px 0' }}>
          <BookListCsvDownload bookList={itemListCsvData} header={itemListCsvHeader} />
        </div>

        <ItemList
          allItems={allItems}
          itemCategories={itemCategoryInfo.itemCategories}
          itemCategoryMap={itemCategoryInfo.itemCategoryMap}
          visibleFields={[
            'edit',
            'title',
            'author',
            'publisher',
            'category',
            'categorySection',
            'libraryNumber',
            'status',
          ]}
          isNewBookAddingEnabled={true}
        />
      </div>
    )
  }

  return null
}

export default ItemListPage
