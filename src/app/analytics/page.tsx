import { cookies } from 'next/headers'
import isAdmin from 'src/util/member/isAdmin'
import AnalyticsTables from './AnalyticsTables'

export default async function AnalyticsPage() {
  const appCookies = cookies()
  const hasAdminPrivilege = await isAdmin(appCookies)

  if (!hasAdminPrivilege) {
    return (
      <div style={{ padding: '5px 20px 60px 20px' }}>
        <h1>Unauthorized</h1>
        <p>You need admin privileges to view this page.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '5px 20px 60px 20px' }}>
      <h1 style={{ paddingBottom: '20px' }}>Library Analytics</h1>
      <AnalyticsTables />
    </div>
  )
}