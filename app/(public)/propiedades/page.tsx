export const dynamic = 'force-dynamic'
import { getPropiedadesPublicas } from '@/lib/propiedades'
import PropertyCard from '@/components/public/PropertyCard'
import type { FiltrosPropiedades, Operacion, TipoPropiedad } from '@/types'
import Link from 'next/link'
import { SlidersHorizontal, X } from 'lucide-react'

interface Props { searchParams: Promise<Record<string, string>> }

const BARRIOS = ['Almagro','Balvanera','Belgrano','Caballito','Chacarita','Colegiales','Flores','Núñez','Palermo','Puerto Madero','Recoleta','Retiro','Saavedra','San Telmo','Villa Crespo','Villa del Parque','Villa Urquiza']

export default async function PropiedadesPage({ searchParams }: Props) {
  const params = await searchParams
  const filtros: FiltrosPropiedades = {
    operacion: params.operacion as Operacion,
    tipo: params.tipo as TipoPropiedad,
    barrio: params.barrio,
    precio_max: params.precio_max ? Number(params.precio_max) : undefined,
    precio_min: params.precio_min ? Number(params.precio_min) : undefined,
    ambientes: params.ambientes ? Number(params.ambientes) : undefined,
    cochera: params.cochera === 'true' ? true : undefined,
    page: params.page ? Number(params.page) : 1,
    limit: 12,
  }

  const { propiedades, total } = await getPropiedadesPublicas(filtros)
  const totalPages = Math.ceil(total / 12)
  const currentPage = filtros.page ?? 1
  const hasFilters = Object.keys(params).some(k => !['page'].includes(k))

  const buildUrl = (overrides: Record<string, string>) => {
    const p = { ...params, ...overrides }
    Object.keys(p).forEach(k => !p[k] && delete p[k])
    return `/propiedades?${new URLSearchParams(p)}`
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header */}
      <div className="bg-[#111] text-white px-6 md:px-12 py-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-0.5 bg-[#D85A30]" />
          <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Propiedades</span>
        </div>
        <h1 className="font-display font-black uppercase text-[42px] leading-[0.95] tracking-tight">
          {params.operacion === 'venta' ? 'EN VENTA'
            : params.operacion === 'alquiler' ? 'EN ALQUILER'
            : params.operacion === 'pozo' ? 'EN POZO'
            : params.tipo ? params.tipo.charAt(0).toUpperCase() + params.tipo.slice(1) + 'S'
            : 'TODAS LAS PROPIEDADES'}
        </h1>
        {total > 0 && <p className="text-white/50 text-[14px] mt-1">{total} propiedad{total !== 1 ? 'es' : ''}</p>}
      </div>

      <div className="flex gap-0 max-w-[1400px] mx-auto px-4 md:px-8 py-8">

        {/* SIDEBAR FILTROS — estilo ZonaProp */}
        <aside className="hidden lg:block w-[260px] shrink-0 mr-8">
          <div className="bg-white rounded-xl border border-[#E2E0DC] sticky top-[84px] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E0DC]">
              <div className="flex items-center gap-2 font-semibold text-[14px]">
                <SlidersHorizontal size={16} className="text-[#D85A30]" /> Filtros
              </div>
              {hasFilters && (
                <Link href="/propiedades" className="text-[12px] text-[#D85A30] hover:underline flex items-center gap-1">
                  <X size={12} /> Limpiar
                </Link>
              )}
            </div>

            <form method="GET" action="/propiedades" className="divide-y divide-[#F0EFED]">

              {/* Operación */}
              <div className="px-5 py-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#888] mb-3">Operación</div>
                <div className="flex flex-col gap-2">
                  {[['', 'Todas'], ['venta', 'Venta'], ['alquiler', 'Alquiler'], ['pozo', 'En pozo']].map(([val, lbl]) => (
                    <label key={val} className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="radio" name="operacion" value={val}
                        defaultChecked={params.operacion === val || (!params.operacion && val === '')}
                        className="w-4 h-4 accent-[#D85A30]" />
                      <span className="text-[13px] text-[#333] group-hover:text-[#D85A30] transition-colors">{lbl}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tipo */}
              <div className="px-5 py-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#888] mb-3">Tipo de propiedad</div>
                <div className="flex flex-col gap-2">
                  {[['','Todos'],['departamento','Departamento'],['casa','Casa'],['ph','PH'],['local','Local'],['oficina','Oficina'],['galpon','Galpón'],['terreno','Terreno']].map(([val, lbl]) => (
                    <label key={val} className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="radio" name="tipo" value={val}
                        defaultChecked={params.tipo === val || (!params.tipo && val === '')}
                        className="w-4 h-4 accent-[#D85A30]" />
                      <span className="text-[13px] text-[#333] group-hover:text-[#D85A30] transition-colors">{lbl}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ambientes */}
              <div className="px-5 py-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#888] mb-3">Ambientes</div>
                <div className="flex gap-2 flex-wrap">
                  {['', '1', '2', '3', '4'].map(v => (
                    <label key={v} className={`w-9 h-9 flex items-center justify-center rounded-full border text-[13px] font-medium cursor-pointer transition-colors
                      ${params.ambientes === v || (!params.ambientes && v === '') ? 'bg-[#D85A30] border-[#D85A30] text-white' : 'border-[#E2E0DC] text-[#555] hover:border-[#D85A30]'}`}>
                      <input type="radio" name="ambientes" value={v} defaultChecked={params.ambientes === v || (!params.ambientes && v === '')} className="hidden" />
                      {v || 'Todos'}
                    </label>
                  ))}
                  <label className={`px-3 h-9 flex items-center justify-center rounded-full border text-[13px] font-medium cursor-pointer transition-colors
                    ${params.ambientes === '5' ? 'bg-[#D85A30] border-[#D85A30] text-white' : 'border-[#E2E0DC] text-[#555] hover:border-[#D85A30]'}`}>
                    <input type="radio" name="ambientes" value="5" defaultChecked={params.ambientes === '5'} className="hidden" />
                    5+
                  </label>
                </div>
              </div>

              {/* Precio */}
              <div className="px-5 py-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#888] mb-3">Precio (USD)</div>
                <div className="flex gap-2 items-center">
                  <input type="number" name="precio_min" placeholder="Mín" defaultValue={params.precio_min}
                    className="w-full border border-[#E2E0DC] rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-[#D85A30]" />
                  <span className="text-[#aaa] shrink-0">—</span>
                  <input type="number" name="precio_max" placeholder="Máx" defaultValue={params.precio_max}
                    className="w-full border border-[#E2E0DC] rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-[#D85A30]" />
                </div>
              </div>

              {/* Barrio */}
              <div className="px-5 py-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#888] mb-3">Barrio / Zona</div>
                <select name="barrio" defaultValue={params.barrio ?? ''}
                  className="w-full border border-[#E2E0DC] rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-[#D85A30] bg-white">
                  <option value="">Todos los barrios</option>
                  {BARRIOS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Extras */}
              <div className="px-5 py-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#888] mb-3">Características</div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" name="cochera" value="true" defaultChecked={params.cochera === 'true'} className="w-4 h-4 accent-[#D85A30]" />
                  <span className="text-[13px] text-[#333]">Con cochera</span>
                </label>
              </div>

              <div className="px-5 py-4">
                <button type="submit"
                  className="w-full bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[14px] py-3 rounded-md transition-colors">
                  Aplicar filtros
                </button>
              </div>
            </form>
          </div>
        </aside>

        {/* GRID */}
        <div className="flex-1 min-w-0">
          {/* Mobile filtros */}
          <div className="lg:hidden mb-4 flex gap-2 overflow-x-auto pb-2">
            {[['venta','Venta'],['alquiler','Alquiler'],['pozo','En pozo']].map(([val, lbl]) => (
              <Link key={val} href={buildUrl({ operacion: val })}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-medium border transition-colors
                  ${params.operacion === val ? 'bg-[#D85A30] border-[#D85A30] text-white' : 'border-[#E2E0DC] bg-white text-[#555]'}`}>
                {lbl}
              </Link>
            ))}
          </div>

          {propiedades.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {propiedades.map(p => <PropertyCard key={p.id} prop={p} />)}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <Link key={p} href={buildUrl({ page: String(p) })}
                      className={`w-9 h-9 flex items-center justify-center rounded-md text-[14px] font-medium transition-colors
                        ${p === currentPage ? 'bg-[#D85A30] text-white' : 'border border-[#E2E0DC] bg-white hover:border-[#111]'}`}>
                      {p}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 bg-white rounded-xl border border-[#E2E0DC]">
              <div className="text-6xl mb-4 opacity-20">🔍</div>
              <h3 className="font-display font-bold text-2xl uppercase mb-2">Sin resultados</h3>
              <p className="text-[#555] text-[15px] mb-6">No encontramos propiedades con esos filtros.</p>
              <Link href="/propiedades" className="bg-[#D85A30] text-white font-semibold text-[14px] px-6 py-3 rounded-md hover:bg-[#B84A22] transition-colors">
                Ver todas
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
