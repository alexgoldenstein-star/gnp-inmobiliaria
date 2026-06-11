import LeadFormMarketplace from '@/components/public/LeadFormMarketplace'
import { CheckCircle, ArrowRight, Building2, Users, TrendingUp, Globe } from 'lucide-react'

const PLANES = [
  {
    nombre: 'Starter',
    precio: 'USD 49',
    periodo: '/mes',
    descripcion: 'Ideal para inmobiliarias que empiezan',
    features: ['Hasta 15 propiedades', '2 destacados por mes', 'Perfil de inmobiliaria', 'Leads directos', 'Soporte por email'],
    color: 'border-[#E2E0DC]',
    badge: '',
    cta: 'Empezar gratis 30 días',
  },
  {
    nombre: 'Pro',
    precio: 'USD 99',
    periodo: '/mes',
    descripcion: 'Para inmobiliarias con volumen',
    features: ['Propiedades ilimitadas', '10 destacados por mes', 'Badge verificado ✓', 'Leads prioritarios', 'Panel de estadísticas', 'Soporte prioritario'],
    color: 'border-[#D85A30] ring-2 ring-[#D85A30]/20',
    badge: 'Más elegido',
    cta: 'Elegir Pro',
  },
  {
    nombre: 'Enterprise',
    precio: 'A convenir',
    periodo: '',
    descripcion: 'Para redes y franquicias',
    features: ['Todo lo de Pro', 'Multi-usuario', 'Integración XML/API', 'Comisiones personalizadas', 'Account manager dedicado'],
    color: 'border-[#111]',
    badge: '',
    cta: 'Hablar con ventas',
  },
]

const BENEFICIOS = [
  { icon: Globe, titulo: 'Alcance ampliado', desc: 'Tus propiedades llegan a miles de compradores en nuestro portal.' },
  { icon: Users, titulo: 'Leads calificados', desc: 'Recibís consultas directas de clientes que ya filtraron por lo que buscan.' },
  { icon: TrendingUp, titulo: 'Comisión compartida', desc: 'Acordamos un split justo por cada operación cerrada.' },
  { icon: Building2, titulo: 'Red del interior', desc: 'Conectamos inmobiliarias del interior con compradores de CABA.' },
]

export default function MarketplacePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#111] text-white px-6 md:px-12 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-5 h-0.5 bg-[#D85A30]" />
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Para inmobiliarias</span>
            <div className="w-5 h-0.5 bg-[#D85A30]" />
          </div>
          <h1 className="font-display font-black uppercase text-[clamp(44px,6vw,72px)] leading-[0.9] tracking-tight mb-6">
            PUBLICÁ TUS<br />PROPIEDADES<br />
            <span className="text-[#D85A30]">EN G&P</span>
          </h1>
          <p className="text-[17px] font-light leading-relaxed text-white/60 max-w-xl mx-auto mb-10">
            Sumá tus propiedades a nuestro portal y llegá a más compradores. Comisión compartida, leads directos y soporte real.
          </p>
          <a href="#solicitar"
            className="inline-flex items-center gap-2 bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[16px] px-8 py-4 rounded-md transition-colors">
            Quiero publicar <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* Beneficios */}
      <section className="px-6 md:px-12 py-20 bg-[#F5F4F2]">
        <div className="text-center mb-12">
          <h2 className="font-display font-black uppercase text-[clamp(32px,4vw,48px)] leading-[0.93] tracking-tight">
            ¿Por qué publicar<br />en G&P?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {BENEFICIOS.map(({ icon: Icon, titulo, desc }) => (
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

      {/* Planes */}
      <section className="px-6 md:px-12 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display font-black uppercase text-[clamp(32px,4vw,48px)] leading-[0.93] tracking-tight">
            Planes y precios
          </h2>
          <p className="text-[15px] text-[#555] mt-3">30 días gratis en el plan Starter. Sin tarjeta de crédito.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANES.map(p => (
            <div key={p.nombre} className={`bg-white rounded-2xl border-2 p-8 relative ${p.color}`}>
              {p.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D85A30] text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                  {p.badge}
                </div>
              )}
              <div className="mb-6">
                <div className="font-display font-black text-[20px] uppercase mb-1">{p.nombre}</div>
                <div className="text-[13px] text-[#888] mb-4">{p.descripcion}</div>
                <div className="flex items-end gap-1">
                  <span className="font-display font-black text-[38px] leading-none">{p.precio}</span>
                  {p.periodo && <span className="text-[14px] text-[#888] mb-1">{p.periodo}</span>}
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px]">
                    <CheckCircle size={15} className="text-[#D85A30] shrink-0 mt-0.5" />
                    <span className="text-[#444]">{f}</span>
                  </li>
                ))}
              </ul>
              <a href="#solicitar"
                className={`w-full block text-center font-semibold text-[14px] py-3 rounded-md transition-colors
                  ${p.badge ? 'bg-[#D85A30] hover:bg-[#B84A22] text-white' : 'border border-[#E2E0DC] hover:border-[#111] text-[#111]'}`}>
                {p.cta}
              </a>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            ['01', 'Solicitás el alta', 'Completás el formulario con los datos de tu inmobiliaria.'],
            ['02', 'Te aprobamos', 'Revisamos el perfil y te damos acceso en 24hs.'],
            ['03', 'Cargás propiedades', 'Publicás desde tu panel con fotos, precios y detalles.'],
            ['04', 'Recibís leads', 'Los interesados te contactan directo. Compartimos comisión al cerrar.'],
          ].map(([num, titulo, desc]) => (
            <div key={num} className="text-center">
              <div className="w-12 h-12 bg-[#D85A30] rounded-full flex items-center justify-center font-display font-black text-xl text-white mx-auto mb-4">
                {num}
              </div>
              <h3 className="font-semibold text-[15px] mb-2">{titulo}</h3>
              <p className="text-[13px] text-white/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulario de solicitud */}
      <section className="px-6 md:px-12 py-20 bg-[#F5F4F2]" id="solicitar">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display font-black uppercase text-[clamp(32px,4vw,48px)] leading-[0.93] tracking-tight mb-3">
              Solicitá el alta
            </h2>
            <p className="text-[15px] text-[#555]">Completá el formulario y te contactamos en menos de 24 horas.</p>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-[#E2E0DC] shadow-sm">
            <LeadFormMarketplace />
          </div>
        </div>
      </section>
    </div>
  )
}
