import Link from 'next/link'
import { cookies } from 'next/headers'

import isAdmin from 'src/util/member/isAdmin'
import ItemSearch from 'src/app/item/Search'

export default async function Home() {
  const appCookies = cookies()
  const hasAdminPrivilege = await isAdmin(appCookies)

  return (
    <main>
      <h1>CFC Berkeley Library</h1>
      <div>Welcome!</div>
      <div><Link href="/member/sign-in">Sign In</Link></div>

      <div style={{ padding: '30px 20px' }}>
        <ItemSearch />
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
          </div>
        ) : null
      }
    </main>
  )
}
