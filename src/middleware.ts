import { type NextRequest, NextResponse } from 'next/server'
import { verifyAuth, IMemberJwtPayload } from 'src/util/jwt/auth'

export const config = {
  matcher: [
    // '/',
    // '/item/:path*',
    // '/item-category/:path*',
  ],
}

export async function middleware(req: NextRequest) {
  // validate the member's JWT is still available
  let jwtPayload: IMemberJwtPayload | null = null

  try {
    jwtPayload = await verifyAuth(req)
  } catch (error) {
    return NextResponse.redirect(new URL('/member/sign-in', req.url))
  }

  if (!jwtPayload) {
    // if this an API request, respond with JSON
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ 'error': { message: 'authentication required' } }),
        { status: 401 });
    }
    // otherwise, redirect to the user sign in page
    else {
      return NextResponse.redirect(new URL('/member/sign-in', req.url))
    }
  }

  return NextResponse.next()
}
