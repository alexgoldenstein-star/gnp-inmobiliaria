import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const db = getSupabaseAdmin()
    const { data, error } = await db.from('marketplace_solicitudes').insert({
      nombre: body.nombre, email: body.email, telefono: body.telefono,
      nombre_empresa: body.nombre_empresa || null, sitio_web: body.sitio_web || null,
      plan_interes: body.plan_interes || 'starter', mensaje: body.mensaje || null,
    }).select().single()
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
