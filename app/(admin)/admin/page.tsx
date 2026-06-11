export const dynamic = 'force-dynamic'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { Home, Users, TrendingUp, Eye, Plus, ArrowRight } from 'lucide-react'

export default async function AdminDashboard() {
  const db = supabaseAdmin()

  const [{ data: props }, { data: leads }, { count: leadsNuevos }] = await Promise.all([
    db.from('propiedades').select('id, titulo, estado, operacion, precio, moneda, publicada, vistas, creada_en').order('creada_en', { ascending: false }).limit(5),
    db.from('leads').select('id, nombre, telefono, estado, canal, creado_en, propiedades(titulo)').order('creado_en', { ascending: false }).limit(8),
    db.from('leads').select('*', { count: 'exact', head: true }).eq('estado', 'nuevo'),
  ])

  const { count: totalProps } = await db.from('propiedades').select('*', { count: 'exact', head: true }).eq('publicada', true)
  const { count: totalLeads } = await db.from('leads').select('*', { count: 'exact', head: true })
  const { count: leadsHoy } = await db.from('leads').select('*', { count: 'exact', head: true })
    .gte('creado_en', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())

  const ESTADO_COLOR: Record<string, string> = {
    nuevo: 'bg-blue-100 text-blue-700',
    contactado: 'bg-yellow-100 text-yellow-700',
    calificado: 'bg-purple-100 text-purple-700',
    ganado: 'bg-green-100 text-green-700',
    perdido: 'bg-gray-100 text-gray-500',
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-[32px] uppercase tracking-tight">Dashboard</h1>
          <p className="text-[#555] text-[14px] mt-1">Bienvenido al panel de G&P Negocios Inmobiliarios</p>
        </div>
        <Link href="/admin/nueva" className="flex items-center gap-2 bg-[#D85A30] text-white font-semibold text-[14px] px-5 py-2.5 rounded-md hover:bg-[#B84A22] transition-colors">
          <Plus size={16} /> Nueva propiedad
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Propiedades activas', value: totalProps ?? 0, icon: Home, color: 'text-[#D85A30]' },
          { label: 'Leads totales', value: totalLeads ?? 0, icon: Users, color: 'text-blue-500' },
          { label: 'Leads nuevos', value: leadsNuevos ?? 0, icon: TrendingUp, color: 'text-purple-500' },
          { label: 'Leads hoy', value: leadsHoy ?? 0, icon: Eye, color: 'text-green-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-[#E2E0DC] p-5">
            <Icon size={20} className={`${color} mb-3`} />
            <div className="font-display font-black text-[36px] leading-none">{value}</div>
            <div className="text-[12px] text-[#555] mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Propiedades recientes */}
        <div className="bg-white rounded-xl border border-[#E2E0DC]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E0DC]">
            <h2 className="font-display font-bold text-[18px] uppercase">Propiedades recientes</h2>
            <Link href="/admin/propiedades" className="text-[13px] text-[#D85A30] hover:underline flex items-center gap-1">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-[#E2E0DC]">
            {(props ?? []).map((p: any) => (
              <Link key={p.id} href={`/admin/propiedades/${p.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-[#F5F4F2] transition-colors no-underline text-inherit">
                <div>
                  <div className="text-[14px] font-medium truncate max-w-[220px]">{p.titulo}</div>
                  <div className="text-[12px] text-[#555] mt-0.5 capitalize">{p.operacion} · {p.estado}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded ${p.publicada ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.publicada ? 'Publicada' : 'Borrador'}
                  </span>
                  <span className="text-[12px] text-[#555] flex items-center gap-1">
                    <Eye size={11} /> {p.vistas}
                  </span>
                </div>
              </Link>
            ))}
            {!props?.length && (
              <div className="px-6 py-10 text-center text-[#555] text-[14px]">
                No hay propiedades aún.{' '}
                <Link href="/admin/nueva" className="text-[#D85A30] hover:underline">Crear la primera</Link>
              </div>
            )}
          </div>
        </div>

        {/* Leads recientes */}
        <div className="bg-white rounded-xl border border-[#E2E0DC]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E0DC]">
            <h2 className="font-display font-bold text-[18px] uppercase">Leads recientes</h2>
            <Link href="/admin/leads" className="text-[13px] text-[#D85A30] hover:underline flex items-center gap-1">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-[#E2E0DC]">
            {(leads ?? []).map((l: any) => (
              <div key={l.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <div className="text-[14px] font-medium">{l.nombre}</div>
                  <div className="text-[12px] text-[#555] mt-0.5">{l.telefono} · <span className="capitalize">{l.canal}</span></div>
                </div>
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium capitalize ${ESTADO_COLOR[l.estado] ?? 'bg-gray-100 text-gray-500'}`}>
                  {l.estado}
                </span>
              </div>
            ))}
            {!leads?.length && (
              <div className="px-6 py-10 text-center text-[#555] text-[14px]">No hay leads todavía.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
