import { MapPin } from 'lucide-react'

interface MapaPropiedadProps {
  lat?: number
  lng?: number
  barrio?: string
  direccion?: string
  direccionPrivada?: boolean
}

export default function MapaPropiedad({ lat, lng, barrio, direccion, direccionPrivada }: MapaPropiedadProps) {
  if (!lat || !lng) return null

  // Si la dirección es privada, mostramos un radio aproximado (zoom más alejado, sin pin exacto visible al usuario)
  const zoom = direccionPrivada ? 14 : 16
  const query = direccionPrivada
    ? `${barrio}, CABA, Argentina`
    : `${direccion ?? ''}, ${barrio}, CABA, Argentina`

  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`

  return (
    <div className="mb-10">
      <h2 className="font-display font-bold text-[22px] uppercase mb-4 flex items-center gap-2">
        <MapPin size={20} className="text-[#D85A30]" /> Ubicación
      </h2>
      <div className="rounded-xl overflow-hidden border border-[#E2E0DC] h-[320px] relative">
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Ubicación en ${barrio}`}
        />
      </div>
      {direccionPrivada && (
        <p className="text-[12px] text-[#888] mt-2">
          📍 Ubicación aproximada en {barrio}. La dirección exacta se comparte al coordinar una visita.
        </p>
      )}
    </div>
  )
}
