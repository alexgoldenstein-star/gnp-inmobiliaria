import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'gnp_session'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin')) {
    const session = req.cookies.get(COOKIE)?.value
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    try {
      const user = JSON.parse(session)
      // Vendedor solo puede acceder a sus propiedades
      if (user.rol === 'vendedor' && pathname.startsWith('/admin/leads')) {
        return NextResponse.redirect(new URL('/admin/propiedades', req.url))
      }
      // Config solo para admin
      if (user.rol !== 'admin' && pathname.startsWith('/admin/configuracion')) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
