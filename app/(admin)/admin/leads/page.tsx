export const dynamic = 'force-dynamic'
import { getSupabaseAdmin } from '@/lib/supabase'
import LeadsCRM from '@/components/admin/LeadsCRM'

export default async function LeadsPage() {
  const db = getSupabaseAdmin()
  const { data: leads } = await db
    .from('leads')
    .select('*, propiedades(titulo, slug, operacion)')
    .order('creado_en', { ascending: false })
    .limit(300)

  return <LeadsCRM leads={leads ?? []} />
}
