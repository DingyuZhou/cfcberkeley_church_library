'use client'

import Link from 'next/link'
import { Grid } from '@mui/material'

import ItemSearch from 'src/app/item/Search'
import { IItemCategoryInfo } from 'src/types'
import useTisl from 'src/hooks/useTisl'

interface IProps {
  hasAdminPrivilege: boolean
  itemCategorieInfo: IItemCategoryInfo
}

export default function Main({ hasAdminPrivilege, itemCategorieInfo }: IProps) {
  const { getUiTisl } = useTisl()

  return (
    <div>
      {
        (itemCategorieInfo.itemCategorySections && itemCategorieInfo?.itemCategoryMap) ? (
          <div style={{ padding: '50px 20px 200px 20px' }}>
            <ItemSearch
              hasAdminPrivilege={hasAdminPrivilege}
              itemCategorySections={itemCategorieInfo.itemCategorySections}
              itemCategoryMap={itemCategorieInfo.itemCategoryMap}
            />
          </div>
        ) : null
      }

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
            <br /><br /><br />
            <div><Link href="/analytics">Library Analytics</Link></div>
          </div>
        ) : null
      }
    </div>
  )
}
