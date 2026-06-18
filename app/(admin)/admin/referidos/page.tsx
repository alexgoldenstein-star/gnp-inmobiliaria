export const dynamic = 'force-dynamic'
import { getSupabaseAdmin } from '@/lib/supabase'
import ReferidosPanel from '@/components/admin/ReferidosPanel'

export default async function ReferidosPage() {
  const db = getSupabaseAdmin()

  const [{ data: referidores }, { data: leads }] = await Promise.all([
    db.from('inmobiliarias').select('*').eq('tipo', 'interior').eq('activa', true).order('nombre'),
    db.from('leads')
      .select('*, propiedades(titulo, slug, precio, moneda), inmobiliarias!referido_por(nombre)')
      .not('referido_por', 'is', null)
      .order('creado_en', { ascending: false })
      .limit(100),
  ])

  return <ReferidosPanel referidores={referidores ?? []} leads={leads ?? []} />
}
