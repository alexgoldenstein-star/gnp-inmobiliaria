export const dynamic = 'force-dynamic'
import { getSupabaseAdmin } from '@/lib/supabase'
import GeneradorRRSS from '@/components/admin/GeneradorRRSS'

export default async function ContenidoRRSSPage() {
  const db = getSupabaseAdmin()
  const { data: propiedades } = await db
    .from('propiedades')
    .select('id, titulo, tipo, operacion, precio, moneda, barrio, ambientes, superficie_cubierta, descripcion_corta, descripcion, foto_principal, amenities')
    .eq('publicada', true)
    .order('publicada_en', { ascending: false })
    .limit(50)

  return <GeneradorRRSS propiedades={propiedades ?? []} />
}
