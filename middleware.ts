import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'gnp_session'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = req.cookies.get(COOKIE)?.value

  // Proteger /admin
  if (pathname.startsWith('/admin')) {
    if (!session) return NextResponse.redirect(new URL('/login', req.url))
    try {
      const user = JSON.parse(session)
      if (user.rol === 'vendedor' && pathname.startsWith('/admin/leads')) return NextResponse.redirect(new URL('/panel', req.url))
      if (user.rol !== 'admin' && pathname.startsWith('/admin/configuracion')) return NextResponse.redirect(new URL('/admin', req.url))
    } catch { return NextResponse.redirect(new URL('/login', req.url)) }
  }

  // Proteger /panel (inmobiliarias socias)
  if (pathname.startsWith('/panel')) {
    if (!session) return NextResponse.redirect(new URL('/login', req.url))
    try {
      const user = JSON.parse(session)
      if (!['vendedor','admin','empleado'].includes(user.rol)) return NextResponse.redirect(new URL('/', req.url))
    } catch { return NextResponse.redirect(new URL('/login', req.url)) }
  }

  // Proteger /mi-cuenta
  if (pathname.startsWith('/mi-cuenta')) {
    if (!session) return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/panel/:path*', '/mi-cuenta/:path*'],
}
