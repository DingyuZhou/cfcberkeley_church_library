import { cookies } from 'next/headers'

import { getDb } from 'src/db/models'
import isAdmin from 'src/util/member/isAdmin'
import { getPhoneNumberDisplayString } from 'src/util/item'
import { getDateDisplayString } from 'src/util/datetime'

import BookBorrowerList from './BookBorrowerList'

async function BookBorrowerListPage() {
  const appCookies = cookies()

  const hasAdminPrivilege = await isAdmin(appCookies)

  if (hasAdminPrivilege) {
    const { db } = getDb()
    const bookBorrowersRespone = await db.query(
      `
        SELECT
          bb.id AS borrower_id,
          bb.phone_number AS borrower_phone_number,
          (bb.first_name || ' ' || bb.last_name) AS borrower_name,
          COUNT(DISTINCT i.id) AS num_book_currently_borrrowed,
          COUNT(DISTINCT bbh.id) AS num_book_total_borrowed,
          MAX(bbh.borrowed_at) AS last_borrowed_at
        FROM book_borrower AS bb
        LEFT JOIN item AS i ON bb.id = i.borrower_id
        JOIN book_borrow_history AS bbh ON bb.id = bbh.borrower_id
        WHERE bb.is_phone_number_verified IS TRUE
        GROUP BY bb.id, borrower_name, borrower_phone_number
        ORDER BY last_borrowed_at DESC, borrower_name;
      `,
      {
        type: db.QueryTypes.SELECT,
      },
    )

    const bookBorrowers = bookBorrowersRespone.map((borrower: any) => {
      return {
        id: borrower?.['borrower_id'],
        borrowerId: borrower?.['borrower_id'],
        borrowerPhoneNumber: getPhoneNumberDisplayString(borrower?.['borrower_phone_number']),
        borrowerName: borrower?.['borrower_name'],
        numBookCurrentlyBorrrowed: borrower?.['num_book_currently_borrrowed'],
        numBookTotalBorrowed: borrower?.['num_book_total_borrowed'],
        lastBorrowedAt: getDateDisplayString(borrower?.['last_borrowed_at']),
      }
    })

    return (
      <div style={{ padding: '5px 20px 60px 20px' }}>
        <h1 style={{ paddingBottom: '20px' }}>All Book Borrowers</h1>
        <BookBorrowerList bookBorrowers={bookBorrowers} />
      </div>
    )
  }

  return null
}

export default BookBorrowerListPage
