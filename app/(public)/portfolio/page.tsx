export const dynamic = 'force-dynamic'
import { getSupabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { MapPin, CheckCircle, ArrowRight } from 'lucide-react'
import LeadForm from '@/components/public/LeadForm'

async function getPortfolio() {
  try {
    const db = getSupabaseAdmin()
    const { data } = await db.from('portfolio_proyectos')
      .select('*').eq('visible', true).order('anio', { ascending: false })
    return data ?? []
  } catch { return [] }
}

export default async function PortfolioPage() {
  const proyectos = await getPortfolio()

  // Proyectos de ejemplo para cuando la tabla esté vacía
  const ejemplos = [
    { id: '1', nombre: 'Proyecto Palermo', barrio: 'Palermo', anio: 2023, tipo: 'Departamentos', unidades: 12, estado: 'Entregado', descripcion: 'Edificio residencial de 8 pisos con amenities. 12 unidades de 1, 2 y 3 ambientes.', fotos: [] },
    { id: '2', nombre: 'Proyecto Villa Crespo', barrio: 'Villa Crespo', anio: 2022, tipo: 'PH y Departamentos', unidades: 8, estado: 'Entregado', descripcion: 'Desarrollo boutique con 8 unidades de diseño, en una de las zonas de mayor crecimiento de CABA.', fotos: [] },
    { id: '3', nombre: 'Proyecto Almagro', barrio: 'Almagro', anio: 2024, tipo: 'Departamentos', unidades: 20, estado: 'Entregado', descripcion: 'Complejo residencial con 20 unidades, sum, gimnasio y terraza panorámica con vistas a la ciudad.', fotos: [] },
  ]

  const items = proyectos.length > 0 ? proyectos : ejemplos

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#111] text-white px-6 md:px-12 py-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-0.5 bg-[#D85A30]" />
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Track record</span>
          </div>
          <h1 className="font-display font-black uppercase text-[clamp(44px,6vw,72px)] leading-[0.9] tracking-tight mb-5">
            PROYECTOS<br />
            <span className="text-[#D85A30]">COMERCIALIZADOS</span>
          </h1>
          <p className="text-[16px] font-light text-white/60 max-w-lg">
            Más de {items.length * 10}+ unidades gestionadas. Una trayectoria de operaciones exitosas en los mejores barrios de CABA.
          </p>
        </div>
      </div>

      {/* Stats generales */}
      <div className="bg-[#D85A30] px-6 md:px-12 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-white text-center">
          {[
            ['12+', 'Años en el mercado'],
            ['180+', 'Operaciones cerradas'],
            ['40+', 'Proyectos gestionados'],
            ['100%', 'Entregas cumplidas'],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-display font-black text-[44px] leading-none">{n}</div>
              <div className="text-[12px] text-white/70 mt-1 uppercase tracking-wide">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid de proyectos */}
      <section className="px-6 md:px-12 py-20">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-[#D85A30]" />
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Historial</span>
          </div>
          <h2 className="font-display font-black uppercase text-[clamp(32px,4vw,48px)] leading-[0.93] tracking-tight">
            Proyectos entregados
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p: any) => (
            <div key={p.id} className="bg-white rounded-xl border border-[#E2E0DC] overflow-hidden hover:shadow-lg transition-shadow group">
              {/* Foto o placeholder */}
              <div className="h-52 bg-[#F5F4F2] relative overflow-hidden">
                {p.fotos?.length > 0 || p.foto_url
                  ? <img src={p.foto_url || p.fotos[0]} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-20">
                      <div className="text-5xl">🏢</div>
                    </div>
                  )
                }
                <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle size={10} /> {p.estado ?? 'Entregado'}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-display font-black text-[20px] uppercase tracking-tight">{p.nombre}</h3>
                  <span className="text-[13px] text-white bg-[#111] px-2 py-0.5 rounded font-semibold shrink-0 ml-2">{p.anio}</span>
                </div>
                <div className="flex items-center gap-1 text-[13px] text-[#888] mb-3">
                  <MapPin size={12} /> {p.barrio}, CABA
                </div>
                <p className="text-[13px] text-[#555] leading-relaxed mb-4 line-clamp-2">{p.descripcion}</p>
                <div className="flex items-center gap-3 pt-3 border-t border-[#F0EFED] text-[12px] text-[#888]">
                  <span className="capitalize">{p.tipo}</span>
                  <span className="text-[#E2E0DC]">·</span>
                  <span>{p.unidades} unidades</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F5F4F2] px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display font-black uppercase text-[clamp(32px,4vw,48px)] leading-[0.93] tracking-tight mb-4">
              ¿QUERÉS SER<br />PARTE DEL<br />PRÓXIMO?
            </h2>
            <p className="text-[15px] text-[#555] leading-relaxed mb-6">
              Si tenés una propiedad, un terreno o querés invertir en los próximos proyectos, hablemos. Tenemos la red y la experiencia para hacerlo realidad.
            </p>
            <Link href="/propiedades?operacion=pozo"
              className="inline-flex items-center gap-2 bg-[#D85A30] text-white font-semibold text-[14px] px-6 py-3 rounded-md hover:bg-[#B84A22] transition-colors">
              Ver proyectos en curso <ArrowRight size={15} />
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-7 border border-[#E2E0DC]">
            <h3 className="font-display font-bold text-[18px] uppercase mb-4">Consultanos</h3>
            <LeadForm />
          </div>
        </div>
      </section>
    </div>
  )
}
