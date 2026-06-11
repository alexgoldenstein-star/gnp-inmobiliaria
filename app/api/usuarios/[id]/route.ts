import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

interface Props { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Props) {
  const { id } = await params
  const body = await req.json()
  const db = getSupabaseAdmin()

  const update: any = {
    nombre: body.nombre,
    rol: body.rol,
    activo: body.activo,
    telefono: body.telefono,
    actualizado_en: new Date().toISOString(),
  }
  if (body.password) {
    update.password_hash = await bcrypt.hash(body.password, 12)
  }

  const { data, error } = await db.from('usuarios_portal').update(update).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, usuario: data })
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const { id } = await params
  const db = getSupabaseAdmin()
  // Soft delete — solo desactivamos
  const { error } = await db.from('usuarios_portal').update({ activo: false }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
