import { FileText, View } from 'lucide-react'

interface Props {
  planoUrl?: string
  recorridoVirtual?: string
}

export default function PlanoYTour({ planoUrl, recorridoVirtual }: Props) {
  if (!planoUrl && !recorridoVirtual) return null

  return (
    <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
      {planoUrl && (
        <div>
          <h3 className="font-display font-bold text-[18px] uppercase mb-3 flex items-center gap-2">
            <FileText size={18} className="text-[#D85A30]" /> Plano
          </h3>
          <a href={planoUrl} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden border border-[#E2E0DC] hover:border-[#D85A30] transition-colors group">
            <div className="aspect-[4/3] bg-[#F5F4F2] relative overflow-hidden">
              <img src={planoUrl} alt="Plano de la propiedad" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="px-4 py-2.5 bg-white text-[13px] font-medium text-[#D85A30] text-center">
              Ver plano completo →
            </div>
          </a>
        </div>
      )}

      {recorridoVirtual && (
        <div>
          <h3 className="font-display font-bold text-[18px] uppercase mb-3 flex items-center gap-2">
            <View size={18} className="text-[#D85A30]" /> Recorrido virtual
          </h3>
          <div className="rounded-xl overflow-hidden border border-[#E2E0DC] aspect-[4/3]">
            <iframe
              src={recorridoVirtual}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              title="Recorrido virtual 360°"
            />
          </div>
        </div>
      )}
    </div>
  )
}
