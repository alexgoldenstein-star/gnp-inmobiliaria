export const dynamic = 'force-dynamic'
import { getSupabaseAdmin } from '@/lib/supabase'
import PropertyCard from '@/components/public/PropertyCard'
import LeadForm from '@/components/public/LeadForm'
import Link from 'next/link'
import { ArrowRight, MapPin, Ruler, FileText, Phone } from 'lucide-react'
import type { Propiedad } from '@/types'

async function getLotes() {
  try {
    const db = getSupabaseAdmin()
    const { data } = await db.from('propiedades')
      .select('*')
      .eq('tipo', 'terreno')
      .eq('publicada', true)
      .eq('estado', 'disponible')
      .order('destacada', { ascending: false })
    return (data ?? []) as Propiedad[]
  } catch { return [] }
}

export default async function LotesPage() {
  const lotes = await getLotes()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#111] text-white px-6 md:px-16 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,.1) 40px, rgba(255,255,255,.1) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,.1) 40px, rgba(255,255,255,.1) 41px)' }} />
        <div className="relative max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-0.5 bg-[#D85A30]" />
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Para desarrolladores</span>
          </div>
          <h1 className="font-display font-black uppercase text-[clamp(48px,6vw,80px)] leading-[0.9] tracking-tight mb-5">
            LOTES Y<br />TERRENOS<br />
            <span className="text-[#D85A30]">ESTRATÉGICOS</span>
          </h1>
          <p className="text-[16px] font-light leading-relaxed text-white/60 max-w-xl mb-10">
            Terrenos seleccionados para desarrolladores. Trabajamos con desarrolladores de CABA y GBA que buscan oportunidades con potencial constructivo real.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="#lotes"
              className="flex items-center gap-2 bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[15px] px-7 py-3.5 rounded-md transition-colors">
              Ver disponibles <ArrowRight size={16} />
            </a>
            <a href="#contacto-lotes"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-[15px] px-6 py-3.5 rounded-md transition-colors">
              Consultar <Phone size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* Qué ofrecemos */}
      <section className="bg-[#F5F4F2] px-6 md:px-12 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            [MapPin, 'Ubicaciones seleccionadas', 'Lotes en zonas de alta demanda y crecimiento, con análisis previo de potencial constructivo.'],
            [Ruler, 'Toda la información técnica', 'Medidas, FOS/FOT, zonificación, servicios disponibles y restricciones urbanísticas incluidas.'],
            [FileText, 'Gestión documental', 'Acompañamiento en la due diligence, título, planos y trámites municipales.'],
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
      </section>

      {/* Grid de lotes */}
      <section className="px-6 md:px-12 py-16" id="lotes">
        <div className="flex justify-between items-end mb-10">
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

        {lotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lotes.map(l => <PropertyCard key={l.id} prop={l} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#F5F4F2] rounded-2xl border-2 border-dashed border-[#E2E0DC]">
            <div className="text-5xl mb-4 opacity-20">🌿</div>
            <h3 className="font-display font-bold text-[22px] uppercase mb-2">Próximamente</h3>
            <p className="text-[15px] text-[#555] mb-6 max-w-sm mx-auto">
              Estamos relevando nuevas oportunidades. Dejanos tu consulta y te avisamos cuando haya disponibilidad.
            </p>
            <a href="#contacto-lotes"
              className="inline-flex items-center gap-2 bg-[#D85A30] text-white font-semibold text-[14px] px-6 py-3 rounded-md hover:bg-[#B84A22] transition-colors">
              Consultar disponibilidad
            </a>
          </div>
        )}
      </section>

      {/* Contacto específico para lotes */}
      <section className="bg-[#111] text-white px-6 md:px-12 py-20" id="contacto-lotes">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-0.5 bg-[#D85A30]" />
              <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Desarrolladores</span>
            </div>
            <h2 className="font-display font-black uppercase text-[clamp(32px,4vw,48px)] leading-[0.93] tracking-tight text-white mb-5">
              ¿BUSCÁS UN<br />TERRENO?
            </h2>
            <p className="text-[15px] text-white/60 leading-relaxed mb-8 font-light">
              Trabajamos con desarrolladores que buscan terrenos con características específicas. Contanos qué necesitás y lo buscamos por vos.
            </p>
            <div className="flex flex-col gap-4">
              {[
                ['Zona objetivo', 'CABA y GBA — cualquier barrio'],
                ['Superficie mínima', 'Desde 200 m² en adelante'],
                ['Tipo de gestión', 'Venta directa y opciones'],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D85A30] shrink-0" />
                  <span className="text-[13px] text-white/50">{label}:</span>
                  <span className="text-[13px] text-white/80">{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-7 shadow-2xl">
            <h3 className="font-display font-bold text-[18px] uppercase mb-1 text-[#111]">Consultá disponibilidad</h3>
            <p className="text-[13px] text-[#888] mb-5">Un asesor especializado en terrenos se comunica con vos.</p>
            <LeadForm />
          </div>
        </div>
      </section>
    </div>
  )
}
