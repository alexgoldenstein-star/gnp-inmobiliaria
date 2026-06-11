import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, email, telefono, mensaje, interes, propiedad_id, canal } = body

    if (!nombre || !telefono) {
      return NextResponse.json({ error: 'Nombre y teléfono son requeridos' }, { status: 400 })
    }

    const db = supabaseAdmin()

    // Guardar lead
    const { data: lead, error } = await db.from('leads').insert({
      nombre,
      email: email || null,
      telefono,
      whatsapp: telefono,
      mensaje: mensaje || null,
      interes: interes || 'info_general',
      propiedad_id: propiedad_id || null,
      canal: canal || 'web',
      estado: 'nuevo',
      prioridad: 'media',
      ip: req.headers.get('x-forwarded-for') ?? null,
    }).select().single()

    if (error) throw error

    // Incrementar leads_count en la propiedad
    if (propiedad_id) {
      await db.rpc('incrementar_vistas', { prop_id: propiedad_id })
      await db.from('propiedades')
        .update({ leads_count: db.rpc('leads_count', {}) })
        .eq('id', propiedad_id)
    }

    // TODO Sprint 3: enviar email con Resend
    // TODO Sprint 3: notificación WhatsApp

    return NextResponse.json({ success: true, lead_id: lead.id })
  } catch (err) {
    console.error('Error creando lead:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
