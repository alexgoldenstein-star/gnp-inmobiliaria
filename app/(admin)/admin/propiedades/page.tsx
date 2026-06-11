export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { Plus, Eye, Pencil } from 'lucide-react'
import { formatPrecio } from '@/lib/propiedades'

export default async function PropiedadesAdminPage() {
  const db = supabaseAdmin()
  const { data: props } = await db
    .from('propiedades')
    .select('*')
    .order('creada_en', { ascending: false })

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-black text-[32px] uppercase tracking-tight">Propiedades</h1>
        <Link href="/admin/nueva" className="flex items-center gap-2 bg-[#D85A30] text-white font-semibold text-[14px] px-5 py-2.5 rounded-md hover:bg-[#B84A22] transition-colors">
          <Plus size={16} /> Nueva propiedad
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E0DC] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F5F4F2] border-b border-[#E2E0DC]">
            <tr>
              {['Propiedad', 'Tipo', 'Operación', 'Precio', 'Estado', 'Vistas', 'Acciones'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#555]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E0DC]">
            {(props ?? []).map((p: any) => (
              <tr key={p.id} className="hover:bg-[#F5F4F2] transition-colors">
                <td className="px-5 py-4">
                  <div className="text-[14px] font-medium max-w-[220px] truncate">{p.titulo}</div>
                  <div className="text-[12px] text-[#555]">{p.barrio}</div>
                </td>
                <td className="px-5 py-4 text-[13px] capitalize">{p.tipo}</td>
                <td className="px-5 py-4 text-[13px] capitalize">{p.operacion}</td>
                <td className="px-5 py-4 text-[13px] font-medium">{formatPrecio(p.precio, p.moneda)}</td>
                <td className="px-5 py-4">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${p.publicada ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.publicada ? 'Publicada' : 'Borrador'}
                  </span>
                </td>
                <td className="px-5 py-4 text-[13px] text-[#555] flex items-center gap-1">
                  <Eye size={12} /> {p.vistas}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Link href={`/propiedades/${p.slug}`} target="_blank"
                      className="p-1.5 hover:bg-[#F5F4F2] rounded transition-colors text-[#555]" title="Ver en sitio">
                      <Eye size={14} />
                    </Link>
                    <Link href={`/admin/propiedades/${p.id}`}
                      className="p-1.5 hover:bg-[#F5F4F2] rounded transition-colors text-[#555]" title="Editar">
                      <Pencil size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!props?.length && (
          <div className="py-16 text-center text-[#555] text-[14px]">
            No hay propiedades aún.{' '}
            <Link href="/admin/nueva" className="text-[#D85A30] hover:underline">Crear la primera</Link>
          </div>
        )}
      </div>
    </div>
  )
}
