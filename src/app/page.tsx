import Link from 'next/link'
import { cookies } from 'next/headers'

import isAdmin from 'src/util/member/isAdmin'
import ItemSearch from 'src/app/item/Search'

import getItemCategories from './item/getItemCategories'

export default async function Home() {
  const appCookies = cookies()

  const [hasAdminPrivilege, itemCategorieInfo] = await Promise.all([
    isAdmin(appCookies),
    getItemCategories(),
  ])

  return (
    <main>
      <h1>CFC Berkeley Library</h1>
      <div>Welcome!</div>
      <div><Link href="/member/sign-in">Sign In</Link></div>

      {
        (itemCategorieInfo.itemCategorySections && itemCategorieInfo?.itemCategoryMap) ? (
          <div style={{ padding: '30px 20px' }}>
            <ItemSearch
              hasAdminPrivilege={hasAdminPrivilege}
              itemCategorySections={itemCategorieInfo.itemCategorySections}
              itemCategoryMap={itemCategorieInfo.itemCategoryMap}
            />
          </div>
        ) : null
      }

      <div style={{ padding: '30px 0' }}>
        <Link href="/item/donate">Donate Book</Link>
      </div>

      {
        hasAdminPrivilege ? (
          <div>
            <h3>Book manangement</h3>
            <div><Link href="/qrcode/generate">Generate QRCodes</Link></div>
            <br />
            <div><Link href="/item/list">All Books</Link></div>
            <br />
            <div><Link href="/item-category/list">All Book Categories</Link></div>
            <br /><br /><br />
            <div><Link href="/item/borrowed">All Borrowed Books</Link></div>
            <br />
            <div><Link href="/book-borrower/list">All Book Borrowers</Link></div>
            <br />
          </div>
        ) : null
      }
    </main>
  )
}
