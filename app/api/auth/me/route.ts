import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ user: null })
  return NextResponse.json({ user: { nombre: user.nombre, rol: user.rol, email: user.email } })
}
