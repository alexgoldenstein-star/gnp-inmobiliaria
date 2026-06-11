export const dynamic = 'force-dynamic'
import { getSupabaseAdmin } from '@/lib/supabase'
import ContenidoEditor from '@/components/admin/ContenidoEditor'

export default async function ContenidoPage() {
  const db = getSupabaseAdmin()
  const [{ data: contenido }, { data: portfolio }] = await Promise.all([
    db.from('landing_content').select('*').order('clave'),
    db.from('portfolio_proyectos').select('*').order('orden').order('anio', { ascending: false }),
  ])
  return <ContenidoEditor contenido={contenido ?? []} portfolio={portfolio ?? []} />
}
