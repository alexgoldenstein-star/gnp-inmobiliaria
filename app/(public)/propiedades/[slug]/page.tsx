import { getPropiedadBySlug, formatPrecio } from '@/lib/propiedades'
import { notFound } from 'next/navigation'
import LeadForm from '@/components/public/LeadForm'
import { MapPin, Home, Bath, Car, Square, Star, Phone } from 'lucide-react'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const prop = await getPropiedadBySlug(slug)
  if (!prop) return { title: 'Propiedad no encontrada' }
  return {
    title: `${prop.titulo} | G&P Negocios Inmobiliarios`,
    description: prop.meta_descripcion ?? prop.descripcion_corta ?? prop.descripcion?.substring(0, 160),
    openGraph: { images: prop.foto_principal ? [prop.foto_principal] : [] }
  }
}

export default async function PropiedadPage({ params }: Props) {
  const { slug } = await params
  const prop = await getPropiedadBySlug(slug)
  if (!prop) notFound()

  return (
    <div className="min-h-screen">
      {/* Galería */}
      <div className="bg-[#F5F4F2] h-[50vh] md:h-[60vh] relative overflow-hidden">
        {prop.foto_principal ? (
          <img src={prop.foto_principal} alt={prop.titulo} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[100px] opacity-10">🏢</div>
        )}
        {prop.fotos.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[13px] font-medium px-3 py-1.5 rounded-lg">
            📸 {prop.fotos.length} fotos
          </div>
        )}
        {prop.destacada && (
          <div className="absolute top-4 left-4 bg-[#D85A30] text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Star size={12} fill="white" /> Destacada
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {/* Info principal */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#111] text-white text-[11px] font-semibold px-2.5 py-1 rounded uppercase tracking-wide">{prop.operacion}</span>
            <span className="text-[13px] text-[#555] capitalize">{prop.tipo}</span>
          </div>
          <h1 className="font-display font-black text-[40px] md:text-[52px] uppercase leading-[0.95] tracking-tight mb-3">
            {prop.titulo}
          </h1>
          <div className="flex items-center gap-1.5 text-[15px] text-[#555] mb-6">
            <MapPin size={15} /> {prop.barrio}{prop.partido ? `, ${prop.partido}` : ''} — {prop.provincia}
          </div>

          <div className="font-display font-black text-[42px] text-[#D85A30] mb-8">
            {formatPrecio(prop.precio, prop.moneda)}
            {prop.operacion === 'alquiler' && <span className="text-[20px] text-[#555] font-normal ml-2">/ mes</span>}
            {prop.expensas && <span className="text-[16px] text-[#555] font-normal ml-3">+ ${prop.expensas?.toLocaleString('es-AR')} expensas</span>}
          </div>

          {/* Características */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 p-6 bg-[#F5F4F2] rounded-xl">
            {prop.ambientes && (
              <div className="text-center">
                <Home size={20} className="mx-auto mb-1 text-[#D85A30]" />
                <div className="font-display font-bold text-[24px]">{prop.ambientes}</div>
                <div className="text-[11px] text-[#555] uppercase tracking-wide">Ambientes</div>
              </div>
            )}
            {prop.dormitorios && (
              <div className="text-center">
                <span className="text-[20px] block mb-1">🛏️</span>
                <div className="font-display font-bold text-[24px]">{prop.dormitorios}</div>
                <div className="text-[11px] text-[#555] uppercase tracking-wide">Dormitorios</div>
              </div>
            )}
            {prop.banos && (
              <div className="text-center">
                <Bath size={20} className="mx-auto mb-1 text-[#D85A30]" />
                <div className="font-display font-bold text-[24px]">{prop.banos}</div>
                <div className="text-[11px] text-[#555] uppercase tracking-wide">Baños</div>
              </div>
            )}
            {prop.superficie_cubierta && (
              <div className="text-center">
                <Square size={20} className="mx-auto mb-1 text-[#D85A30]" />
                <div className="font-display font-bold text-[24px]">{prop.superficie_cubierta}</div>
                <div className="text-[11px] text-[#555] uppercase tracking-wide">m² cubiertos</div>
              </div>
            )}
          </div>

          {/* Descripción */}
          {prop.descripcion && (
            <div className="mb-10">
              <h2 className="font-display font-bold text-[22px] uppercase mb-4">Descripción</h2>
              <p className="text-[15px] text-[#444] leading-relaxed whitespace-pre-line">{prop.descripcion}</p>
            </div>
          )}

          {/* Amenities */}
          {prop.amenities?.length > 0 && (
            <div className="mb-10">
              <h2 className="font-display font-bold text-[22px] uppercase mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {prop.amenities.map(a => (
                  <span key={a} className="border border-[#E2E0DC] text-[13px] px-3 py-1.5 rounded-full capitalize">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp flotante mobile */}
          <a href={`https://wa.me/5491112345678?text=Hola! Me interesa esta propiedad: ${prop.titulo}`}
            target="_blank"
            className="md:hidden fixed bottom-4 right-4 bg-[#25D366] text-white font-semibold px-5 py-3 rounded-full shadow-xl flex items-center gap-2 z-50">
            <Phone size={16} /> WhatsApp
          </a>
        </div>

        {/* Sidebar con formulario */}
        <div className="lg:col-span-1">
          <div className="sticky top-[84px] bg-white border border-[#E2E0DC] rounded-xl p-6 shadow-sm">
            <h3 className="font-display font-bold text-[20px] uppercase mb-1">¿Te interesa?</h3>
            <p className="text-[13px] text-[#555] mb-5">Completá el formulario y un asesor te responde en el día.</p>
            <LeadForm propiedadId={prop.id} propiedadTitulo={prop.titulo} />
            <div className="mt-4 pt-4 border-t border-[#E2E0DC]">
              <a href={`https://wa.me/5491112345678?text=Hola! Me interesa: ${prop.titulo}`}
                target="_blank"
                className="w-full bg-[#25D366] hover:bg-[#1fb558] text-white font-semibold text-[14px] py-3 rounded-md flex items-center justify-center gap-2 transition-colors">
                <Phone size={16} /> Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
