export const dynamic = 'force-dynamic'
import { getSupabaseAdmin } from '@/lib/supabase'
import LotesPanel from '@/components/admin/LotesPanel'

export default async function LotesAdminPage() {
  const db = getSupabaseAdmin()
  const { data: solicitudes } = await db
    .from('factibilidad_solicitudes')
    .select('*')
    .order('creada_en', { ascending: false })
    .limit(200)

  return <LotesPanel solicitudes={solicitudes ?? []} />
}
