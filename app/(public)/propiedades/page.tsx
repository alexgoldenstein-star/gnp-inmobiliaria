import { getPropiedadesPublicas } from '@/lib/propiedades'
import PropertyCard from '@/components/public/PropertyCard'
import type { FiltrosPropiedades, Operacion, TipoPropiedad } from '@/types'
import Link from 'next/link'

interface Props {
  searchParams: Promise<Record<string, string>>
}

export default async function PropiedadesPage({ searchParams }: Props) {
  const params = await searchParams
  const filtros: FiltrosPropiedades = {
    operacion: params.operacion as Operacion,
    tipo: params.tipo as TipoPropiedad,
    barrio: params.barrio,
    precio_max: params.precio_max ? Number(params.precio_max) : undefined,
    ambientes: params.ambientes ? Number(params.ambientes) : undefined,
    page: params.page ? Number(params.page) : 1,
    limit: 12,
  }

  const { propiedades, total } = await getPropiedadesPublicas(filtros)
  const totalPages = Math.ceil(total / 12)
  const currentPage = filtros.page ?? 1

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#111] text-white px-6 md:px-12 py-12">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-0.5 bg-[#D85A30]" />
          <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Propiedades</span>
        </div>
        <h1 className="font-display font-black uppercase text-[48px] leading-[0.95] tracking-tight">
          {params.operacion === 'venta' ? 'EN VENTA' : params.operacion === 'alquiler' ? 'EN ALQUILER' : params.operacion === 'pozo' ? 'EN POZO' : 'TODAS LAS PROPIEDADES'}
        </h1>
        {total > 0 && <p className="text-white/50 text-[14px] mt-2">{total} propiedad{total !== 1 ? 'es' : ''} encontrada{total !== 1 ? 's' : ''}</p>}
      </div>

      {/* Filtros */}
      <div className="bg-white border-b border-[#E2E0DC] px-6 md:px-12 py-4">
        <form method="GET" className="flex flex-wrap gap-3 items-center">
          <select name="operacion" defaultValue={params.operacion ?? ''} className="border border-[#E2E0DC] rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-[#D85A30] bg-white cursor-pointer">
            <option value="">Operación</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
            <option value="pozo">En pozo</option>
          </select>
          <select name="tipo" defaultValue={params.tipo ?? ''} className="border border-[#E2E0DC] rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-[#D85A30] bg-white cursor-pointer">
            <option value="">Tipo</option>
            <option value="departamento">Departamento</option>
            <option value="casa">Casa</option>
            <option value="ph">PH</option>
            <option value="local">Local</option>
            <option value="oficina">Oficina</option>
          </select>
          <select name="ambientes" defaultValue={params.ambientes ?? ''} className="border border-[#E2E0DC] rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-[#D85A30] bg-white cursor-pointer">
            <option value="">Ambientes</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
          <select name="precio_max" defaultValue={params.precio_max ?? ''} className="border border-[#E2E0DC] rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-[#D85A30] bg-white cursor-pointer">
            <option value="">Precio máx.</option>
            <option value="80000">USD 80.000</option>
            <option value="150000">USD 150.000</option>
            <option value="250000">USD 250.000</option>
            <option value="500000">USD 500.000</option>
          </select>
          <button type="submit" className="bg-[#D85A30] hover:bg-[#B84A22] text-white text-[13px] font-semibold px-5 py-2 rounded-md transition-colors">
            Aplicar
          </button>
          {Object.keys(params).length > 0 && (
            <Link href="/propiedades" className="text-[13px] text-[#555] hover:text-[#111] underline">Limpiar filtros</Link>
          )}
        </form>
      </div>

      {/* Grid */}
      <div className="px-6 md:px-12 py-12">
        {propiedades.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propiedades.map(p => <PropertyCard key={p.id} prop={p} />)}
            </div>
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Link key={p}
                    href={`/propiedades?${new URLSearchParams({ ...params, page: String(p) })}`}
                    className={`w-9 h-9 flex items-center justify-center rounded-md text-[14px] font-medium transition-colors ${p === currentPage ? 'bg-[#D85A30] text-white' : 'border border-[#E2E0DC] hover:border-[#111]'}`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
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
  )
}
