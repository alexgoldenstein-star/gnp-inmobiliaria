export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase'
import LeadsTable from '@/components/admin/LeadsTable'

export default async function LeadsPage() {
  const db = supabaseAdmin()
  const { data: leads } = await db
    .from('leads')
    .select('*, propiedades(titulo, slug)')
    .order('creado_en', { ascending: false })
    .limit(200)

  const counts = {
    nuevo: leads?.filter(l => l.estado === 'nuevo').length ?? 0,
    contactado: leads?.filter(l => l.estado === 'contactado').length ?? 0,
    calificado: leads?.filter(l => l.estado === 'calificado').length ?? 0,
    ganado: leads?.filter(l => l.estado === 'ganado').length ?? 0,
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-black text-[32px] uppercase tracking-tight">Leads / CRM</h1>
        <p className="text-[14px] text-[#555] mt-1">Gestión de consultas y seguimiento comercial</p>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Nuevos', value: counts.nuevo, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Contactados', value: counts.contactado, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Calificados', value: counts.calificado, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Cerrados', value: counts.ganado, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4 border border-[#E2E0DC]`}>
            <div className={`font-display font-black text-[32px] leading-none ${color}`}>{value}</div>
            <div className="text-[12px] font-medium text-[#555] mt-1">{label}</div>
          </div>
        ))}
      </div>

      <LeadsTable leads={leads ?? []} />
    </div>
  )
}
