export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import MiCuentaClient from '@/components/public/MiCuentaClient'

export default async function MiCuentaPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const db = getSupabaseAdmin()

  // Leads del cliente (por email)
  const { data: leads } = await db
    .from('leads')
    .select('*, propiedades(titulo, slug, foto_principal, barrio, precio, moneda, operacion)')
    .eq('email', session.email)
    .order('creado_en', { ascending: false })

  // Propiedades destacadas para sugerir
  const { data: sugeridas } = await db
    .from('propiedades')
    .select('id, slug, titulo, barrio, precio, moneda, foto_principal, operacion, ambientes, superficie_cubierta')
    .eq('publicada', true).eq('estado', 'disponible').eq('destacada', true)
    .limit(3)

  return <MiCuentaClient session={session} leads={leads ?? []} sugeridas={sugeridas ?? []} />
}
