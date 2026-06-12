import Navbar from '@/components/public/Navbar'

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
      <a
        href="https://wa.me/5491112345678?text=Hola!%20Vi%20el%20portal%20de%20G%26P%20Negocios%20Inmobiliarios%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1fb558] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
        aria-label="Contactar por WhatsApp"
      >
        <svg width="28" height="28" fill="white" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  )
}
