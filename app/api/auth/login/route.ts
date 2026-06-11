import { NextRequest, NextResponse } from 'next/server'
import { setSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const correct = process.env.ADMIN_PASSWORD ?? 'gnp2025'
  if (password !== correct) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }
  await setSession()
  return NextResponse.json({ success: true })
}
