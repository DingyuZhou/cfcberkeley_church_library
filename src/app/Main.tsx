'use client'

import Link from 'next/link'

import ItemSearch from 'src/app/item/Search'
import { IItemCategoryInfo } from 'src/types'
import useTisl from 'src/hooks/useTisl'

interface IProps {
  hasAdminPrivilege: boolean
  itemCategorieInfo: IItemCategoryInfo
}

export default function Main({ hasAdminPrivilege, itemCategorieInfo }: IProps) {
  const { getTisl } = useTisl()

  return (
    <div>
      <h1>{getTisl('CFC Berkeley Library')}</h1>
      <div>{getTisl('Welcome!')}</div>
      <div><Link href="/member/sign-in">{getTisl('Sign In')}</Link></div>

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
        <Link href="/item/donate">{getTisl('Donate Book')}</Link>
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
    </div>
  )
}
