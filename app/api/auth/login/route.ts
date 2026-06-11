import { NextRequest, NextResponse } from 'next/server'
import { loginWithCredentials, createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
    }

    const user = await loginWithCredentials(email, password)

    if (!user) {
      return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 })
    }

    // Solo roles con acceso al admin
    if (user.rol === 'cliente') {
      return NextResponse.json({ error: 'No tenés acceso al panel de administración' }, { status: 403 })
    }

    await createSession(user)
    return NextResponse.json({ success: true, rol: user.rol, nombre: user.nombre })
  } catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
