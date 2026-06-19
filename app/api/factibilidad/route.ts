import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { calcularFactibilidad } from '@/lib/factibilidad'

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, telefono, direccion, barrio, superficie_m2, frente_m } = await req.json()

    if (!nombre || !telefono || !direccion || !superficie_m2) {
      return NextResponse.json({ error: 'Completá todos los campos requeridos' }, { status: 400 })
    }

    const resultado = calcularFactibilidad(Number(superficie_m2), barrio || '')

    const db = getSupabaseAdmin()
    const { data, error } = await db.from('factibilidad_solicitudes').insert({
      nombre, email: email || null, telefono, direccion, barrio,
      superficie_m2: Number(superficie_m2), frente_m: frente_m ? Number(frente_m) : null,
      zonificacion: resultado.zona.nombre,
      fot: resultado.zona.fot,
      fos: resultado.zona.fos,
      altura_max_m: resultado.zona.alturaMaxima,
      m2_construibles: resultado.m2Construibles,
      incidencia_estimada_usd: resultado.incidenciaPorM2Usd,
      valor_terreno_estimado_usd: resultado.valorTerrenoEstimadoUsd,
      estado: 'calculado',
      fuente_calculo: 'estimado',
      calculada_en: new Date().toISOString(),
    }).select().single()

    if (error) throw error

    // Notificación WhatsApp al admin
    const waNumber = process.env.ADMIN_WHATSAPP_NOTIFY
    const waToken = process.env.WA_ACCESS_TOKEN
    const waPhoneId = process.env.WA_PHONE_ID
    if (waNumber && waToken && waPhoneId) {
      const msg = `🌿 *Nueva solicitud de factibilidad*\n\n👤 ${nombre}\n📞 ${telefono}\n📍 ${direccion}, ${barrio}\n📐 ${superficie_m2}m²\n\n📊 Resultado estimado:\n• Zona: ${resultado.zona.nombre}\n• M² construibles: ${resultado.m2Construibles}\n• Valor terreno est.: USD ${resultado.valorTerrenoEstimadoUsd.toLocaleString()}\n\n_Ver en admin/lotes_`
      try {
        await fetch(`https://graph.facebook.com/v19.0/${waPhoneId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${waToken}` },
          body: JSON.stringify({ messaging_product: 'whatsapp', to: waNumber, type: 'text', text: { body: msg } })
        })
      } catch (e) { console.error('WA fail', e) }
    }

    return NextResponse.json({ success: true, resultado, id: data.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
