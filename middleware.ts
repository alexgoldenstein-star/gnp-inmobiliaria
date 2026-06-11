import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'gnp_admin_session'
const SESSION_VALUE = process.env.ADMIN_SESSION_SECRET ?? 'gnp-secret-2025'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect all /admin routes except /login
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/login'

  if (isAdminRoute) {
    const session = req.cookies.get(SESSION_COOKIE)?.value
    if (session !== SESSION_VALUE) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
