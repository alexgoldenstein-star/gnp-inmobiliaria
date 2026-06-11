import { getPropiedadBySlug, formatPrecio } from '@/lib/propiedades'
import { notFound } from 'next/navigation'
import LeadForm from '@/components/public/LeadForm'
import { MapPin, ArrowRight, CheckCircle, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const prop = await getPropiedadBySlug(slug)
  if (!prop) return { title: 'Proyecto no encontrado' }
  return {
    title: `${prop.titulo} | Proyecto en Pozo | G&P Negocios Inmobiliarios`,
    description: prop.meta_descripcion ?? prop.descripcion_corta ?? prop.descripcion?.substring(0, 160),
    openGraph: { images: prop.foto_principal ? [prop.foto_principal] : [] }
  }
}

export default async function ProyectoPage({ params }: Props) {
  const { slug } = await params
  const prop = await getPropiedadBySlug(slug)
  if (!prop || prop.operacion !== 'pozo') notFound()

  return (
    <div className="min-h-screen">
      {/* HERO del proyecto */}
      <div className="relative h-[70vh] bg-[#111] overflow-hidden">
        {prop.foto_principal ? (
          <>
            <img src={prop.foto_principal} alt={prop.titulo} className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[120px] opacity-5">🏗️</div>
        )}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-12">
          <div className="inline-flex items-center gap-2 bg-[#D85A30] text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
            🏗️ Proyecto en pozo
          </div>
          <h1 className="font-display font-black uppercase text-[clamp(40px,6vw,72px)] text-white leading-[0.92] tracking-tight mb-3">
            {prop.titulo}
          </h1>
          <div className="flex items-center gap-2 text-white/60 text-[15px]">
            <MapPin size={15} /> {prop.barrio}{prop.provincia ? `, ${prop.provincia}` : ''}
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="px-6 md:px-16 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16 max-w-7xl mx-auto">
        <div className="lg:col-span-2">

          {/* Precio y características clave */}
          <div className="bg-[#F5F4F2] rounded-2xl p-8 mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888] mb-1">Precio desde</div>
                <div className="font-display font-black text-[28px] text-[#D85A30] leading-none">
                  {formatPrecio(prop.precio, prop.moneda)}
                </div>
              </div>
              {prop.ambientes && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888] mb-1">Ambientes</div>
                  <div className="font-display font-black text-[28px] leading-none">{prop.ambientes}</div>
                </div>
              )}
              {prop.superficie_cubierta && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888] mb-1">Superficie</div>
                  <div className="font-display font-black text-[28px] leading-none">{prop.superficie_cubierta} <span className="text-[16px] font-normal text-[#555]">m²</span></div>
                </div>
              )}
              {prop.antiguedad !== undefined && prop.antiguedad === 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888] mb-1">Entrega</div>
                  <div className="font-display font-black text-[28px] leading-none text-green-600">A estrenar</div>
                </div>
              )}
            </div>
          </div>

          {/* Descripción */}
          {prop.descripcion && (
            <div className="mb-10">
              <h2 className="font-display font-bold text-[26px] uppercase mb-5">Sobre el proyecto</h2>
              <p className="text-[15px] text-[#444] leading-relaxed whitespace-pre-line">{prop.descripcion}</p>
            </div>
          )}

          {/* Amenities */}
          {prop.amenities?.length > 0 && (
            <div className="mb-10">
              <h2 className="font-display font-bold text-[26px] uppercase mb-5">Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {prop.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2.5 text-[14px] capitalize">
                    <CheckCircle size={16} className="text-[#D85A30] shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Galería */}
          {prop.fotos?.length > 1 && (
            <div className="mb-10">
              <h2 className="font-display font-bold text-[26px] uppercase mb-5">Galería</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {prop.fotos.map((url, i) => (
                  <div key={url} className={`rounded-xl overflow-hidden ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                    <img src={url} alt={`${prop.titulo} - ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video */}
          {prop.video_url && (
            <div className="mb-10">
              <h2 className="font-display font-bold text-[26px] uppercase mb-5">Video del proyecto</h2>
              <div className="aspect-video rounded-xl overflow-hidden bg-[#111]">
                <iframe src={prop.video_url.replace('watch?v=', 'embed/')} className="w-full h-full" allowFullScreen />
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="sticky top-[84px] bg-white border border-[#E2E0DC] rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-[#111] px-6 py-5">
              <h3 className="font-display font-bold text-[18px] uppercase text-white mb-1">¿Te interesa este proyecto?</h3>
              <p className="text-[13px] text-white/50">Completá el formulario y un asesor te llama.</p>
            </div>
            <div className="p-6">
              <LeadForm propiedadId={prop.id} propiedadTitulo={prop.titulo} />
              <div className="mt-4 pt-4 border-t border-[#E2E0DC]">
                <a href={`https://wa.me/5491112345678?text=Hola! Me interesa el proyecto: ${prop.titulo}`}
                  target="_blank"
                  className="w-full bg-[#25D366] hover:bg-[#1fb558] text-white font-semibold text-[14px] py-3 rounded-md flex items-center justify-center gap-2 transition-colors">
                  <Phone size={16} /> Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Volver a todos los proyectos */}
          <Link href="/propiedades?operacion=pozo"
            className="mt-4 flex items-center justify-center gap-2 text-[13px] text-[#555] hover:text-[#111] transition-colors">
            <ArrowRight size={13} className="rotate-180" /> Ver todos los proyectos en pozo
          </Link>
        </div>
      </div>
    </div>
  )
}
