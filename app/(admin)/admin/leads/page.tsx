export const dynamic = 'force-dynamic'
import { getSupabaseAdmin } from '@/lib/supabase'
import LeadsTable from '@/components/admin/LeadsTable'

export default async function LeadsPage() {
  const db = getSupabaseAdmin()

  const { data: leads } = await db
    .from('leads')
    .select('*, propiedades(titulo, slug, operacion)')
    .order('creado_en', { ascending: false })
    .limit(300)

  // Separar por tipo de canal/origen
  const todos = leads ?? []
  const contactos_web = todos.filter(l => l.canal === 'web' || !l.canal)
  const marketplace = todos.filter(l => l.canal === 'referido' || l.referido_por)
  const publicitarios = todos.filter(l => ['meta_ads','google_ads'].includes(l.canal))

  const counts = {
    nuevo: todos.filter(l => l.estado === 'nuevo').length,
    contactado: todos.filter(l => l.estado === 'contactado').length,
    calificado: todos.filter(l => l.estado === 'calificado').length,
    ganado: todos.filter(l => l.estado === 'ganado').length,
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-black text-[32px] uppercase tracking-tight">CRM — Leads</h1>
        <p className="text-[14px] text-[#555] mt-1">Gestión de consultas entrantes y seguimiento comercial</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

      {/* Info de segmentación */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Consultas del portal', count: contactos_web.length, icon: '🌐', color: 'border-blue-200 bg-blue-50' },
          { label: 'Referidos / Marketplace', count: marketplace.length, icon: '🤝', color: 'border-purple-200 bg-purple-50' },
          { label: 'Publicidad (Meta/Google)', count: publicitarios.length, icon: '📣', color: 'border-orange-200 bg-orange-50' },
        ].map(({ label, count, icon, color }) => (
          <div key={label} className={`border rounded-xl p-4 flex items-center gap-3 ${color}`}>
            <span className="text-2xl">{icon}</span>
            <div>
              <div className="font-display font-black text-[24px] leading-none">{count}</div>
              <div className="text-[12px] text-[#555] mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <LeadsTable leads={todos} />
    </div>
  )
}
