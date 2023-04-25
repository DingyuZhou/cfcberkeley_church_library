import getMemberInfoFromCookies from './getMemberInfoFromCookies'

async function isAdmin(cookies: any) {
  const memberInfo = await getMemberInfoFromCookies(cookies)

  if (memberInfo && memberInfo.role === 'ADMIN') {
    return true
  }

  return false
}

export default isAdmin
