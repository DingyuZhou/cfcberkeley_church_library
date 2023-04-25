import { cookies } from 'next/headers'

import isAdmin from 'src/util/member/isAdmin'
import getItemCategories from 'src/app/item/getItemCategories'

import Main from './Main'

async function ItemCategoryListPage() {
  const appCookies = cookies()

  const [hasAdminPrivilege, itemCategoryInfo] = await Promise.all([
    isAdmin(appCookies),
    getItemCategories(),
  ])

  if (hasAdminPrivilege) {
    return (
      <Main allItemCategories={itemCategoryInfo.itemCategories} />
    )
  }

  return null
}

export default ItemCategoryListPage
