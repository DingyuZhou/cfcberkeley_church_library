import type { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { SignJWT, jwtVerify } from 'jose'
import { USER_TOKEN, getJwtSecretKey } from './constants'

export interface IMemberInfo {
  sessionToken: string
  sessionSecret: string
}

export interface IMemberJwtPayload extends IMemberInfo {
  jti: string
  iat: number
}

export class AuthError extends Error {}

/**
 * Verifies the user's JWT token and returns its payload if it's valid.
 */
export async function verifyJwtFromCookies(appCookies: any) {
  const jwt = appCookies.get(USER_TOKEN)?.value

  if (!jwt) throw new AuthError('Missing user token')

  let jwtPayload: any = null

  try {
    const verified = await jwtVerify(
      jwt,
      new TextEncoder().encode(getJwtSecretKey())
    )
    jwtPayload = verified.payload as any
  } catch (err) {
    throw new AuthError('Your token has expired.')
  }

  if (jwtPayload?.sessionToken && jwtPayload?.sessionSecret) {
    const memberJwtPayload: IMemberJwtPayload = jwtPayload
    return memberJwtPayload
  }

  throw new AuthError('Your token is invalid.')
}

export async function verifyAuth(req: NextRequest) {
  return verifyJwtFromCookies(req.cookies)
}

/**
 * Adds the user token cookie to a response.
 */
export async function setUserCookie(memberInfo: IMemberInfo, res: NextResponse) {
  const token = await new SignJWT({ ...memberInfo })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(getJwtSecretKey()))

  res.cookies.set(USER_TOKEN, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 24 hours in seconds
  })

  return res
}

/**
 * Expires the user token cookie
 */
export function expireUserCookie(res: NextResponse) {
  res.cookies.set(USER_TOKEN, '', { httpOnly: true, maxAge: 0 })
  return res
}
