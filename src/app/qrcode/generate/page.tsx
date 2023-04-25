import { cookies } from 'next/headers'

import isAdmin from 'src/util/member/isAdmin'

import PrintQrcodes from './PrintQrcodes'

export default async function Home() {
  const appCookies = cookies()
  const hasAdminPrivilege = await isAdmin(appCookies)

  if (hasAdminPrivilege) {
    return <PrintQrcodes />
  }

  return null
}