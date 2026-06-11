export const dynamic = 'force-dynamic'
import { ExternalLink, Calendar, Tag } from 'lucide-react'

async function getNoticias() {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/noticias`, { next: { revalidate: 3600 } })
    const data = await res.json()
    return data.noticias ?? []
  } catch { return [] }
}

const CAT_COLOR: Record<string, string> = {
  'Mercado': 'bg-blue-100 text-blue-700',
  'Tendencias': 'bg-purple-100 text-purple-700',
  'Financiamiento': 'bg-green-100 text-green-700',
  'Inversión': 'bg-[#FDF3EF] text-[#D85A30]',
  'Consejos': 'bg-yellow-100 text-yellow-700',
}

export default async function NoticiasPage() {
  const noticias = await getNoticias()
  const principal = noticias[0]
  const resto = noticias.slice(1)

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <div className="bg-[#111] text-white px-6 md:px-12 py-12">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-0.5 bg-[#D85A30]" />
          <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Mercado Inmobiliario</span>
        </div>
        <h1 className="font-display font-black uppercase text-[clamp(36px,5vw,60px)] leading-[0.93] tracking-tight">
          Noticias<br />del mercado
        </h1>
        <p className="text-white/50 text-[14px] mt-3">Las últimas novedades del sector inmobiliario argentino</p>
      </div>

      <div className="px-6 md:px-12 py-12 max-w-6xl mx-auto">
        {/* Noticia principal */}
        {principal && (
          <a href={principal.url} target="_blank" rel="noopener noreferrer"
            className="block bg-white rounded-2xl border border-[#E2E0DC] overflow-hidden hover:shadow-lg transition-shadow mb-8 no-underline group">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-auto bg-[#F5F4F2] relative overflow-hidden">
                {principal.imagen
                  ? <img src={principal.imagen} alt={principal.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-full flex items-center justify-center text-6xl opacity-10">🏢</div>
                }
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${CAT_COLOR[principal.categoria] ?? 'bg-gray-100 text-gray-600'}`}>
                    {principal.categoria}
                  </span>
                  <span className="text-[12px] text-[#888]">{principal.fuente}</span>
                </div>
                <h2 className="font-display font-black text-[26px] uppercase leading-tight tracking-tight mb-3 text-[#111] group-hover:text-[#D85A30] transition-colors">
                  {principal.titulo}
                </h2>
                <p className="text-[14px] text-[#555] leading-relaxed mb-4">{principal.resumen}</p>
                <div className="flex items-center gap-4 text-[12px] text-[#aaa]">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(principal.fecha).toLocaleDateString('es-AR')}</span>
                  <span className="flex items-center gap-1 text-[#D85A30] font-medium group-hover:underline"><ExternalLink size={11} /> Leer más</span>
                </div>
              </div>
            </div>
          </a>
        )}

        {/* Grid de noticias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resto.map((n: any) => (
            <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-xl border border-[#E2E0DC] p-5 hover:shadow-md transition-shadow no-underline group block">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CAT_COLOR[n.categoria] ?? 'bg-gray-100 text-gray-600'}`}>
                  {n.categoria}
                </span>
                <span className="text-[11px] text-[#aaa]">{n.fuente}</span>
              </div>
              <h3 className="font-semibold text-[14px] text-[#111] leading-snug mb-2 group-hover:text-[#D85A30] transition-colors line-clamp-2">
                {n.titulo}
              </h3>
              <p className="text-[12px] text-[#666] leading-relaxed line-clamp-3 mb-3">{n.resumen}</p>
              <div className="flex items-center justify-between text-[11px] text-[#aaa]">
                <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(n.fecha).toLocaleDateString('es-AR')}</span>
                <span className="flex items-center gap-1 text-[#D85A30] font-medium"><ExternalLink size={10} /> Leer</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
