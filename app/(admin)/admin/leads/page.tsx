export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase'

const ESTADO_COLOR: Record<string, string> = {
  nuevo: 'bg-blue-100 text-blue-700',
  visto: 'bg-gray-100 text-gray-600',
  contactado: 'bg-yellow-100 text-yellow-700',
  calificado: 'bg-purple-100 text-purple-700',
  visita_agendada: 'bg-orange-100 text-orange-700',
  negociando: 'bg-indigo-100 text-indigo-700',
  ganado: 'bg-green-100 text-green-700',
  perdido: 'bg-red-100 text-red-700',
}

const CANAL_ICON: Record<string, string> = {
  web: '🌐', whatsapp: '💬', meta_ads: '📘', google_ads: '🔍', referido: '🤝', otro: '📋'
}

export default async function LeadsPage() {
  const db = supabaseAdmin()
  const { data: leads } = await db
    .from('leads')
    .select('*, propiedades(titulo, slug)')
    .order('creado_en', { ascending: false })
    .limit(100)

  const { count: nuevos } = await db.from('leads').select('*', { count: 'exact', head: true }).eq('estado', 'nuevo')

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-[32px] uppercase tracking-tight">Leads / CRM</h1>
          <p className="text-[14px] text-[#555] mt-1">{nuevos} lead{nuevos !== 1 ? 's' : ''} nuevo{nuevos !== 1 ? 's' : ''} sin atender</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E0DC] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F5F4F2] border-b border-[#E2E0DC]">
            <tr>
              {['Nombre', 'Teléfono', 'Canal', 'Propiedad', 'Estado', 'Fecha'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#555]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E0DC]">
            {(leads ?? []).map((l: any) => (
              <tr key={l.id} className="hover:bg-[#F5F4F2] transition-colors">
                <td className="px-5 py-4">
                  <div className="text-[14px] font-medium">{l.nombre}</div>
                  {l.email && <div className="text-[12px] text-[#555]">{l.email}</div>}
                </td>
                <td className="px-5 py-4 text-[13px]">{l.telefono}</td>
                <td className="px-5 py-4 text-[13px]">
                  {CANAL_ICON[l.canal] ?? '📋'} <span className="capitalize">{l.canal?.replace('_', ' ')}</span>
                </td>
                <td className="px-5 py-4 text-[13px] text-[#555]">
                  {l.propiedades?.titulo ?? '—'}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium capitalize ${ESTADO_COLOR[l.estado] ?? 'bg-gray-100 text-gray-500'}`}>
                    {l.estado}
                  </span>
                </td>
                <td className="px-5 py-4 text-[12px] text-[#555]">
                  {new Date(l.creado_en).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!leads?.length && (
          <div className="py-16 text-center text-[#555] text-[14px]">No hay leads todavía.</div>
        )}
      </div>
    </div>
  )
}
