import { type NextRequest } from 'next/server'
import { setUserCookie, expireUserCookie } from 'src/util/jwt/auth'
import { jsonResponse } from 'src/util/jwt/utils'
import { getDb } from 'src/db/models'

export async function GET(req: NextRequest) {
  return expireUserCookie(jsonResponse(333, { info: 'member sign out' }))
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: { message: 'Method not allowed' } })
  }

  const { email, password } = await req.json()

  const { db } = getDb()
  const response = await db.query(
    `
      SELECT
        session_token,
        session_secret
      FROM authenticate(:email, :password);
    `,
    {
      replacements: {
        email,
        password,
      },
      type: db.QueryTypes.SELECT,
    },
  )

  try {
    if (response?.[0]?.['session_token']) {
      return await setUserCookie({
        sessionToken: response?.[0]?.['session_token'],
        sessionSecret: response?.[0]?.['session_secret'],
      }, jsonResponse(200, { success: true }))
    }
  } catch (err) {
    console.error(err)
  }

  return jsonResponse(500, { error: { message: 'The email or password may not be correct' } })
}
