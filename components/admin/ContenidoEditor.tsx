'use client'
import { useState, useRef } from 'react'
import { Save, Loader2, CheckCircle, Plus, Trash2, Eye, Upload, X, Star } from 'lucide-react'
import Link from 'next/link'

interface ContentItem { clave: string; titulo?: string; subtitulo?: string; descripcion?: string }
interface Proyecto {
  id?: string; nombre: string; barrio: string; anio: number | string
  tipo: string; unidades: number | string; descripcion: string
  foto_url: string; fotos: string[]; visible: boolean; estado: string
}

const PROYECTO_VACIO: Proyecto = {
  nombre: '', barrio: '', anio: new Date().getFullYear(),
  tipo: 'Departamentos', unidades: '', descripcion: '',
  foto_url: '', fotos: [], visible: true, estado: 'Entregado'
}

export default function ContenidoEditor({ contenido: init, portfolio: initP }: { contenido: ContentItem[]; portfolio: any[] }) {
  const [tab, setTab] = useState<'landing'|'portfolio'>('landing')
  const [contenido, setContenido] = useState<Record<string, ContentItem>>(
    Object.fromEntries(init.map(c => [c.clave, c]))
  )
  const [portfolio, setPortfolio] = useState<Proyecto[]>(initP)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Proyecto>(PROYECTO_VACIO)
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const get = (clave: string) => contenido[clave] || {}
  const setField = (clave: string, field: string, value: string) =>
    setContenido(p => ({ ...p, [clave]: { ...p[clave], clave, [field]: value } }))

  const saveContenido = async () => {
    setSaving(true)
    await fetch('/api/admin/contenido', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: Object.values(contenido) }),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const openEdit = (p?: Proyecto) => {
    setEditForm(p ? { ...p } : PROYECTO_VACIO)
    setEditingId(p?.id ?? 'nuevo')
  }

  const uploadFoto = async (file: File) => {
    setUploadingFoto(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setUploadingFoto(false)
    return data.url ?? null
  }

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const url = await uploadFoto(file)
    if (url) {
      setEditForm(p => ({ ...p, foto_url: url, fotos: p.fotos.includes(url) ? p.fotos : [url, ...p.fotos] }))
    }
  }

  const handleMultiFotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    for (const file of files) {
      const url = await uploadFoto(file)
      if (url) setEditForm(p => ({ ...p, fotos: [...p.fotos, url] }))
    }
  }

  const saveProyecto = async () => {
    setSaving(true)
    const isNew = editingId === 'nuevo'
    const url = isNew ? '/api/admin/portfolio' : `/api/admin/portfolio/${editingId}`
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, anio: Number(editForm.anio), unidades: Number(editForm.unidades) }),
    })
    const data = await res.json()
    if (res.ok) {
      if (isNew) setPortfolio(p => [...p, data.proyecto])
      else setPortfolio(p => p.map(x => x.id === editingId ? { ...x, ...editForm } : x))
      setEditingId(null)
    }
    setSaving(false)
  }

  const deleteProyecto = async (id: string) => {
    if (!confirm('¿Eliminar este proyecto?')) return
    await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' })
    setPortfolio(p => p.filter(x => x.id !== id))
  }

  const f = 'border border-[#E2E0DC] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#D85A30] w-full bg-white'
  const lbl = 'text-[11px] font-semibold uppercase tracking-wide text-[#555] block mb-1.5'

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-[32px] uppercase tracking-tight">Editor de contenido</h1>
          <p className="text-[14px] text-[#555] mt-1">Textos, imágenes y proyectos del sitio público</p>
        </div>
        <Link href="/" target="_blank" className="flex items-center gap-2 border border-[#E2E0DC] text-[13px] font-medium px-4 py-2 rounded-md hover:border-[#111] transition-colors">
          <Eye size={14}/> Ver sitio
        </Link>
      </div>

      <div className="flex gap-1 mb-6 bg-[#F5F4F2] p-1 rounded-lg w-fit">
        {([['landing','Textos del sitio'],['portfolio','Proyectos anteriores']] as const).map(([val,lbl]) => (
          <button key={val} onClick={() => setTab(val)}
            className={`px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${tab===val ? 'bg-white shadow-sm text-[#111]' : 'text-[#555] hover:text-[#111]'}`}>
            {lbl}
          </button>
        ))}
      </div>

      {/* ── LANDING TEXTS ── */}
      {tab === 'landing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E2E0DC] p-6">
            <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Hero principal</h2>
            <div className="grid gap-4">
              <div>
                <label className={lbl}>Título</label>
                <input className={f} value={get('hero_titulo').titulo ?? ''} onChange={e => setField('hero_titulo','titulo',e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Subtítulo</label>
                <textarea rows={2} className={f} value={get('hero_subtitulo').titulo ?? ''} onChange={e => setField('hero_subtitulo','titulo',e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E0DC] p-6">
            <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Estadísticas</h2>
            <div className="grid grid-cols-3 gap-4">
              {[['stat_1_num','Años'],['stat_2_num','Operaciones'],['stat_3_num','Propiedades']].map(([clave, label]) => (
                <div key={clave}>
                  <label className={lbl}>{label} — número</label>
                  <input className={f} value={get(clave).titulo ?? ''} onChange={e => setField(clave,'titulo',e.target.value)} placeholder="12+" />
                  <input className={'mt-2 ' + f} value={get(clave).subtitulo ?? ''} onChange={e => setField(clave,'subtitulo',e.target.value)} placeholder="Descripción" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E0DC] p-6">
            <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Nosotros</h2>
            <div className="grid gap-4">
              <div><label className={lbl}>Título</label><input className={f} value={get('nosotros_titulo').titulo ?? ''} onChange={e => setField('nosotros_titulo','titulo',e.target.value)} /></div>
              <div><label className={lbl}>Descripción</label><textarea rows={4} className={f} value={get('nosotros_desc').titulo ?? ''} onChange={e => setField('nosotros_desc','titulo',e.target.value)} /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E0DC] p-6">
            <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Datos de contacto</h2>
            <div className="grid grid-cols-2 gap-4">
              {[['whatsapp','WhatsApp'],['email','Email'],['instagram','Instagram'],['direccion','Dirección'],['matricula','Matrícula CUCICBA']].map(([clave, label]) => (
                <div key={clave}><label className={lbl}>{label}</label><input className={f} value={get(clave).titulo ?? ''} onChange={e => setField(clave,'titulo',e.target.value)} /></div>
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

      {/* ── PORTFOLIO ── */}
      {tab === 'portfolio' && (
        <div>
          <div className="flex justify-between items-center mb-5">
            <p className="text-[14px] text-[#555]">{portfolio.length} proyectos en el portfolio</p>
            <button onClick={() => openEdit()}
              className="flex items-center gap-2 bg-[#D85A30] text-white font-semibold text-[13px] px-4 py-2 rounded-md hover:bg-[#B84A22] transition-colors">
              <Plus size={15}/> Agregar proyecto
            </button>
          </div>

          <div className="space-y-4">
            {portfolio.map((p: any) => (
              <div key={p.id} className="bg-white rounded-xl border border-[#E2E0DC] overflow-hidden">
                <div className="flex">
                  {/* Foto */}
                  <div className="w-24 h-24 shrink-0 bg-[#F5F4F2] relative overflow-hidden">
                    {p.foto_url
                      ? <img src={p.foto_url} alt={p.nombre} className="w-full h-full object-cover"/>
                      : <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">🏢</div>
                    }
                  </div>
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[15px]">{p.nombre}</div>
                      <div className="text-[13px] text-[#888]">{p.barrio} · {p.anio} · {p.unidades} unidades</div>
                      <div className="text-[12px] text-[#aaa]">{p.tipo}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${p.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.visible ? 'Visible' : 'Oculto'}
                      </span>
                      <button onClick={() => openEdit(p)}
                        className="text-[13px] font-medium text-[#D85A30] hover:underline px-3 py-1.5 border border-[#D85A30]/20 rounded-md hover:bg-[#FDF3EF] transition-colors">
                        Editar
                      </button>
                      <button onClick={() => deleteProyecto(p.id)}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-50 text-[#ccc] hover:text-red-400 transition-colors">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {portfolio.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-[#E2E0DC] rounded-xl">
                <div className="text-4xl mb-3 opacity-20">🏢</div>
                <p className="text-[14px] text-[#555]">No hay proyectos todavía. <button onClick={() => openEdit()} className="text-[#D85A30] hover:underline">Agregá el primero</button></p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL EDITAR/NUEVO PROYECTO ── */}
      {editingId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between px-7 py-5 border-b border-[#E2E0DC]">
              <h2 className="font-display font-bold text-[22px] uppercase">
                {editingId === 'nuevo' ? 'Nuevo proyecto' : 'Editar proyecto'}
              </h2>
              <button onClick={() => setEditingId(null)} className="p-1.5 hover:bg-[#F5F4F2] rounded-lg transition-colors">
                <X size={18}/>
              </button>
            </div>

            <div className="p-7 grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              <div className="col-span-2">
                <label className={lbl}>Nombre del proyecto *</label>
                <input required className={f} value={editForm.nombre} onChange={e => setEditForm(p=>({...p,nombre:e.target.value}))} placeholder="Torre Palermo Norte" />
              </div>
              <div>
                <label className={lbl}>Barrio</label>
                <input className={f} value={editForm.barrio} onChange={e => setEditForm(p=>({...p,barrio:e.target.value}))} placeholder="Palermo" />
              </div>
              <div>
                <label className={lbl}>Año</label>
                <input type="number" className={f} value={editForm.anio} onChange={e => setEditForm(p=>({...p,anio:e.target.value}))} />
              </div>
              <div>
                <label className={lbl}>Tipo</label>
                <input className={f} value={editForm.tipo} onChange={e => setEditForm(p=>({...p,tipo:e.target.value}))} placeholder="Departamentos" />
              </div>
              <div>
                <label className={lbl}>Unidades</label>
                <input type="number" className={f} value={editForm.unidades} onChange={e => setEditForm(p=>({...p,unidades:e.target.value}))} />
              </div>
              <div>
                <label className={lbl}>Estado</label>
                <select className={f} value={editForm.estado} onChange={e => setEditForm(p=>({...p,estado:e.target.value}))}>
                  {['Entregado','En construcción','En pozo','Vendido'].map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="visible" checked={editForm.visible} onChange={e => setEditForm(p=>({...p,visible:e.target.checked}))} className="w-4 h-4 accent-[#D85A30]" />
                <label htmlFor="visible" className="text-[14px] cursor-pointer">Visible en el sitio</label>
              </div>
              <div className="col-span-2">
                <label className={lbl}>Descripción</label>
                <textarea rows={3} className={f} value={editForm.descripcion} onChange={e => setEditForm(p=>({...p,descripcion:e.target.value}))} />
              </div>

              {/* Foto principal */}
              <div className="col-span-2">
                <label className={lbl}>Foto principal</label>
                <div className="flex gap-3 items-start">
                  {editForm.foto_url ? (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#E2E0DC] shrink-0">
                      <img src={editForm.foto_url} alt="" className="w-full h-full object-cover"/>
                      <div className="absolute top-1 right-1 bg-[#D85A30] rounded-full w-4 h-4 flex items-center justify-center">
                        <Star size={9} fill="white" className="text-white"/>
                      </div>
                    </div>
                  ) : null}
                  <div
                    className="flex-1 border-2 border-dashed border-[#E2E0DC] rounded-lg p-4 text-center cursor-pointer hover:border-[#D85A30] transition-colors"
                    onClick={() => fileRef.current?.click()}>
                    {uploadingFoto ? (
                      <div className="flex items-center justify-center gap-2 text-[#555]">
                        <Loader2 size={16} className="animate-spin text-[#D85A30]"/> Subiendo...
                      </div>
                    ) : (
                      <>
                        <Upload size={18} className="mx-auto mb-1 text-[#aaa]"/>
                        <p className="text-[12px] text-[#888]">Subir foto principal</p>
                      </>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange}/>
                  </div>
                </div>
              </div>

              {/* Galería adicional */}
              <div className="col-span-2">
                <label className={lbl}>Galería de fotos ({editForm.fotos.length})</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editForm.fotos.map((url, i) => (
                    <div key={url} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#E2E0DC]">
                      <img src={url} alt="" className="w-full h-full object-cover"/>
                      <button type="button" onClick={() => setEditForm(p=>({...p,fotos:p.fotos.filter(f=>f!==url)}))}
                        className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-4 h-4 flex items-center justify-center">
                        <X size={10}/>
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-16 rounded-lg border-2 border-dashed border-[#E2E0DC] flex items-center justify-center cursor-pointer hover:border-[#D85A30] transition-colors">
                    <Plus size={18} className="text-[#aaa]"/>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleMultiFotos}/>
                  </label>
                </div>
              </div>
            </div>

            <div className="px-7 py-5 border-t border-[#E2E0DC] flex gap-3">
              <button onClick={saveProyecto} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60">
                {saving ? <><Loader2 size={15} className="animate-spin"/>Guardando...</> : <><Save size={15}/>Guardar proyecto</>}
              </button>
              <button onClick={() => setEditingId(null)}
                className="px-5 border border-[#E2E0DC] rounded-lg hover:border-[#111] transition-colors text-[14px] font-medium">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
