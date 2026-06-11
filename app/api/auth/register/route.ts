import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, password, telefono, tipo, empresa } = await req.json()
    if (!nombre || !email || !password) return NextResponse.json({ error: 'Campos requeridos' }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 })

    const rol = tipo === 'vendedor' ? 'vendedor' : 'cliente'
    const hash = await bcrypt.hash(password, 12)
    const db = getSupabaseAdmin()

    const { error } = await db.from('usuarios_portal').insert({
      nombre, email: email.toLowerCase().trim(),
      password_hash: hash, rol, telefono: telefono || null,
    })
    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'Ese email ya está registrado' }, { status: 409 })
      throw error
    }
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
