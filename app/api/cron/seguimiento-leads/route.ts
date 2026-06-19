import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// Se ejecuta diariamente — revisa leads sin contactar hace 2+ días
export async function GET(req: NextRequest) {
  // Verificar que viene de Vercel Cron
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getSupabaseAdmin()
  const dosDiasAtras = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()

  // Leads nuevos sin contactar hace más de 2 días
  const { data: leadsSinAtender } = await db
    .from('leads')
    .select('id, nombre, telefono, creado_en, propiedades(titulo)')
    .eq('estado', 'nuevo')
    .lt('creado_en', dosDiasAtras)

  if (!leadsSinAtender || leadsSinAtender.length === 0) {
    return NextResponse.json({ success: true, message: 'Sin pendientes', count: 0 })
  }

  // Enviar resumen por WhatsApp al admin
  const waNumber = process.env.ADMIN_WHATSAPP_NOTIFY
  const waToken = process.env.WA_ACCESS_TOKEN
  const waPhoneId = process.env.WA_PHONE_ID

  if (waNumber && waToken && waPhoneId) {
    const lista = leadsSinAtender.slice(0, 10).map((l: any) =>
      `• ${l.nombre} (${l.telefono}) — ${l.propiedades?.titulo ?? 'Consulta general'}`
    ).join('\n')

    const mensaje = `⏰ *Recordatorio de seguimiento*\n\nTenés ${leadsSinAtender.length} lead${leadsSinAtender.length > 1 ? 's' : ''} sin contactar hace más de 2 días:\n\n${lista}${leadsSinAtender.length > 10 ? `\n\n...y ${leadsSinAtender.length - 10} más` : ''}\n\n_Ver en: gnp-inmobiliaria.vercel.app/admin/leads_`

    try {
      await fetch(`https://graph.facebook.com/v19.0/${waPhoneId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${waToken}` },
        body: JSON.stringify({ messaging_product: 'whatsapp', to: waNumber, type: 'text', text: { body: mensaje } })
      })
    } catch (e) {
      console.error('Cron WA notification failed:', e)
    }
  }

  // Marcar como "visto" para no re-notificar los mismos al día siguiente
  await db.from('leads').update({ estado: 'visto' }).in('id', leadsSinAtender.map((l: any) => l.id))

  return NextResponse.json({ success: true, count: leadsSinAtender.length })
}
