import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, email, telefono, mensaje, interes, propiedad_id, canal } = body

    if (!nombre || !telefono) {
      return NextResponse.json({ error: 'Nombre y teléfono son requeridos' }, { status: 400 })
    }

    const db = getSupabaseAdmin()

    // Obtener info de la propiedad si hay
    let propTitulo = ''
    if (propiedad_id) {
      const { data: prop } = await db.from('propiedades').select('titulo').eq('id', propiedad_id).single()
      propTitulo = prop?.titulo ?? ''
    }

    const { data: lead, error } = await db.from('leads').insert({
      nombre, email: email || null, telefono, whatsapp: telefono,
      mensaje: mensaje || null, interes: interes || 'info_general',
      propiedad_id: propiedad_id || null, canal: canal || 'web',
      estado: 'nuevo', prioridad: 'media',
      ip: req.headers.get('x-forwarded-for') ?? null,
    }).select().single()

    if (error) throw error

    // ── Notificación WhatsApp al admin via API de WhatsApp ────
    const waNumber = process.env.ADMIN_WHATSAPP_NOTIFY
    const waToken = process.env.WA_ACCESS_TOKEN
    const waPhoneId = process.env.WA_PHONE_ID

    if (waNumber && waToken && waPhoneId) {
      const mensaje_wa = `🔔 *Nuevo lead en G&P*\n\n👤 *${nombre}*\n📞 ${telefono}${email ? `\n📧 ${email}` : ''}\n${propTitulo ? `🏠 ${propTitulo}\n` : ''}💬 ${mensaje || 'Sin mensaje'}\n📲 Canal: ${canal || 'web'}\n\n_Ver en el admin: gnp-inmobiliaria.vercel.app/admin/leads_`

      try {
        await fetch(`https://graph.facebook.com/v19.0/${waPhoneId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${waToken}`
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: waNumber,
            type: 'text',
            text: { body: mensaje_wa }
          })
        })
      } catch (e) {
        console.error('WA notification failed:', e)
        // No bloqueamos el flujo si falla la notificación
      }
    }

    return NextResponse.json({ success: true, lead_id: lead.id })
  } catch (err: any) {
    console.error('Error creando lead:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
