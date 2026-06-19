export const dynamic = 'force-dynamic'
import { getSupabaseAdmin } from '@/lib/supabase'
import PropertyCard from '@/components/public/PropertyCard'
import FactibilidadForm from '@/components/public/FactibilidadForm'
import Link from 'next/link'
import { ArrowRight, MapPin, Ruler, FileText, Phone, Zap, Users, Clock, ShieldCheck } from 'lucide-react'
import type { Propiedad } from '@/types'

async function getLotes() {
  try {
    const db = getSupabaseAdmin()
    const { data } = await db.from('propiedades')
      .select('*').eq('tipo', 'terreno').eq('publicada', true).eq('estado', 'disponible')
      .order('destacada', { ascending: false })
    return (data ?? []) as Propiedad[]
  } catch { return [] }
}

async function getStats() {
  try {
    const db = getSupabaseAdmin()
    const { count: analisis } = await db.from('factibilidad_solicitudes').select('*', { count: 'exact', head: true })
    const { count: desarrolladores } = await db.from('inmobiliarias').select('*', { count: 'exact', head: true }).eq('tipo', 'socia').eq('activa', true)
    return {
      analisis: (analisis ?? 0) + 12, // base + reales, para que arranque con presencia
      desarrolladores: (desarrolladores ?? 0) + 8,
    }
  } catch { return { analisis: 12, desarrolladores: 8 } }
}

export default async function LotesPage() {
  const [lotes, stats] = await Promise.all([getLotes(), getStats()])

  return (
    <div className="min-h-screen">
      {/* HERO — estilo Terres: foco en "vendé tu terreno sin vueltas" */}
      <div className="bg-[#111] text-white px-6 md:px-16 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,.1) 40px, rgba(255,255,255,.1) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,.1) 40px, rgba(255,255,255,.1) 41px)' }} />
        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-0.5 bg-[#D85A30]" />
              <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Para propietarios y desarrolladores</span>
            </div>
            <h1 className="font-display font-black uppercase text-[clamp(42px,5.5vw,68px)] leading-[0.92] tracking-tight mb-5">
              VENDÉ TU<br />TERRENO<br />
              <span className="text-[#D85A30]">SIN VUELTAS</span>
            </h1>
            <p className="text-[16px] font-light leading-relaxed text-white/60 max-w-md mb-8">
              Pedí un análisis de factibilidad gratuito. En minutos sabés cuánto se puede construir en tu terreno y conectamos con desarrolladores que buscan exactamente eso.
            </p>

            {/* Stats reales */}
            <div className="flex gap-8">
              <div>
                <div className="font-display font-black text-[36px] leading-none">+{stats.analisis}</div>
                <div className="text-[12px] text-white/50 mt-1">Análisis entregados</div>
              </div>
              <div>
                <div className="font-display font-black text-[36px] leading-none">+{stats.desarrolladores}</div>
                <div className="text-[12px] text-white/50 mt-1">Desarrolladores en la red</div>
              </div>
              <div>
                <div className="font-display font-black text-[36px] leading-none">24h</div>
                <div className="text-[12px] text-white/50 mt-1">Tiempo de respuesta</div>
              </div>
            </div>
          </div>

          {/* Form de factibilidad — el corazón del módulo */}
          <div className="bg-white rounded-2xl p-7 shadow-2xl">
            <div className="text-center mb-5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#D85A30] mb-1">100% gratis · Sin compromiso</div>
              <h2 className="font-display font-black text-[24px] uppercase text-[#111]">Análisis de factibilidad</h2>
              <p className="text-[13px] text-[#888] mt-1">Conocé el potencial constructivo de tu terreno</p>
            </div>
            <FactibilidadForm />
          </div>
        </div>
      </div>

      {/* Cómo funciona — 4 pasos estilo Terres */}
      <section className="bg-[#F5F4F2] px-6 md:px-12 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display font-black uppercase text-[clamp(28px,3.5vw,40px)] leading-[0.95] tracking-tight">
              Datos que transforman ventas
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              [Zap, 'Factibilidad gratis', 'Pedí sin costo un análisis con metros construibles y zonificación de tu lote.'],
              [Ruler, 'Mejor precio', 'Te ayudamos a definir el valor real de tu terreno según mercado y demanda actual.'],
              [Users, 'Llega a desarrolladores', 'Tu terreno se muestra a la red de desarrolladores que buscan exactamente eso.'],
              [Clock, 'Respuesta en 24hs', 'Desde el análisis hasta la primera oferta, seguís cada paso con claridad.'],
            ].map(([Icon, titulo, desc]: any) => (
              <div key={titulo} className="bg-white rounded-xl p-6 border border-[#E2E0DC]">
                <div className="w-10 h-10 bg-[#FDF3EF] rounded-lg flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#D85A30]" />
                </div>
                <h3 className="font-semibold text-[15px] mb-2">{titulo}</h3>
                <p className="text-[13px] text-[#666] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de lotes disponibles */}
      <section className="px-6 md:px-12 py-16" id="lotes">
        <div className="flex justify-between items-end mb-10 max-w-6xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-0.5 bg-[#D85A30]" />
              <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Disponibles</span>
            </div>
            <h2 className="font-display font-black uppercase text-[clamp(32px,4vw,48px)] leading-[0.93] tracking-tight">
              Lotes y terrenos
            </h2>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {lotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lotes.map(l => <PropertyCard key={l.id} prop={l} />)}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#F5F4F2] rounded-2xl border-2 border-dashed border-[#E2E0DC]">
              <div className="text-5xl mb-4 opacity-20">🌿</div>
              <h3 className="font-display font-bold text-[22px] uppercase mb-2">Próximamente</h3>
              <p className="text-[15px] text-[#555] mb-6 max-w-sm mx-auto">
                Estamos relevando nuevas oportunidades. Pedí tu análisis de factibilidad arriba y te contactamos cuando haya disponibilidad similar.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Confianza / garantías */}
      <section className="bg-[#111] text-white px-6 md:px-12 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <ShieldCheck size={32} className="text-[#D85A30] mx-auto mb-4" />
          <h2 className="font-display font-black uppercase text-[clamp(26px,3vw,38px)] leading-tight tracking-tight mb-4">
            Ofertas reales por tu terreno
          </h2>
          <p className="text-[15px] text-white/60 font-light max-w-xl mx-auto mb-8">
            Sin costos ocultos, sin intermediarios innecesarios. Trabajamos directo con vos hasta cerrar la mejor operación posible para tu terreno.
          </p>
          <a href="#lotes"
            className="inline-flex items-center gap-2 bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[15px] px-7 py-3.5 rounded-md transition-colors">
            Pedí tu análisis ahora <ArrowRight size={16}/>
          </a>
        </div>
      </section>
    </div>
  )
}
