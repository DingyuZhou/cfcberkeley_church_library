import { getDb } from 'src/db/models'
import { verifyJwtFromCookies, IMemberJwtPayload } from 'src/util/jwt/auth'

async function getMemberInfoFromCookies(cookies: any) {
  let jwtPayload: IMemberJwtPayload | null = null

  try {
    jwtPayload = await verifyJwtFromCookies(cookies)
  } catch (error) {
    console.log(`Fail to verify member's JWT`)
  }

  if (jwtPayload) {
    const { db } = getDb()
    const memberInfoRespone = await db.query(
      `
        SELECT
          m.id AS member_id,
          m.first_name,
          m.last_name,
          m.role::TEXT AS role
        FROM member_session AS ms
        JOIN member AS m ON ms.member_id = m.id
        WHERE ms.token = :sessionToken
          AND ms.secret_hash = CRYPT(:sessionSecret, ms.secret_hash)
          AND ms.created_at > (NOW() - INTERVAL '1 MONTH')
        LIMIT 1;
      `,
      {
        replacements: {
          sessionToken: jwtPayload.sessionToken,
          sessionSecret: jwtPayload.sessionSecret,
        },
        type: db.QueryTypes.SELECT,
      },
    )

    const rawMemberInfoData = memberInfoRespone?.[0]
    if (rawMemberInfoData) {
      return {
        memberId: rawMemberInfoData['member_id'],
        firstName: rawMemberInfoData['first_name'],
        lastName: rawMemberInfoData['last_name'],
        role: rawMemberInfoData['role'],
      }
    }
  }

  return null
}

export default getMemberInfoFromCookies
