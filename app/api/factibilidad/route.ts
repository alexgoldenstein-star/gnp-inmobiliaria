import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { calcularFactibilidad, calcularFactibilidadConjunta } from '@/lib/factibilidad'

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, telefono, barrio, terrenos } = await req.json()

    if (!nombre || !telefono || !barrio || !Array.isArray(terrenos) || terrenos.length === 0) {
      return NextResponse.json({ error: 'Completá todos los campos requeridos' }, { status: 400 })
    }
    for (const t of terrenos) {
      if (!t.direccion || !t.superficie_m2) {
        return NextResponse.json({ error: 'Cada terreno necesita dirección y superficie' }, { status: 400 })
      }
    }

    const esMultiple = terrenos.length > 1
    const resultado = esMultiple
      ? calcularFactibilidadConjunta(terrenos.map((t: any) => ({
          superficieM2: Number(t.superficie_m2),
          frenteM: t.frente_m ? Number(t.frente_m) : undefined,
          barrio,
        })))
      : calcularFactibilidad(
          Number(terrenos[0].superficie_m2),
          barrio,
          terrenos[0].frente_m ? Number(terrenos[0].frente_m) : undefined
        )

    const direccionesConcat = terrenos.map((t: any) => t.direccion).join(' + ')
    const superficieTotal = terrenos.reduce((s: number, t: any) => s + Number(t.superficie_m2), 0)

    const db = getSupabaseAdmin()
    const { data, error } = await db.from('factibilidad_solicitudes').insert({
      nombre, email: email || null, telefono,
      direccion: direccionesConcat, barrio,
      superficie_m2: superficieTotal,
      frente_m: terrenos[0].frente_m ? Number(terrenos[0].frente_m) : null,
      cantidad_terrenos: terrenos.length,
      terrenos_detalle: terrenos,
      unidad_edificabilidad: resultado.unidad.codigo,
      unidad_edificabilidad_nombre: resultado.unidad.nombre,
      altura_maxima_m: resultado.unidad.alturaMaxima,
      pisos_estimados: resultado.pisosNumero,
      m2_cubiertos_total: resultado.m2CubiertosTotal,
      m2_vendible_estimado: resultado.m2VendibleEstimado,
      incidencia_estimada_usd: resultado.incidenciaPorM2Usd,
      valor_terreno_estimado_usd: resultado.valorTerrenoEstimadoUsd,
      estado: 'calculado',
      fuente_calculo: 'estimado',
      calculada_en: new Date().toISOString(),
    }).select().single()

    if (error) throw error

    const waNumber = process.env.ADMIN_WHATSAPP_NOTIFY
    const waToken = process.env.WA_ACCESS_TOKEN
    const waPhoneId = process.env.WA_PHONE_ID
    if (waNumber && waToken && waPhoneId) {
      const msg = `🌿 *Nueva solicitud de factibilidad*${esMultiple ? ` (${terrenos.length} terrenos)` : ''}\n\n👤 ${nombre}\n📞 ${telefono}\n📍 ${direccionesConcat}, ${barrio}\n📐 ${superficieTotal}m² total\n\n📊 Resultado estimado:\n• Unidad: ${resultado.unidad.nombre}\n• Altura máx: ${resultado.unidad.alturaMaxima}m (${resultado.unidad.pisos})\n• M² vendibles est.: ${resultado.m2VendibleEstimado}\n• Valor estimado: USD ${resultado.valorTerrenoEstimadoUsd.toLocaleString()}\n\n_Ver en admin/lotes_`
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
