'use client'
import { useState } from 'react'
import { Save, Loader2, CheckCircle, Plus, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

interface ContentItem { clave: string; titulo?: string; subtitulo?: string; descripcion?: string; imagen_url?: string }
interface PortfolioItem { id: string; nombre: string; barrio?: string; anio?: number; tipo?: string; unidades?: number; descripcion?: string; foto_url?: string; visible: boolean }

export default function ContenidoEditor({ contenido: init, portfolio: initP }: { contenido: ContentItem[]; portfolio: PortfolioItem[] }) {
  const [tab, setTab] = useState<'landing'|'portfolio'|'noticias'>('landing')
  const [contenido, setContenido] = useState<Record<string, ContentItem>>(
    Object.fromEntries(init.map(c => [c.clave, c]))
  )
  const [portfolio, setPortfolio] = useState(initP)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const get = (clave: string) => contenido[clave] || {}
  const setField = (clave: string, field: string, value: string) => {
    setContenido(p => ({ ...p, [clave]: { ...p[clave], clave, [field]: value } }))
  }

  const saveContenido = async () => {
    setSaving(true)
    const items = Object.values(contenido)
    await fetch('/api/admin/contenido', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const f = 'border border-[#E2E0DC] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#D85A30] w-full'
  const lbl = 'text-[11px] font-semibold uppercase tracking-wide text-[#555] block mb-1.5'

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-[32px] uppercase tracking-tight">Editor de contenido</h1>
          <p className="text-[14px] text-[#555] mt-1">Modificá los textos e imágenes del sitio público</p>
        </div>
        <Link href="/" target="_blank"
          className="flex items-center gap-2 border border-[#E2E0DC] text-[13px] font-medium px-4 py-2 rounded-md hover:border-[#111] transition-colors">
          <Eye size={14} /> Ver sitio
        </Link>
      </div>

      <div className="flex gap-1 mb-6 bg-[#F5F4F2] p-1 rounded-lg w-fit">
        {([['landing','Landing home'],['portfolio','Proyectos anteriores'],['noticias','Noticias']] as const).map(([val,lbl]) => (
          <button key={val} onClick={() => setTab(val)}
            className={`px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${tab===val ? 'bg-white shadow-sm text-[#111]' : 'text-[#555] hover:text-[#111]'}`}>
            {lbl}
          </button>
        ))}
      </div>

      {tab === 'landing' && (
        <div className="space-y-6">
          {/* Hero */}
          <div className="bg-white rounded-xl border border-[#E2E0DC] p-6">
            <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Hero principal</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={lbl}>Título del hero</label>
                <input className={f} value={get('hero_titulo').titulo ?? ''} onChange={e => setField('hero_titulo','titulo',e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Subtítulo / descripción</label>
                <textarea rows={2} className={f} value={get('hero_subtitulo').titulo ?? ''} onChange={e => setField('hero_subtitulo','titulo',e.target.value)} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-[#E2E0DC] p-6">
            <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Estadísticas del hero</h2>
            <div className="grid grid-cols-3 gap-4">
              {[['stat_1_num','Stat 1 (años)'],['stat_2_num','Stat 2 (operaciones)'],['stat_3_num','Stat 3 (propiedades)']].map(([clave, label]) => (
                <div key={clave}>
                  <label className={lbl}>{label}</label>
                  <input className={f} value={get(clave).titulo ?? ''} onChange={e => setField(clave,'titulo',e.target.value)} placeholder="Ej: 12+" />
                  <input className={'mt-2 ' + f} value={get(clave).subtitulo ?? ''} onChange={e => setField(clave,'subtitulo',e.target.value)} placeholder="Descripción" />
                </div>
              ))}
            </div>
          </div>

          {/* Nosotros */}
          <div className="bg-white rounded-xl border border-[#E2E0DC] p-6">
            <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Sección Nosotros</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={lbl}>Título</label>
                <input className={f} value={get('nosotros_titulo').titulo ?? ''} onChange={e => setField('nosotros_titulo','titulo',e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Descripción</label>
                <textarea rows={4} className={f} value={get('nosotros_desc').titulo ?? ''} onChange={e => setField('nosotros_desc','titulo',e.target.value)} />
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-white rounded-xl border border-[#E2E0DC] p-6">
            <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Datos de contacto</h2>
            <div className="grid grid-cols-2 gap-4">
              {[['whatsapp','WhatsApp (sin + ni espacios)'],['email','Email'],['instagram','Instagram'],['direccion','Dirección'],['matricula','Matrícula CUCICBA']].map(([clave, label]) => (
                <div key={clave}>
                  <label className={lbl}>{label}</label>
                  <input className={f} value={get(clave).titulo ?? ''} onChange={e => setField(clave,'titulo',e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <button onClick={saveContenido} disabled={saving}
            className="flex items-center gap-2 bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold px-8 py-3.5 rounded-md transition-colors disabled:opacity-60">
            {saving ? <><Loader2 size={16} className="animate-spin"/>Guardando...</>
             : saved ? <><CheckCircle size={16}/>¡Guardado!</>
             : <><Save size={16}/>Guardar cambios</>}
          </button>
        </div>
      )}

      {tab === 'portfolio' && (
        <div>
          <div className="flex justify-between items-center mb-5">
            <p className="text-[14px] text-[#555]">Proyectos que aparecen en la sección de track record</p>
            <button className="flex items-center gap-2 bg-[#D85A30] text-white font-semibold text-[13px] px-4 py-2 rounded-md hover:bg-[#B84A22] transition-colors">
              <Plus size={15}/> Agregar proyecto
            </button>
          </div>
          <div className="space-y-4">
            {portfolio.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-[#E2E0DC] p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className={lbl}>Nombre del proyecto</label>
                    <input className={f} defaultValue={p.nombre} />
                  </div>
                  <div>
                    <label className={lbl}>Barrio</label>
                    <input className={f} defaultValue={p.barrio ?? ''} />
                  </div>
                  <div>
                    <label className={lbl}>Año</label>
                    <input type="number" className={f} defaultValue={p.anio ?? ''} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={lbl}>Descripción</label>
                    <textarea rows={2} className={f} defaultValue={p.descripcion ?? ''} />
                  </div>
                  <div>
                    <label className={lbl}>Tipo</label>
                    <input className={f} defaultValue={p.tipo ?? ''} placeholder="Departamentos" />
                  </div>
                  <div>
                    <label className={lbl}>Unidades</label>
                    <input type="number" className={f} defaultValue={p.unidades ?? ''} />
                  </div>
                  <div className="md:col-span-4">
                    <label className={lbl}>URL de foto principal</label>
                    <input className={f} defaultValue={p.foto_url ?? ''} placeholder="https://..." />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E2E0DC]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked={p.visible} className="w-4 h-4 accent-[#D85A30]" />
                    <span className="text-[13px] text-[#555]">Visible en el sitio</span>
                  </label>
                  <button className="flex items-center gap-1.5 text-[12px] text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={13}/> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'noticias' && (
        <div className="bg-white rounded-xl border border-[#E2E0DC] p-8 text-center">
          <div className="text-4xl mb-3 opacity-20">📰</div>
          <h3 className="font-display font-bold text-[20px] uppercase mb-2">Gestión de noticias</h3>
          <p className="text-[14px] text-[#555] max-w-sm mx-auto mb-4">
            Las noticias se actualizan automáticamente desde fuentes del mercado. Próximamente podrás agregar noticias propias y destacar artículos específicos.
          </p>
          <Link href="/noticias" target="_blank"
            className="inline-flex items-center gap-2 bg-[#D85A30] text-white font-semibold text-[14px] px-5 py-2.5 rounded-md hover:bg-[#B84A22] transition-colors">
            <Eye size={15}/> Ver noticias en el sitio
          </Link>
        </div>
      )}
    </div>
  )
}
