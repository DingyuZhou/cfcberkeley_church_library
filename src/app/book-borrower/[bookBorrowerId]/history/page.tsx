import { cookies } from 'next/headers'
import Link from 'next/link'

import { getDb } from 'src/db/models'
import isAdmin from 'src/util/member/isAdmin'
import { getPhoneNumberDisplayString, getOverdueDays } from 'src/util/item'
import { getDateDisplayString } from 'src/util/datetime'

import BookBorrowHistoryList from './BookBorrowHistoryList'

interface IProps {
  params: {
    bookBorrowerId: string
  }
}

async function ItemPage({ params }: IProps) {
  const { bookBorrowerId } = params
  const appCookies = cookies()
  const hasAdminPrivilege = await isAdmin(appCookies)

  if (hasAdminPrivilege) {
    const { db } = getDb()
    const bookBorrowHistoryRespone = await db.query(
      `
        SELECT
          bbh.id AS history_id,
          bb.phone_number AS borrower_phone_number,
          (bb.first_name || ' ' || bb.last_name) AS borrower_name,
          i.title AS item_title,
          i.author AS item_author,
          i.publisher AS item_publisher,
          CASE
            WHEN bbh.returned_at IS NULL THEN i.due_at
            ELSE NULL
          END AS item_due_at,
          bbh.borrowed_at,
          bbh.returned_at
        FROM book_borrower AS bb
        JOIN book_borrow_history AS bbh ON bb.id = bbh.borrower_id
        JOIN item AS i ON bbh.item_id = i.id
        WHERE bb.id = :bookBorrowerId
        ORDER BY bbh.borrowed_at DESC, bbh.returned_at DESC, item_title;
      `,
      {
        type: db.QueryTypes.SELECT,
        replacements: {
          bookBorrowerId,
        }
      },
    )

    const bookBorrowHistory = bookBorrowHistoryRespone.map((history: any) => {
      return {
        id: history?.['history_id'],
        borrowerPhoneNumber: getPhoneNumberDisplayString(history?.['borrower_phone_number']),
        borrowerName: history?.['borrower_name'],
        itemTitle: history?.['item_title'],
        itemAuthor: history?.['item_author'],
        itemPublisher: history?.['item_publisher'],
        borrowedAt: getDateDisplayString(history?.['borrowed_at']),
        returnedAt: getDateDisplayString(history?.['returned_at']),
        overdueDays: getOverdueDays(history?.['item_due_at'])
      }
    })

    return (
      <div style={{ padding: '5px 20px 60px 20px' }}>
        <div><Link href="/book-borrower/list">All Book Borrowers</Link></div>
        <h1 style={{ padding: '20px 0' }}>Book Borrow History for {bookBorrowHistory?.[0]?.borrowerName}</h1>
        <BookBorrowHistoryList bookBorrowHistory={bookBorrowHistory} />
      </div>
    )
  }

  return null
}

export default ItemPage
