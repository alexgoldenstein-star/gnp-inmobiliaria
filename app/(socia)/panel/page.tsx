export const dynamic = 'force-dynamic'
import { getSession } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Eye, TrendingUp, Users } from 'lucide-react'

export default async function PanelSociaPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  const db = getSupabaseAdmin()

  // Buscar la inmobiliaria de este usuario
  const { data: inmob } = await db
    .from('inmobiliarias')
    .select('*')
    .eq('email', session.email)
    .single()

  const { data: props } = await db
    .from('propiedades')
    .select('id, titulo, estado, operacion, precio, moneda, publicada, vistas, leads_count, foto_principal, barrio, creada_en')
    .eq('inmobiliaria_id', inmob?.id ?? '00000000-0000-0000-0000-000000000000')
    .order('creada_en', { ascending: false })

  const { count: leadsCount } = await db
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('inmobiliaria_id', inmob?.id ?? '00000000-0000-0000-0000-000000000000')

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-[28px] uppercase tracking-tight">
            {inmob?.nombre ?? session.nombre}
          </h1>
          <p className="text-[14px] text-[#555] mt-1 capitalize">Plan {inmob?.plan ?? 'pendiente'} · {inmob?.activa ? 'Activa' : 'Pendiente de aprobación'}</p>
        </div>
        <Link href="/panel/nueva"
          className="flex items-center gap-2 bg-[#D85A30] text-white font-semibold text-[14px] px-5 py-2.5 rounded-md hover:bg-[#B84A22] transition-colors">
          <Plus size={16}/> Nueva propiedad
        </Link>
      </div>

      {!inmob?.activa && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
          <div className="font-semibold text-yellow-800 mb-1">⏳ Cuenta pendiente de aprobación</div>
          <p className="text-[13px] text-yellow-700">El equipo de G&P está revisando tu solicitud. Te avisamos por email cuando esté activada.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Propiedades', value: props?.length ?? 0, icon: Building2 },
          { label: 'Publicadas', value: props?.filter(p=>p.publicada).length ?? 0, icon: Eye },
          { label: 'Consultas recibidas', value: leadsCount ?? 0, icon: Users },
          { label: 'Vistas totales', value: props?.reduce((s,p) => s + (p.vistas||0), 0) ?? 0, icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-[#E2E0DC] p-5">
            <Icon size={18} className="text-[#D85A30] mb-3"/>
            <div className="font-display font-black text-[32px] leading-none">{value}</div>
            <div className="text-[12px] text-[#555] mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Mis propiedades */}
      <div className="bg-white rounded-xl border border-[#E2E0DC] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E0DC]">
          <h2 className="font-display font-bold text-[18px] uppercase">Mis propiedades</h2>
          <Link href="/panel/propiedades" className="text-[13px] text-[#D85A30] hover:underline">Ver todas</Link>
        </div>
        {props && props.length > 0 ? (
          <div className="divide-y divide-[#E2E0DC]">
            {props.slice(0,5).map(p => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F5F4F2] shrink-0">
                  {p.foto_principal ? <img src={p.foto_principal} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xl opacity-20">🏠</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[14px] truncate">{p.titulo}</div>
                  <div className="text-[12px] text-[#888] capitalize">{p.operacion} · {p.barrio}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${p.publicada ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.publicada ? 'Publicada' : 'Borrador'}
                  </span>
                  <span className="text-[12px] text-[#888] flex items-center gap-1"><Eye size={11}/>{p.vistas}</span>
                  <Link href={`/panel/propiedades/${p.id}`} className="text-[#D85A30] text-[12px] hover:underline">Editar</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-[#555] text-[14px]">
            No tenés propiedades todavía.{' '}
            <Link href="/panel/nueva" className="text-[#D85A30] hover:underline">Publicar la primera</Link>
          </div>
        )}
      </div>
    </div>
  )
}

function Building2({ size, className }: { size: number, className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 3v18M16 3v18M2 9h20M2 15h20"/></svg>
}
