'use client'
import { useState } from 'react'
import { Loader2, Copy, CheckCircle, Share2, MessageCircle, RefreshCw, Briefcase } from 'lucide-react'
import { formatPrecio } from '@/lib/propiedades'

const REDES = [
  { id: 'instagram_post', label: 'Instagram Post', icon: Share2, color: 'bg-gradient-to-r from-purple-500 to-pink-500', limit: 2200 },
  { id: 'instagram_story', label: 'Instagram Story', icon: Share2, color: 'bg-gradient-to-r from-orange-400 to-pink-500', limit: 150 },
  { id: 'linkedin', label: 'LinkedIn', icon: Briefcase, color: 'bg-blue-600', limit: 3000 },
  { id: 'whatsapp', label: 'WhatsApp / Estado', icon: MessageCircle, color: 'bg-[#25D366]', limit: 700 },
]

const TONOS = [
  { id: 'aspiracional', label: '✨ Aspiracional', desc: 'Premium, exclusivo, lifestyle' },
  { id: 'informativo', label: '📊 Informativo', desc: 'Datos, características, precio' },
  { id: 'urgencia', label: '⚡ Urgencia', desc: 'Última oportunidad, no te lo pierdas' },
  { id: 'inversor', label: '💰 Inversor', desc: 'Rentabilidad, ROI, oportunidad' },
]

interface Propiedad {
  id: string; titulo: string; tipo: string; operacion: string
  precio?: number; moneda: string; barrio?: string; ambientes?: number
  superficie_cubierta?: number; descripcion_corta?: string; descripcion?: string
  foto_principal?: string; amenities?: string[]
}

interface Generado {
  red: string; tono: string; contenido: string; hashtags: string[]
}

export default function GeneradorRRSS({ propiedades }: { propiedades: Propiedad[] }) {
  const [propId, setPropId] = useState('')
  const [red, setRed] = useState('instagram_post')
  const [tono, setTono] = useState('aspiracional')
  const [loading, setLoading] = useState(false)
  const [generado, setGenerado] = useState<Generado | null>(null)
  const [copiado, setCopiado] = useState('')
  const [historial, setHistorial] = useState<Generado[]>([])

  const prop = propiedades.find(p => p.id === propId)

  const generar = async () => {
    if (!prop) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/generar-rrss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propiedad: prop, red, tono }),
      })
      const data = await res.json()
      const nuevo = { red, tono, contenido: data.contenido, hashtags: data.hashtags }
      setGenerado(nuevo)
      setHistorial(h => [nuevo, ...h.slice(0, 9)])
    } catch { alert('Error generando contenido') }
    finally { setLoading(false) }
  }

  const copiar = (texto: string, id: string) => {
    navigator.clipboard.writeText(texto)
    setCopiado(id)
    setTimeout(() => setCopiado(''), 2000)
  }

  const copiarTodo = () => {
    if (!generado) return
    const texto = `${generado.contenido}\n\n${generado.hashtags.join(' ')}`
    copiar(texto, 'todo')
  }

  const redInfo = REDES.find(r => r.id === red)

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-black text-[32px] uppercase tracking-tight">Generador de contenido</h1>
        <p className="text-[14px] text-[#555] mt-1">Creá copies para redes sociales automáticamente con IA</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de configuración */}
        <div className="space-y-5">
          {/* Seleccionar propiedad */}
          <div className="bg-white rounded-xl border border-[#E2E0DC] p-5">
            <h2 className="font-display font-bold text-[16px] uppercase mb-4">1. Seleccioná la propiedad</h2>
            <select
              value={propId} onChange={e => setPropId(e.target.value)}
              className="w-full border border-[#E2E0DC] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-[#D85A30] bg-white">
              <option value="">— Elegí una propiedad —</option>
              {propiedades.map(p => (
                <option key={p.id} value={p.id}>
                  {p.titulo} — {p.barrio} ({p.operacion})
                </option>
              ))}
            </select>

            {prop && (
              <div className="mt-4 flex gap-3 p-3 bg-[#F5F4F2] rounded-lg">
                {prop.foto_principal && (
                  <img src={prop.foto_principal} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0"/>
                )}
                <div className="min-w-0">
                  <div className="font-semibold text-[13px] truncate">{prop.titulo}</div>
                  <div className="text-[12px] text-[#888]">{prop.barrio} · {prop.ambientes && `${prop.ambientes} amb.`} · {prop.superficie_cubierta && `${prop.superficie_cubierta} m²`}</div>
                  <div className="font-display font-black text-[16px] text-[#D85A30]">{formatPrecio(prop.precio, prop.moneda)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Red social */}
          <div className="bg-white rounded-xl border border-[#E2E0DC] p-5">
            <h2 className="font-display font-bold text-[16px] uppercase mb-4">2. Red social</h2>
            <div className="grid grid-cols-2 gap-2">
              {REDES.map(r => (
                <button key={r.id} onClick={() => setRed(r.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all ${red === r.id ? 'border-[#D85A30] bg-[#FDF3EF]' : 'border-[#E2E0DC] hover:border-[#D85A30]/50'}`}>
                  <div className={`w-8 h-8 ${r.color} rounded-lg flex items-center justify-center`}>
                    <r.icon size={14} className="text-white"/>
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-[#111]">{r.label}</div>
                    <div className="text-[10px] text-[#888]">hasta {r.limit.toLocaleString()} car.</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tono */}
          <div className="bg-white rounded-xl border border-[#E2E0DC] p-5">
            <h2 className="font-display font-bold text-[16px] uppercase mb-4">3. Tono del mensaje</h2>
            <div className="grid grid-cols-2 gap-2">
              {TONOS.map(t => (
                <button key={t.id} onClick={() => setTono(t.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${tono === t.id ? 'border-[#D85A30] bg-[#FDF3EF]' : 'border-[#E2E0DC] hover:border-[#D85A30]/50'}`}>
                  <div className="text-[13px] font-semibold text-[#111]">{t.label}</div>
                  <div className="text-[11px] text-[#888] mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generar}
            disabled={loading || !propId}
            className="w-full bg-[#D85A30] hover:bg-[#B84A22] text-white font-bold text-[15px] py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <><Loader2 size={18} className="animate-spin"/>Generando con IA...</> : <>✨ Generar contenido</>}
          </button>
        </div>

        {/* Panel de resultado */}
        <div className="space-y-5">
          {generado ? (
            <>
              <div className="bg-white rounded-xl border border-[#E2E0DC] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E0DC]">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 ${redInfo?.color} rounded-lg flex items-center justify-center`}>
                      {redInfo && <redInfo.icon size={13} className="text-white"/>}
                    </div>
                    <span className="font-semibold text-[14px]">{redInfo?.label}</span>
                    <span className="text-[11px] text-[#888] bg-[#F5F4F2] px-2 py-0.5 rounded-full capitalize">{tono}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={generar}
                      className="flex items-center gap-1 text-[12px] text-[#555] hover:text-[#111] border border-[#E2E0DC] px-2.5 py-1.5 rounded-lg transition-colors">
                      <RefreshCw size={12}/> Regenerar
                    </button>
                    <button onClick={copiarTodo}
                      className="flex items-center gap-1 text-[12px] font-medium bg-[#D85A30] text-white px-3 py-1.5 rounded-lg hover:bg-[#B84A22] transition-colors">
                      {copiado === 'todo' ? <><CheckCircle size={12}/>Copiado!</> : <><Copy size={12}/>Copiar todo</>}
                    </button>
                  </div>
                </div>

                {/* Copy */}
                <div className="p-5">
                  <div className="bg-[#F5F4F2] rounded-xl p-4 mb-4 relative">
                    <p className="text-[14px] text-[#333] leading-relaxed whitespace-pre-wrap">{generado.contenido}</p>
                    <button onClick={() => copiar(generado.contenido, 'copy')}
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-lg border border-[#E2E0DC] hover:border-[#D85A30] transition-colors">
                      {copiado === 'copy' ? <CheckCircle size={13} className="text-green-500"/> : <Copy size={13} className="text-[#888]"/>}
                    </button>
                  </div>
                  <div className="text-[12px] text-[#888] mb-2 font-medium">Hashtags sugeridos:</div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {generado.hashtags.map(h => (
                      <span key={h} className="text-[12px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{h}</span>
                    ))}
                  </div>
                  <button onClick={() => copiar(generado.hashtags.join(' '), 'hashtags')}
                    className="text-[12px] text-[#D85A30] hover:underline flex items-center gap-1">
                    {copiado === 'hashtags' ? <><CheckCircle size={12}/>Copiados!</> : <><Copy size={12}/>Copiar hashtags</>}
                  </button>
                </div>

                {/* Métricas */}
                <div className="px-5 pb-4">
                  <div className="flex gap-4 text-[12px] text-[#888]">
                    <span>{generado.contenido.length} caracteres</span>
                    <span>·</span>
                    <span className={generado.contenido.length > (redInfo?.limit ?? 9999) ? 'text-red-500' : 'text-green-600'}>
                      {generado.contenido.length > (redInfo?.limit ?? 9999)
                        ? `⚠ Excede ${redInfo?.label} (${redInfo?.limit} max)`
                        : `✓ Dentro del límite`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tip de uso */}
              <div className="bg-[#FDF3EF] border border-[#D85A30]/20 rounded-xl p-4">
                <div className="text-[12px] font-semibold text-[#D85A30] mb-1">💡 Tip de publicación</div>
                <div className="text-[12px] text-[#555]">
                  {red === 'instagram_post' && 'Publicá entre 12-14hs o 18-21hs. Usá entre 5-10 hashtags específicos de nicho, no todos.'}
                  {red === 'instagram_story' && 'Las stories funcionan mejor con texto corto + foto llamativa. Agregá un link en bio.'}
                  {red === 'linkedin' && 'LinkedIn tiene mejor alcance martes-jueves en horario laboral. Empezá con una pregunta o dato.'}
                  {red === 'whatsapp' && 'Para estados de WhatsApp, el texto tiene que ser muy corto y la imagen habla sola.'}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border-2 border-dashed border-[#E2E0DC] p-12 text-center">
              <div className="text-5xl mb-4 opacity-20">✨</div>
              <h3 className="font-display font-bold text-[18px] uppercase mb-2">Listo para generar</h3>
              <p className="text-[14px] text-[#555]">Seleccioná una propiedad, la red social y el tono para crear el copy.</p>
            </div>
          )}

          {/* Historial */}
          {historial.length > 1 && (
            <div className="bg-white rounded-xl border border-[#E2E0DC] p-5">
              <h3 className="font-display font-bold text-[16px] uppercase mb-4">Generaciones anteriores</h3>
              <div className="space-y-3">
                {historial.slice(1).map((h, i) => (
                  <div key={i} className="border border-[#E2E0DC] rounded-lg p-3 cursor-pointer hover:border-[#D85A30] transition-colors"
                    onClick={() => setGenerado(h)}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-[#888] capitalize">{h.red.replace('_',' ')}</span>
                      <span className="text-[10px] text-[#aaa]">·</span>
                      <span className="text-[11px] text-[#888] capitalize">{h.tono}</span>
                    </div>
                    <p className="text-[12px] text-[#444] line-clamp-2">{h.contenido}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
