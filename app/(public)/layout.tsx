import Navbar from '@/components/public/Navbar'
import WAButton from '@/components/public/WAButton'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-[68px]">{children}</main>
      <footer className="bg-[#0a0a0a] text-white px-6 md:px-12 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-[#D85A30] rounded-md flex items-center justify-center font-display font-black text-base text-white">G&P</div>
              <span className="font-display font-bold text-base uppercase tracking-wide">Negocios Inmobiliarios</span>
            </div>
            <p className="text-[13px] text-white/40 leading-relaxed max-w-[260px]">
              Las mejores propiedades del mercado en un solo lugar. Acompañamos cada etapa, de la búsqueda al cierre.
            </p>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-4">Propiedades</div>
            <ul className="space-y-3 text-[13px] text-white/60">
              <li><a href="/propiedades?operacion=venta" className="hover:text-white transition-colors">Venta</a></li>
              <li><a href="/propiedades?operacion=alquiler" className="hover:text-white transition-colors">Alquiler</a></li>
              <li><a href="/propiedades?operacion=pozo" className="hover:text-white transition-colors">En pozo</a></li>
              <li><a href="/lotes" className="hover:text-white transition-colors">Lotes</a></li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-4">La red</div>
            <ul className="space-y-3 text-[13px] text-white/60">
              <li><a href="/#nosotros" className="hover:text-white transition-colors">Nosotros</a></li>
              <li><a href="/marketplace" className="hover:text-white transition-colors">Sumá tu inmobiliaria</a></li>
              <li><a href="/#contacto" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-4">Contacto</div>
            <ul className="space-y-3 text-[13px] text-white/60">
              <li><a href="https://wa.me/5491112345678" className="hover:text-white transition-colors">WhatsApp</a></li>
              <li><a href="mailto:info@gnpinmobiliaria.com.ar" className="hover:text-white transition-colors">info@gnpinmobiliaria.com.ar</a></li>
              <li><a href="https://instagram.com" className="hover:text-white transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[12px] text-white/30">
          <span>© 2025 G&P Negocios Inmobiliarios. Todos los derechos reservados.</span>
          <span>Matrícula CUCICBA · CABA, Argentina</span>
        </div>
      </footer>

      {/* WhatsApp flotante */}
      <WAButton phone="5491112345678" />
    </>
  )
}
