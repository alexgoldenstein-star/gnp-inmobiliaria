export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { Plus, Eye, Pencil } from 'lucide-react'
import { formatPrecio } from '@/lib/propiedades'
import PropiedadesAdminTable from '@/components/admin/PropiedadesAdminTable'

export default async function PropiedadesAdminPage() {
  const db = supabaseAdmin()
  const { data: props } = await db
    .from('propiedades')
    .select('id, slug, titulo, tipo, operacion, precio, moneda, barrio, estado, publicada, destacada, emprendimiento, vistas, leads_count, foto_principal, creada_en')
    .order('creada_en', { ascending: false })

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-[32px] uppercase tracking-tight">Propiedades</h1>
          <p className="text-[14px] text-[#555] mt-1">{props?.length ?? 0} propiedades en total</p>
        </div>
        <Link href="/admin/nueva"
          className="flex items-center gap-2 bg-[#D85A30] text-white font-semibold text-[14px] px-5 py-2.5 rounded-md hover:bg-[#B84A22] transition-colors">
          <Plus size={16} /> Nueva propiedad
        </Link>
      </div>
      <PropiedadesAdminTable propiedades={props ?? []} />
    </div>
  )
}
