export const dynamic = 'force-dynamic'
import { getSupabaseAdmin } from '@/lib/supabase'
import BuscadorRedClient from '@/components/public/BuscadorRedClient'

export default async function RedPage() {
  const db = getSupabaseAdmin()

  const { data: inmobiliarias } = await db
    .from('inmobiliarias')
    .select('id, nombre, logo_url, descripcion, barrios_operacion, zona_origen, tipo, plan, verificada, sitio_web, instagram, telefono')
    .eq('activa', true)
    .neq('tipo', 'propia')
    .order('verificada', { ascending: false })
    .order('nombre')

  // Propiedades del marketplace (de inmobiliarias socias)
  const { data: propiedades } = await db
    .from('propiedades')
    .select('id, slug, titulo, tipo, operacion, precio, moneda, barrio, foto_principal, ambientes, superficie_cubierta, inmobiliaria_id, inmobiliarias(nombre, logo_url)')
    .eq('publicada', true)
    .eq('estado', 'disponible')
    .not('inmobiliaria_id', 'is', null)
    .order('destacada', { ascending: false })
    .limit(50)

  return <BuscadorRedClient inmobiliarias={inmobiliarias ?? []} propiedades={propiedades ?? []} />
}
