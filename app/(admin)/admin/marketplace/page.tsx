export const dynamic = 'force-dynamic'
import { getSupabaseAdmin } from '@/lib/supabase'
import MarketplacePanel from '@/components/admin/MarketplacePanel'

export default async function MarketplacePage() {
  const db = getSupabaseAdmin()
  const [{ data: solicitudes }, { data: socias }] = await Promise.all([
    db.from('marketplace_solicitudes').select('*').order('creada_en', { ascending: false }).limit(50),
    db.from('inmobiliarias').select('*').neq('tipo', 'propia').order('creada_en', { ascending: false }),
  ])
  return <MarketplacePanel solicitudes={solicitudes ?? []} socias={socias ?? []} />
}
