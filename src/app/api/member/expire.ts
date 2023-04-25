import { type NextRequest } from 'next/server'
import { expireUserCookie } from 'src/util/jwt/auth'
import { jsonResponse } from 'src/util/jwt/utils'

export const config = {
  runtime: 'edge',
}

export default async function expire(req: NextRequest) {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: { message: 'Method not allowed' } })
  }
  return expireUserCookie(jsonResponse(200, { success: true }))
}
