import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Car, Star } from 'lucide-react'
import { formatPrecio } from '@/lib/propiedades'
import type { Propiedad } from '@/types'

const OPERACION_LABEL: Record<string, string> = {
  venta: 'Venta', alquiler: 'Alquiler', alquiler_temporal: 'Temp.', pozo: 'En pozo'
}
const OPERACION_COLOR: Record<string, string> = {
  venta: 'bg-[#111] text-white',
  alquiler: 'bg-[#D85A30] text-white',
  alquiler_temporal: 'bg-[#555] text-white',
  pozo: 'bg-[#185FA5] text-white',
}

export default function PropertyCard({ prop }: { prop: Propiedad }) {
  return (
    <Link href={`/propiedades/${prop.slug}`}
      className="block rounded-xl overflow-hidden border border-[#E2E0DC] bg-white hover:-translate-y-1 hover:shadow-xl transition-all duration-200 no-underline text-inherit group">
      {/* Imagen */}
      <div className="h-[200px] bg-[#F5F4F2] relative overflow-hidden">
        {prop.foto_principal ? (
          <Image
            src={prop.foto_principal}
            alt={prop.titulo}
            fill className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-15">🏢</div>
        )}
        <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded ${OPERACION_COLOR[prop.operacion] ?? 'bg-gray-500 text-white'}`}>
          {OPERACION_LABEL[prop.operacion]}
        </span>
        {prop.destacada && (
          <span className="absolute top-3 right-3 bg-white text-[#D85A30] text-[11px] font-semibold px-2.5 py-1 rounded flex items-center gap-1">
            <Star size={10} fill="currentColor" /> Destacada
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="font-display font-extrabold text-[22px] text-[#111] leading-tight mb-1">
          {formatPrecio(prop.precio, prop.moneda)}
          {prop.operacion === 'alquiler' && <span className="text-sm font-normal text-[#555] ml-1">/ mes</span>}
        </div>
        <div className="text-[14px] font-medium text-[#111] mb-1 truncate">{prop.titulo}</div>
        <div className="flex items-center gap-1 text-[13px] text-[#555] mb-4">
          <MapPin size={12} /> {prop.barrio}{prop.provincia ? `, ${prop.provincia}` : ''}
        </div>

        {/* Features */}
        <div className="flex gap-4 pt-4 border-t border-[#E2E0DC] text-[12px] text-[#555]">
          {prop.ambientes && (
            <span><strong className="text-[#111] font-semibold">{prop.ambientes}</strong> amb.</span>
          )}
          {prop.banos && (
            <span><strong className="text-[#111] font-semibold">{prop.banos}</strong> baño{prop.banos > 1 ? 's' : ''}</span>
          )}
          {prop.superficie_cubierta && (
            <span><strong className="text-[#111] font-semibold">{prop.superficie_cubierta}</strong> m²</span>
          )}
          {prop.cochera && (
            <span className="flex items-center gap-1"><Car size={12} /> Cochera</span>
          )}
        </div>
      </div>
    </Link>
  )
}
