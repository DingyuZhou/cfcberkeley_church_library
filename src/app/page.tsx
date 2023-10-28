import { cookies } from 'next/headers'

import isAdmin from 'src/util/member/isAdmin'
import getItemCategories from 'src/app/item/getItemCategories'

import Main from './Main'

export default async function Home() {
  const appCookies = cookies()

  const [hasAdminPrivilege, itemCategorieInfo] = await Promise.all([
    isAdmin(appCookies),
    getItemCategories(),
  ])

  return (
    <Main hasAdminPrivilege={hasAdminPrivilege} itemCategorieInfo={itemCategorieInfo} />
  )
}
