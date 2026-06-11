import LeadFormMarketplace from '@/components/public/LeadFormMarketplace'
import { CheckCircle, ArrowRight, Building2, MapPin, Handshake, Network } from 'lucide-react'

const BENEFICIOS = [
  {
    icon: Network,
    titulo: 'Integración nacional',
    desc: 'Formá parte de una red de inmobiliarias de todo el país. Tu cartera se potencia con nuestra presencia en CABA y GBA.',
  },
  {
    icon: Building2,
    titulo: 'Mayor visibilidad',
    desc: 'Tus propiedades llegan a miles de compradores e inversores que buscan activamente en nuestro portal.',
  },
  {
    icon: Handshake,
    titulo: 'Trabajo en conjunto',
    desc: 'Operamos en colaboración. Compartimos cartera, conocimiento del mercado y oportunidades entre toda la red.',
  },
  {
    icon: MapPin,
    titulo: 'Cobertura nacional',
    desc: 'Clientes del interior que buscan en CABA y GBA. Tu zona de origen se convierte en una ventaja competitiva.',
  },
]

export default function MarketplacePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#111] text-white px-6 md:px-12 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-5 h-0.5 bg-[#D85A30]" />
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Red de inmobiliarias</span>
            <div className="w-5 h-0.5 bg-[#D85A30]" />
          </div>
          <h1 className="font-display font-black uppercase text-[clamp(44px,6vw,72px)] leading-[0.9] tracking-tight mb-6">
            SUMÁ TU<br />INMOBILIARIA<br />
            <span className="text-[#D85A30]">A LA RED G&P</span>
          </h1>
          <p className="text-[17px] font-light leading-relaxed text-white/60 max-w-xl mx-auto mb-10">
            Trabajamos en conjunto con inmobiliarias de todo el país para ofrecer el mejor portfolio del mercado. Potenciamos tu cartera con nuestra red.
          </p>
          <a href="#solicitar"
            className="inline-flex items-center gap-2 bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[16px] px-8 py-4 rounded-md transition-colors">
            Quiero sumarme <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* Beneficios */}
      <section className="px-6 md:px-12 py-20 bg-[#F5F4F2]">
        <div className="text-center mb-12">
          <h2 className="font-display font-black uppercase text-[clamp(32px,4vw,48px)] leading-[0.93] tracking-tight">
            Una red que<br />trabaja para vos
          </h2>
          <p className="text-[15px] text-[#555] mt-4 max-w-lg mx-auto">
            Más que un portal — una red de trabajo colaborativo entre inmobiliarias del mercado argentino.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {BENEFICIOS.map(({ icon: Icon, titulo, desc }) => (
            <div key={titulo} className="bg-white rounded-xl p-6 border border-[#E2E0DC] hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-[#FDF3EF] rounded-lg flex items-center justify-center mb-4">
                <Icon size={20} className="text-[#D85A30]" />
              </div>
              <h3 className="font-semibold text-[15px] mb-2">{titulo}</h3>
              <p className="text-[13px] text-[#666] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-[#111] text-white px-6 md:px-12 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display font-black uppercase text-[clamp(32px,4vw,48px)] leading-[0.93] tracking-tight">
            Cómo funciona
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            ['01', 'Contacto inicial', 'Completás el formulario con los datos de tu inmobiliaria y zona de operación.'],
            ['02', 'Conversamos', 'Nuestro equipo te contacta para conocer tu cartera y definir la mejor forma de trabajar juntos.'],
            ['03', 'Publicás tu cartera', 'Accedés a publicar tus propiedades en el portal G&P con tu marca.'],
            ['04', 'Operamos juntos', 'Trabajamos en conjunto para cerrar operaciones, compartiendo expertise y oportunidades.'],
          ].map(([num, titulo, desc]) => (
            <div key={num} className="text-center">
              <div className="w-12 h-12 bg-[#D85A30] rounded-full flex items-center justify-center font-display font-black text-xl text-white mx-auto mb-4">
                {num}
              </div>
              <h3 className="font-semibold text-[15px] mb-2 text-white">{titulo}</h3>
              <p className="text-[13px] text-white/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulario */}
      <section className="px-6 md:px-12 py-20 bg-[#F5F4F2]" id="solicitar">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display font-black uppercase text-[clamp(32px,4vw,48px)] leading-[0.93] tracking-tight mb-3">
              Hablemos
            </h2>
            <p className="text-[15px] text-[#555]">
              Completá el formulario y alguien del equipo de G&P se comunica con vos a la brevedad.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-[#E2E0DC] shadow-sm">
            <LeadFormMarketplace />
          </div>
        </div>
      </section>
    </div>
  )
}
