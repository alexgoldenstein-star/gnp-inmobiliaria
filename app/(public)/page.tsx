export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { getPropiedadesDestacadas } from '@/lib/propiedades'
import PropertyCard from '@/components/public/PropertyCard'
import LeadForm from '@/components/public/LeadForm'
import { getSupabaseAdmin } from '@/lib/supabase'

const TIPOS = [
  { label: 'Departamento', icon: '🏢', slug: 'departamento' },
  { label: 'Casa',         icon: '🏠', slug: 'casa' },
  { label: 'PH',           icon: '🏡', slug: 'ph' },
  { label: 'Local',        icon: '🏪', slug: 'local' },
  { label: 'Oficina',      icon: '💼', slug: 'oficina' },
  { label: 'Galpón',       icon: '🏭', slug: 'galpon' },
  { label: 'Terreno',      icon: '🌿', slug: 'terreno' },
  { label: 'En pozo',      icon: '🏗️', slug: 'pozo' },
]

async function getProyectosPozo() {
  try {
    const db = getSupabaseAdmin()
    const { data } = await db
      .from('propiedades')
      .select('id, slug, titulo, descripcion_corta, barrio, precio, moneda, fotos, foto_principal, ambientes, superficie_cubierta')
      .eq('operacion', 'pozo')
      .eq('publicada', true)
      .eq('estado', 'disponible')
      .order('destacada', { ascending: false })
      .limit(3)
    return data ?? []
  } catch { return [] }
}

export default async function HomePage() {
  const [destacadas, proyectosPozo] = await Promise.all([
    getPropiedadesDestacadas(6),
    getProyectosPozo(),
  ])

  return (
    <>
      {/* HERO */}
      <section className="min-h-[calc(100vh-68px)] grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 md:px-12 py-20">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-0.5 bg-[#D85A30]" />
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">
              Negocios Inmobiliarios
            </span>
          </div>
          <h1 className="font-display font-black uppercase leading-[0.92] tracking-tight text-[clamp(52px,7vw,88px)] mb-7">
            TU PRÓXIMA<br />
            <span className="text-[#D85A30]">INVERSIÓN</span><br />
            EMPIEZA ACÁ
          </h1>
          <p className="text-[16px] font-light leading-relaxed text-[#555] max-w-[420px] mb-10">
            Las mejores propiedades del mercado en un solo lugar. Acompañamos cada etapa, de la búsqueda al cierre.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/propiedades"
              className="flex items-center gap-2 bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[14px] px-7 py-3.5 rounded-md transition-colors">
              Ver propiedades <ArrowRight size={16} />
            </Link>
            <Link href="/#contacto"
              className="flex items-center gap-2 border border-[#E2E0DC] hover:border-[#111] text-[#111] font-medium text-[14px] px-6 py-3.5 rounded-md transition-colors">
              Hablar con un asesor <MessageCircle size={16} />
            </Link>
          </div>
          <div className="flex gap-10 mt-14 pt-10 border-t border-[#E2E0DC]">
            {[['12+', 'Años en el mercado'], ['180+', 'Operaciones cerradas'], ['40+', 'Propiedades activas']].map(([num, label]) => (
              <div key={label}>
                <div className="font-display font-black text-[34px] leading-none">
                  {num.replace('+', '')}<span className="text-[#D85A30]">+</span>
                </div>
                <div className="text-[12px] font-medium text-[#555] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center bg-[#F5F4F2] relative overflow-hidden">
          <div className="text-[100px] opacity-10">🏙️</div>
          <div className="absolute bottom-8 left-8 bg-white rounded-xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#D85A30] flex items-center justify-center text-[20px]">🏢</div>
            <div>
              <div className="font-display font-black text-[22px] leading-none">G&P</div>
              <div className="text-[11px] text-[#555] mt-0.5">Negocios Inmobiliarios</div>
            </div>
          </div>
        </div>
      </section>

      {/* BUSCADOR */}
      <div className="bg-[#111] px-6 md:px-12 py-8">
        <form action="/propiedades" method="GET"
          className="flex flex-wrap gap-0 bg-white rounded-lg overflow-hidden max-w-4xl mx-auto">
          <select name="operacion" className="flex-1 min-w-[140px] border-r border-[#E2E0DC] px-4 py-4 text-[14px] focus:outline-none cursor-pointer bg-white">
            <option value="">Operación</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
            <option value="pozo">En pozo</option>
          </select>
          <select name="tipo" className="flex-1 min-w-[140px] border-r border-[#E2E0DC] px-4 py-4 text-[14px] focus:outline-none cursor-pointer bg-white">
            <option value="">Tipo</option>
            <option value="departamento">Departamento</option>
            <option value="casa">Casa</option>
            <option value="ph">PH</option>
            <option value="local">Local</option>
            <option value="oficina">Oficina</option>
            <option value="galpon">Galpón</option>
            <option value="terreno">Terreno</option>
          </select>
          <select name="barrio" className="flex-1 min-w-[140px] border-r border-[#E2E0DC] px-4 py-4 text-[14px] focus:outline-none cursor-pointer bg-white">
            <option value="">Zona / Barrio</option>
            <option>Palermo</option><option>Recoleta</option><option>Belgrano</option>
            <option>Caballito</option><option>Villa Crespo</option><option>Almagro</option>
            <option>Núñez</option><option>San Telmo</option><option>Puerto Madero</option>
          </select>
          <button type="submit" className="bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[14px] px-8 py-4 transition-colors whitespace-nowrap">
            Buscar
          </button>
        </form>
      </div>

      {/* PROPIEDADES DESTACADAS */}
      <section className="px-6 md:px-12 py-24" id="propiedades">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-0.5 bg-[#D85A30]" />
              <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Portfolio</span>
            </div>
            <h2 className="font-display font-black uppercase text-[clamp(36px,4vw,52px)] leading-[0.95] tracking-tight">
              Propiedades<br />destacadas
            </h2>
          </div>
          <Link href="/propiedades" className="hidden md:flex items-center gap-2 border border-[#E2E0DC] hover:border-[#111] text-[14px] font-medium px-5 py-2.5 rounded-md transition-colors">
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>
        {destacadas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destacadas.map(p => <PropertyCard key={p.id} prop={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-[#555]">
            <div className="text-5xl mb-4 opacity-20">🏠</div>
            <p className="text-[15px]">Las propiedades aparecerán acá cuando estén publicadas.</p>
          </div>
        )}
      </section>

      {/* TIPOS */}
      <section className="bg-[#F5F4F2] px-6 md:px-12 py-20">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-[#D85A30]" />
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Buscá por tipo</span>
            <div className="w-5 h-0.5 bg-[#D85A30]" />
          </div>
          <h2 className="font-display font-black uppercase text-[clamp(34px,4vw,50px)] leading-[0.95] tracking-tight">
            ¿Qué buscás?
          </h2>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 max-w-4xl mx-auto">
          {TIPOS.map(t => (
            <Link key={t.slug} href={t.slug === 'pozo' ? '/propiedades?operacion=pozo' : `/propiedades?tipo=${t.slug}`}
              className="border border-[#E2E0DC] rounded-xl p-4 text-center hover:border-[#D85A30] hover:bg-[#FDF3EF] transition-all flex flex-col items-center gap-2 no-underline">
              <span className="text-2xl">{t.icon}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#222] leading-tight">{t.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* PROYECTOS EN POZO */}
      <section className="px-6 md:px-12 py-24 bg-[#111] text-white" id="pozo">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-0.5 bg-[#D85A30]" />
              <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Oportunidades</span>
            </div>
            <h2 className="font-display font-black uppercase text-[clamp(36px,4vw,52px)] leading-[0.95] tracking-tight text-white">
              Proyectos<br />en pozo
            </h2>
            <p className="text-[15px] text-white/50 mt-3 max-w-md font-light">
              Invertí desde el inicio y maximizá tu rentabilidad. Los mejores proyectos en desarrollo de CABA y GBA.
            </p>
          </div>
          <Link href="/propiedades?operacion=pozo"
            className="hidden md:flex items-center gap-2 border border-white/20 hover:border-white text-white text-[14px] font-medium px-5 py-2.5 rounded-md transition-colors">
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>

        {proyectosPozo.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proyectosPozo.map((p: any) => (
              <Link key={p.id} href={`/propiedades/${p.slug}`}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all no-underline group">
                <div className="h-48 bg-white/5 relative overflow-hidden">
                  {p.foto_principal
                    ? <img src={p.foto_principal} alt={p.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center text-5xl opacity-10">🏗️</div>
                  }
                  <div className="absolute top-3 left-3 bg-[#D85A30] text-white text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wide">En pozo</div>
                </div>
                <div className="p-5">
                  <div className="font-display font-black text-[22px] text-white leading-tight mb-1">{p.titulo}</div>
                  <div className="text-[13px] text-white/50 mb-3">{p.barrio}</div>
                  {p.descripcion_corta && <p className="text-[13px] text-white/60 leading-relaxed mb-4 line-clamp-2">{p.descripcion_corta}</p>}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="font-display font-black text-[20px] text-[#D85A30]">
                      {p.precio ? `USD ${p.precio.toLocaleString('es-AR')}` : 'Consultar precio'}
                    </div>
                    <span className="text-[12px] text-white/40 flex items-center gap-1">Ver proyecto <ArrowRight size={11} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-white/10 rounded-xl">
            <div className="text-5xl mb-4 opacity-20">🏗️</div>
            <p className="text-white/40 text-[15px]">Los proyectos en pozo aparecerán acá cuando estén publicados.</p>
            <Link href="/propiedades?operacion=pozo" className="mt-4 inline-block text-[#D85A30] hover:underline text-[14px]">
              Ver todos los proyectos →
            </Link>
          </div>
        )}
      </section>

      {/* NOSOTROS */}
      <section className="bg-white px-6 md:px-12 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center" id="nosotros">
        <div className="hidden md:flex items-center justify-center rounded-xl bg-[#F5F4F2] aspect-[4/3] text-[80px] opacity-10">🏙️</div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-[#D85A30]" />
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Quiénes somos</span>
          </div>
          <h2 className="font-display font-black uppercase text-[clamp(36px,4vw,52px)] leading-[0.95] tracking-tight mb-5">
            TU ASESOR<br />DE CONFIANZA
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-[#555] mb-10">
            Somos una inmobiliaria con años de experiencia en el mercado de CABA y GBA. Accedés a las mejores propiedades del mercado, con acompañamiento real en cada etapa del proceso.
          </p>
          <div className="grid grid-cols-2 gap-6">
            {[
              ['Amplio portfolio', 'Venta, alquiler y proyectos en pozo en las mejores zonas.'],
              ['Red de inmobiliarias', 'Acceso a propiedades exclusivas de toda la red.'],
              ['Transparencia', 'Documentación clara y acompañamiento en cada etapa.'],
              ['Mercado local', 'Conocemos CABA a fondo: barrios, precios y tendencias.'],
            ].map(([title, desc]) => (
              <div key={title} className="border-t-2 border-[#E2E0DC] pt-4">
                <div className="font-display font-bold text-[17px] uppercase text-[#111] mb-1">{title}</div>
                <div className="text-[12px] text-[#555] leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="bg-[#F5F4F2] px-6 md:px-12 py-24" id="contacto">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-5 h-0.5 bg-[#D85A30]" />
              <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Contacto</span>
              <div className="w-5 h-0.5 bg-[#D85A30]" />
            </div>
            <h2 className="font-display font-black uppercase text-[clamp(34px,4vw,50px)] leading-[0.95] tracking-tight mb-4">
              ¿TENÉS UNA<br />CONSULTA?
            </h2>
            <p className="text-[15px] text-[#555] font-light">Un asesor se comunica con vos en menos de 24 horas.</p>
          </div>
          <div className="bg-white rounded-xl p-6 md:p-8 border border-[#E2E0DC]">
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  )
}
