export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { ArrowRight, MessageCircle, Star, CheckCircle } from 'lucide-react'
import { getPropiedadesDestacadas } from '@/lib/propiedades'
import PropertyCard from '@/components/public/PropertyCard'
import LeadForm from '@/components/public/LeadForm'
import { getSupabaseAdmin } from '@/lib/supabase'
import { ZONAS_AGRUPADAS } from '@/lib/barrios'

// Imágenes de AGF Desarrollos — usadas como fondos y referencias visuales
const AGF_IMGS = {
  hero:      'https://static.wixstatic.com/media/1de452_d4a702473ebd4cc69ce744f857b0e02d~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/1de452_d4a702473ebd4cc69ce744f857b0e02d~mv2.jpg',
  interior:  'https://static.wixstatic.com/media/ea26fd_0e8eb61209a542fda3b36451a15530fc~mv2_d_6720_4480_s_4_2.jpg/v1/fill/w_1280,h_854,al_c,q_85,enc_avif,quality_auto/ea26fd_0e8eb61209a542fda3b36451a15530fc~mv2_d_6720_4480_s_4_2.jpg',
  contacto:  'https://static.wixstatic.com/media/11062b_f6eebf57b1d840308426c4bec0c4faa2~mv2.jpg/v1/fill/w_1280,h_854,al_c,q_85,enc_avif,quality_auto/11062b_f6eebf57b1d840308426c4bec0c4faa2~mv2.jpg',
}

const TIPOS = [
  { label: 'Departamento', icon: '🏢', slug: 'departamento', op: 'tipo' },
  { label: 'Casa',         icon: '🏠', slug: 'casa',         op: 'tipo' },
  { label: 'PH',           icon: '🏡', slug: 'ph',           op: 'tipo' },
  { label: 'Local',        icon: '🏪', slug: 'local',        op: 'tipo' },
  { label: 'Oficina',      icon: '💼', slug: 'oficina',      op: 'tipo' },
  { label: 'Galpón',       icon: '🏭', slug: 'galpon',       op: 'tipo' },
  { label: 'Terreno',      icon: '🌿', slug: 'terreno',      op: 'tipo' },
  { label: 'En pozo',      icon: '🏗️', slug: 'pozo',         op: 'operacion' },
]

const TESTIMONIOS = [
  { texto: 'Excelente atención en todo el proceso. Nos ayudaron a encontrar el departamento ideal en Palermo en menos de dos semanas.', autor: 'Martín R.', ciudad: 'Buenos Aires' },
  { texto: 'Hice mi primera inversión inmobiliaria con total confianza. La asesoría fue clara y el proceso, transparente de principio a fin.', autor: 'Alejandro A.', ciudad: 'CABA' },
  { texto: 'Vendimos nuestro PH en Villa Crespo al mejor precio del mercado. Conocen el barrio como nadie.', autor: 'Claudia M.', ciudad: 'Villa Crespo, CABA' },
  { texto: 'Invertí en un proyecto en pozo y la rentabilidad superó mis expectativas. Muy profesionales.', autor: 'Pablo K.', ciudad: 'Buenos Aires' },
  { texto: 'Somos una inmobiliaria del interior y la integración con G&P nos abrió un mercado completamente nuevo en CABA.', autor: 'Inmobiliaria Del Sol', ciudad: 'Córdoba' },
  { texto: 'El equipo de G&P nos acompañó en cada paso, desde la tasación hasta la escritura. Recomiendo totalmente.', autor: 'Sandra F.', ciudad: 'Belgrano, CABA' },
]

async function getProyectosPozo() {
  try {
    const db = getSupabaseAdmin()
    const { data } = await db.from('propiedades')
      .select('id, slug, titulo, descripcion_corta, barrio, precio, moneda, fotos, foto_principal, ambientes, superficie_cubierta')
      .eq('operacion', 'pozo').eq('publicada', true).eq('estado', 'disponible')
      .order('destacada', { ascending: false }).limit(3)
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
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-68px)] flex items-center overflow-hidden">
        {/* Fondo con imagen de AGF */}
        <div className="absolute inset-0">
          <img src={AGF_IMGS.hero} alt="Edificio G&P" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111]/90 via-[#111]/70 to-[#111]/20" />
        </div>

        <div className="relative z-10 px-6 md:px-16 py-24 max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-0.5 bg-[#D85A30]" />
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">
              Negocios Inmobiliarios · CABA
            </span>
          </div>
          <h1 className="font-display font-black uppercase leading-[0.88] tracking-tight text-[clamp(52px,7vw,90px)] text-white mb-6">
            INVERTÍ EN<br />
            <span className="text-[#D85A30]">TU FUTURO</span><br />
            EN BUENOS<br />AIRES
          </h1>
          <p className="text-[17px] font-light leading-relaxed text-white/70 max-w-[480px] mb-10">
            Las mejores propiedades del mercado en un solo lugar. Acompañamos cada etapa, de la búsqueda al cierre.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/propiedades"
              className="flex items-center gap-2 bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[15px] px-8 py-4 rounded-md transition-colors">
              Ver propiedades <ArrowRight size={16} />
            </Link>
            <Link href="/#contacto"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium text-[15px] px-7 py-4 rounded-md transition-colors backdrop-blur-sm">
              Hablar con asesor <MessageCircle size={16} />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-14 pt-10 border-t border-white/15">
            {[['12+','Años en el mercado'],['180+','Operaciones cerradas'],['40+','Propiedades activas']].map(([n,l]) => (
              <div key={l}>
                <div className="font-display font-black text-[36px] text-white leading-none">
                  {n.replace('+','')}<span className="text-[#D85A30]">+</span>
                </div>
                <div className="text-[12px] text-white/50 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-[1px] h-12 bg-white/20" />
        </div>
      </section>

      {/* ── BUSCADOR ─────────────────────────────────────────── */}
      <div className="bg-[#0a0a0a] px-6 md:px-12 py-6 sticky top-[68px] z-40 border-b border-white/5">
        <form action="/propiedades" method="GET"
          className="flex flex-wrap gap-0 bg-white rounded-lg overflow-hidden max-w-4xl mx-auto shadow-xl">
          {[
            { name: 'operacion', options: [['','Operación'],['venta','Venta'],['alquiler','Alquiler'],['pozo','En pozo']] },
            { name: 'tipo',      options: [['','Tipo'],['departamento','Depto'],['casa','Casa'],['ph','PH'],['local','Local'],['oficina','Oficina'],['galpon','Galpón'],['terreno','Terreno']] },
          ].map(({ name, options }) => (
            <select key={name} name={name} className="flex-1 min-w-[130px] border-r border-[#E2E0DC] px-4 py-4 text-[14px] focus:outline-none cursor-pointer bg-white">
              {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ))}
          <select name="barrio" className="flex-1 min-w-[130px] border-r border-[#E2E0DC] px-4 py-4 text-[14px] focus:outline-none cursor-pointer bg-white">
            <option value="">Zona/Barrio</option>
            {ZONAS_AGRUPADAS.map(({ grupo, zonas }) => (
              <optgroup key={grupo} label={grupo}>
                {zonas.map(b => <option key={b} value={b}>{b}</option>)}
              </optgroup>
            ))}
          </select>
          <button type="submit" className="bg-[#D85A30] hover:bg-[#B84A22] text-white font-bold text-[14px] px-8 py-4 transition-colors whitespace-nowrap">
            Buscar
          </button>
        </form>
      </div>

      {/* ── PROPIEDADES DESTACADAS ───────────────────────────── */}
      <section className="px-6 md:px-12 py-24" id="propiedades">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-0.5 bg-[#D85A30]" />
              <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Portfolio</span>
            </div>
            <h2 className="font-display font-black uppercase text-[clamp(36px,4vw,54px)] leading-[0.93] tracking-tight">
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
          <div className="text-center py-20 border-2 border-dashed border-[#E2E0DC] rounded-2xl">
            <div className="text-5xl mb-4 opacity-20">🏠</div>
            <p className="text-[15px] text-[#555]">Las propiedades aparecerán acá cuando estén publicadas.</p>
          </div>
        )}
      </section>

      {/* ── TIPOS ────────────────────────────────────────────── */}
      <section className="bg-[#F5F4F2] px-6 md:px-12 py-20">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-[#D85A30]" />
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Buscá por tipo</span>
            <div className="w-5 h-0.5 bg-[#D85A30]" />
          </div>
          <h2 className="font-display font-black uppercase text-[clamp(34px,4vw,50px)] leading-[0.93] tracking-tight">
            ¿Qué buscás?
          </h2>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 max-w-4xl mx-auto">
          {TIPOS.map(t => (
            <Link key={t.slug}
              href={t.op === 'operacion' ? `/propiedades?operacion=${t.slug}` : `/propiedades?tipo=${t.slug}`}
              className="bg-white border border-[#E2E0DC] rounded-xl p-4 text-center hover:border-[#D85A30] hover:shadow-md transition-all flex flex-col items-center gap-2 no-underline group">
              <span className="text-2xl group-hover:scale-110 transition-transform">{t.icon}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#222] leading-tight">{t.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PROYECTOS EN POZO — solo si hay proyectos ──────── */}
      {proyectosPozo.length > 0 && <section className="relative py-24 overflow-hidden" id="pozo">
        {/* Fondo imagen AGF interior */}
        <div className="absolute inset-0">
          <img src={AGF_IMGS.interior} alt="Proyectos en pozo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#111]/88" />
        </div>
        <div className="relative z-10 px-6 md:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-0.5 bg-[#D85A30]" />
                <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Oportunidades</span>
              </div>
              <h2 className="font-display font-black uppercase text-[clamp(36px,4vw,54px)] leading-[0.93] tracking-tight text-white">
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
                <Link key={p.id} href={`/proyectos/${p.slug}`}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/25 transition-all no-underline group backdrop-blur-sm">
                  <div className="h-52 bg-white/5 relative overflow-hidden">
                    {p.foto_principal
                      ? <img src={p.foto_principal} alt={p.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center text-5xl opacity-10">🏗️</div>
                    }
                    <div className="absolute top-3 left-3 bg-[#D85A30] text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wide">En pozo</div>
                  </div>
                  <div className="p-5">
                    <div className="font-display font-black text-[22px] text-white leading-tight mb-1">{p.titulo}</div>
                    <div className="text-[13px] text-white/40 mb-3 flex items-center gap-1">📍 {p.barrio}</div>
                    {p.descripcion_corta && <p className="text-[13px] text-white/55 leading-relaxed mb-4 line-clamp-2">{p.descripcion_corta}</p>}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="font-display font-black text-[20px] text-[#D85A30]">
                        {p.precio ? `USD ${Number(p.precio).toLocaleString('es-AR')}` : 'Consultar'}
                      </div>
                      <span className="text-[12px] text-white/40 flex items-center gap-1">Ver proyecto <ArrowRight size={11} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-5xl mb-4 opacity-20">🏗️</div>
              <p className="text-white/40 text-[15px]">Los proyectos en pozo aparecerán acá cuando estén publicados.</p>
            </div>
          )}
        </div>
      </section>}

      {/* ── NOSOTROS ─────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center" id="nosotros">
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
          <img src={AGF_IMGS.interior} alt="Nuestro equipo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111]/60 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5">
            <div className="flex gap-3">
              {['Experiencia', 'Transparencia', 'Resultados'].map(v => (
                <div key={v} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white text-[11px] font-semibold uppercase tracking-wide">
                  {v}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-[#D85A30]" />
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Quiénes somos</span>
          </div>
          <h2 className="font-display font-black uppercase text-[clamp(34px,4vw,52px)] leading-[0.93] tracking-tight mb-5">
            TU ASESOR<br />DE CONFIANZA
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-[#555] mb-8">
            Somos una inmobiliaria con años de experiencia en el mercado de CABA y GBA. Accedés a las mejores propiedades del mercado, con acompañamiento real en cada etapa del proceso.
          </p>
          <div className="grid grid-cols-2 gap-5 mb-8">
            {[
              ['Amplio portfolio', 'Venta, alquiler y proyectos en pozo en las mejores zonas.'],
              ['Red de socios', 'Acceso a propiedades exclusivas de toda la red inmobiliaria.'],
              ['Transparencia', 'Documentación clara y acompañamiento en cada etapa.'],
              ['Mercado local', 'Conocemos CABA a fondo: barrios, precios y tendencias.'],
            ].map(([t, d]) => (
              <div key={t} className="flex gap-3">
                <CheckCircle size={16} className="text-[#D85A30] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[14px] font-semibold text-[#111] mb-0.5">{t}</div>
                  <div className="text-[12px] text-[#666] leading-relaxed">{d}</div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/#contacto"
            className="inline-flex items-center gap-2 bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[14px] px-7 py-3.5 rounded-md transition-colors">
            Hablar con un asesor <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIOS ──────────────────────────────────────── */}
      <section className="bg-[#F5F4F2] px-6 md:px-12 py-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-[#D85A30]" />
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Testimonios</span>
            <div className="w-5 h-0.5 bg-[#D85A30]" />
          </div>
          <h2 className="font-display font-black uppercase text-[clamp(34px,4vw,50px)] leading-[0.93] tracking-tight">
            Lo que dicen<br />nuestros clientes
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {TESTIMONIOS.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 border border-[#E2E0DC] shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, s) => <Star key={s} size={14} className="text-[#D85A30]" fill="currentColor" />)}
              </div>
              <p className="text-[14px] text-[#444] leading-relaxed mb-5 italic">"{t.texto}"</p>
              <div>
                <div className="font-semibold text-[14px] text-[#111]">{t.autor}</div>
                <div className="text-[12px] text-[#888]">{t.ciudad}</div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ── SERVICIOS / A QUIÉN AYUDAMOS ─────────────────── */}
      <section className="px-6 md:px-12 py-20 bg-white">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-[#D85A30]" />
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">¿En qué te ayudamos?</span>
            <div className="w-5 h-0.5 bg-[#D85A30]" />
          </div>
          <h2 className="font-display font-black uppercase text-[clamp(34px,4vw,52px)] leading-[0.93] tracking-tight">
            Trabajamos con<br />todos los perfiles
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {[
            {
              icon: '🌿',
              titulo: 'Buscamos terrenos',
              desc: 'Trabajamos con desarrolladores que necesitan tierra. Si tenés un terreno o conocés una oportunidad, hablemos.',
              cta: 'Tengo un terreno',
              href: '/lotes',
              color: 'border-green-200 hover:border-green-400',
              badge: 'Para propietarios',
            },
            {
              icon: '🤝',
              titulo: 'Inmobiliarias de la red',
              desc: 'Sumamos inmobiliarias de todo el país para trabajar en conjunto. Tu cartera más nuestra red.',
              cta: 'Quiero sumarme',
              href: '/marketplace',
              color: 'border-purple-200 hover:border-purple-400',
              badge: 'Para inmobiliarias',
            },
            {
              icon: '🏠',
              titulo: 'Querés vender tu propiedad',
              desc: 'Te ayudamos a tasar, publicar y cerrar la venta al mejor precio del mercado con acompañamiento real.',
              cta: 'Quiero vender',
              href: '/#contacto',
              color: 'border-[#D85A30]/30 hover:border-[#D85A30]',
              badge: 'Para propietarios',
            },
            {
              icon: '🔍',
              titulo: 'Buscás para comprar',
              desc: 'Accedés al portfolio completo y a propiedades exclusivas que no están en los portales públicos.',
              cta: 'Buscar propiedades',
              href: '/propiedades',
              color: 'border-blue-200 hover:border-blue-400',
              badge: 'Para compradores',
            },
          ].map(({ icon, titulo, desc, cta, href, color, badge }) => (
            <a key={titulo} href={href}
              className={`block bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-lg no-underline group ${color}`}>
              <div className="text-3xl mb-4">{icon}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#888] mb-2">{badge}</div>
              <h3 className="font-display font-black text-[20px] uppercase leading-tight mb-3 text-[#111] group-hover:text-[#D85A30] transition-colors">
                {titulo}
              </h3>
              <p className="text-[13px] text-[#666] leading-relaxed mb-5">{desc}</p>
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#D85A30]">
                {cta} →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── CONTACTO ─────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden" id="contacto">
        <div className="absolute inset-0">
          <img src={AGF_IMGS.contacto} alt="Contacto" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#111]/85" />
        </div>
        <div className="relative z-10 px-6 md:px-12">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-0.5 bg-[#D85A30]" />
                <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Contacto</span>
              </div>
              <h2 className="font-display font-black uppercase text-[clamp(36px,4vw,54px)] leading-[0.93] tracking-tight text-white mb-6">
                QUEREMOS<br />CONOCERTE
              </h2>
              <p className="text-[15px] text-white/60 leading-relaxed mb-10 font-light">
                Dejanos un mensaje y un asesor se comunica con vos a la brevedad.
              </p>
              <div className="flex flex-col gap-5">
                {[
                  ['📍', 'Dirección', 'Buenos Aires, CABA, Argentina'],
                  ['📞', 'Teléfono', '+54 9 11 XXXX-XXXX'],
                  ['✉️', 'Email', 'info@gnpinmobiliaria.com.ar'],
                ].map(([icon, label, value]) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-white/40 mb-0.5">{label}</div>
                      <div className="text-[14px] text-white/80">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-7 shadow-2xl">
              <h3 className="font-display font-bold text-[20px] uppercase mb-1">Envianos un mensaje</h3>
              <p className="text-[13px] text-[#888] mb-6">Respondemos en menos de 24 horas.</p>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
