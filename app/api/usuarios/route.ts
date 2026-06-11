import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, password, rol, telefono } = await req.json()
    if (!nombre || !email || !password || !rol) {
      return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
    }
    const hash = await bcrypt.hash(password, 12)
    const db = getSupabaseAdmin()
    const { data, error } = await db.from('usuarios_portal').insert({
      nombre, email: email.toLowerCase().trim(),
      password_hash: hash, rol, telefono: telefono || null,
    }).select('id, nombre, email, rol').single()

    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'Ese email ya está registrado' }, { status: 409 })
      throw error
    }
    return NextResponse.json({ success: true, usuario: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  const db = getSupabaseAdmin()
  const { data, error } = await db
    .from('usuarios_portal')
    .select('id, nombre, email, rol, activo, telefono, ultimo_login, creado_en')
    .order('creado_en', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ usuarios: data })
}
