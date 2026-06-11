'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, Upload, X, Star, GripVertical, Trash2 } from 'lucide-react'
import type { Propiedad } from '@/types'

const TIPOS = ['departamento','casa','ph','local','oficina','terreno','cochera','galpon','emprendimiento']
const OPERACIONES = [
  { value: 'venta', label: 'Venta' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'alquiler_temporal', label: 'Alquiler temporal' },
  { value: 'pozo', label: 'En pozo' },
]
const ESTADOS = ['disponible','reservada','vendida','alquilada','pausada']
const ESTADOS_CONSERVACION = ['a_estrenar','excelente','muy_bueno','bueno','regular','a_reciclar']
const BARRIOS_CABA = ['Almagro','Balvanera','Barracas','Belgrano','Boedo','Caballito','Chacarita','Coghlan','Colegiales','Constitución','Flores','Floresta','La Boca','La Paternal','Liniers','Mataderos','Monserrat','Monte Castro','Nueva Pompeya','Núñez','Palermo','Parque Avellaneda','Parque Chacabuco','Parque Chas','Parque Patricios','Puerto Madero','Recoleta','Retiro','Saavedra','San Cristóbal','San Nicolás','San Telmo','Vélez Sársfield','Versalles','Villa Crespo','Villa del Parque','Villa Devoto','Villa Gral. Mitre','Villa Lugano','Villa Luro','Villa Ortúzar','Villa Pueyrredón','Villa Real','Villa Riachuelo','Villa Santa Rita','Villa Soldati','Villa Urquiza']
const AMENITIES_OPCIONES = ['pileta','sum','gimnasio','laundry','terraza','parrilla','seguridad 24hs','portero','bicicletero','cine','coworking','spa','jacuzzi','solarium','quincho']

interface Props {
  propiedad?: Propiedad
  mode: 'nueva' | 'editar'
}

export default function PropiedadForm({ propiedad, mode }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [uploadingFotos, setUploadingFotos] = useState(false)
  const [fotos, setFotos] = useState<string[]>(propiedad?.fotos ?? [])
  const [fotoPrincipal, setFotoPrincipal] = useState(propiedad?.foto_principal ?? '')
  const [amenities, setAmenities] = useState<string[]>(propiedad?.amenities ?? [])

  const [form, setForm] = useState({
    titulo: propiedad?.titulo ?? '',
    descripcion: propiedad?.descripcion ?? '',
    descripcion_corta: propiedad?.descripcion_corta ?? '',
    tipo: propiedad?.tipo ?? 'departamento',
    operacion: propiedad?.operacion ?? 'venta',
    estado: propiedad?.estado ?? 'disponible',
    precio: propiedad?.precio?.toString() ?? '',
    moneda: propiedad?.moneda ?? 'USD',
    expensas: propiedad?.expensas?.toString() ?? '',
    precio_negociable: propiedad?.precio_negociable ?? false,
    superficie_total: propiedad?.superficie_total?.toString() ?? '',
    superficie_cubierta: propiedad?.superficie_cubierta?.toString() ?? '',
    ambientes: propiedad?.ambientes?.toString() ?? '',
    dormitorios: propiedad?.dormitorios?.toString() ?? '',
    banos: propiedad?.banos?.toString() ?? '',
    toilettes: propiedad?.toilettes?.toString() ?? '0',
    cochera: propiedad?.cochera ?? false,
    cocheras_cantidad: propiedad?.cocheras_cantidad?.toString() ?? '0',
    piso: propiedad?.piso ?? '',
    orientacion: propiedad?.orientacion ?? '',
    antiguedad: propiedad?.antiguedad?.toString() ?? '',
    estado_conservacion: propiedad?.estado_conservacion ?? '',
    barrio: propiedad?.barrio ?? '',
    partido: propiedad?.partido ?? '',
    direccion: propiedad?.direccion ?? '',
    provincia: propiedad?.provincia ?? 'CABA',
    lat: propiedad?.lat?.toString() ?? '',
    lng: propiedad?.lng?.toString() ?? '',
    direccion_privada: propiedad?.direccion_privada ?? true,
    video_url: propiedad?.video_url ?? '',
    recorrido_virtual: propiedad?.recorrido_virtual ?? '',
    plano_url: propiedad?.plano_url ?? '',
    meta_titulo: propiedad?.meta_titulo ?? '',
    meta_descripcion: propiedad?.meta_descripcion ?? '',
    publicada: propiedad?.publicada ?? false,
    destacada: propiedad?.destacada ?? false,
    emprendimiento: propiedad?.emprendimiento ?? false,
    whatsapp_numero: '5491112345678',
    whatsapp_mensaje: '',
  })

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const toggleAmenity = (a: string) => setAmenities(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a])

  const handleFotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploadingFotos(true)
    try {
      const urls: string[] = []
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (data.url) urls.push(data.url)
      }
      const nuevas = [...fotos, ...urls]
      setFotos(nuevas)
      if (!fotoPrincipal && nuevas.length > 0) setFotoPrincipal(nuevas[0])
    } finally {
      setUploadingFotos(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const eliminarFoto = (url: string) => {
    setFotos(f => f.filter(x => x !== url))
    if (fotoPrincipal === url) setFotoPrincipal(fotos.find(x => x !== url) ?? '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = mode === 'nueva' ? '/api/propiedades' : `/api/propiedades/${propiedad?.id}`
      const method = mode === 'nueva' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amenities, fotos, foto_principal: fotoPrincipal || fotos[0] || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error guardando')
      router.push('/admin/propiedades')
      router.refresh()
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const f = 'border border-[#E2E0DC] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#D85A30] transition-colors bg-white w-full'
  const lbl = 'text-[11px] font-semibold uppercase tracking-wide text-[#222] block mb-1.5'
  const section = 'bg-white rounded-xl border border-[#E2E0DC] p-6 mb-6'
  const sectionTitle = 'font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]'

  return (
    <form onSubmit={handleSubmit}>

      {/* INFO BÁSICA */}
      <div className={section}>
        <h2 className={sectionTitle}>Información básica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={lbl}>Título *</label>
            <input required className={f} value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Ej: Departamento 2 amb. a estrenar con cochera" />
          </div>
          <div>
            <label className={lbl}>Tipo *</label>
            <select required className={f} value={form.tipo} onChange={e => set('tipo', e.target.value)}>
              {TIPOS.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Operación *</label>
            <select required className={f} value={form.operacion} onChange={e => set('operacion', e.target.value)}>
              {OPERACIONES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Estado de la propiedad</label>
            <select className={f} value={form.estado} onChange={e => set('estado', e.target.value)}>
              {ESTADOS.map(e => <option key={e} value={e} className="capitalize">{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Estado de conservación</label>
            <select className={f} value={form.estado_conservacion} onChange={e => set('estado_conservacion', e.target.value)}>
              <option value="">Sin especificar</option>
              {ESTADOS_CONSERVACION.map(e => <option key={e} value={e}>{e.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Descripción corta (para cards)</label>
            <input className={f} value={form.descripcion_corta} onChange={e => set('descripcion_corta', e.target.value)} maxLength={140} placeholder="Hasta 140 caracteres" />
          </div>
          <div></div>
          <div className="md:col-span-2">
            <label className={lbl}>Descripción completa</label>
            <textarea rows={6} className={f} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} placeholder="Describí la propiedad en detalle..." />
          </div>
        </div>
      </div>

      {/* PRECIO */}
      <div className={section}>
        <h2 className={sectionTitle}>Precio</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className={lbl}>Precio</label>
            <input type="number" className={f} value={form.precio} onChange={e => set('precio', e.target.value)} placeholder="185000" />
          </div>
          <div>
            <label className={lbl}>Moneda</label>
            <select className={f} value={form.moneda} onChange={e => set('moneda', e.target.value)}>
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Expensas (ARS/mes)</label>
            <input type="number" className={f} value={form.expensas} onChange={e => set('expensas', e.target.value)} placeholder="15000" />
          </div>
          <div className="flex items-center gap-2 md:col-span-4">
            <input type="checkbox" id="neg" checked={form.precio_negociable} onChange={e => set('precio_negociable', e.target.checked)} className="w-4 h-4 accent-[#D85A30] cursor-pointer" />
            <label htmlFor="neg" className="text-[14px] cursor-pointer">Precio negociable</label>
          </div>
        </div>
      </div>

      {/* CARACTERÍSTICAS */}
      <div className={section}>
        <h2 className={sectionTitle}>Características</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['superficie_cubierta','Sup. cubierta (m²)','55'],
            ['superficie_total','Sup. total (m²)','65'],
            ['ambientes','Ambientes','2'],
            ['dormitorios','Dormitorios','1'],
            ['banos','Baños','1'],
            ['toilettes','Toilettes','0'],
            ['antiguedad','Antigüedad (años)','0'],
          ].map(([key, label, placeholder]) => (
            <div key={key}>
              <label className={lbl}>{label}</label>
              <input type="number" min="0" className={f} value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
            </div>
          ))}
          <div>
            <label className={lbl}>Piso / Unidad</label>
            <input className={f} value={form.piso} onChange={e => set('piso', e.target.value)} placeholder="4° A" />
          </div>
          <div>
            <label className={lbl}>Orientación</label>
            <select className={f} value={form.orientacion} onChange={e => set('orientacion', e.target.value)}>
              <option value="">Sin especificar</option>
              {['Norte','Sur','Este','Oeste','Noreste','Noroeste','Sureste','Suroeste'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 col-span-2 md:col-span-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.cochera} onChange={e => set('cochera', e.target.checked)} className="w-4 h-4 accent-[#D85A30]" />
              <span className="text-[14px]">Tiene cochera</span>
            </label>
            {form.cochera && (
              <div className="flex items-center gap-2">
                <label className={lbl + ' mb-0'}>Cantidad:</label>
                <input type="number" min="1" max="5" className="border border-[#E2E0DC] rounded-md px-3 py-1.5 text-[14px] focus:outline-none focus:border-[#D85A30] w-16" value={form.cocheras_cantidad} onChange={e => set('cocheras_cantidad', e.target.value)} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AMENITIES */}
      <div className={section}>
        <h2 className={sectionTitle}>Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {AMENITIES_OPCIONES.map(a => (
            <button key={a} type="button" onClick={() => toggleAmenity(a)}
              className={`px-3.5 py-1.5 rounded-full border text-[13px] font-medium transition-colors capitalize
                ${amenities.includes(a) ? 'bg-[#D85A30] border-[#D85A30] text-white' : 'border-[#E2E0DC] text-[#555] hover:border-[#D85A30]'}`}>
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* FOTOS */}
      <div className={section}>
        <h2 className={sectionTitle}>Fotos</h2>

        {/* Upload area */}
        <div
          className="border-2 border-dashed border-[#E2E0DC] rounded-xl p-8 text-center cursor-pointer hover:border-[#D85A30] transition-colors mb-5"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadingFotos ? (
            <div className="flex items-center justify-center gap-2 text-[#555]">
              <Loader2 size={20} className="animate-spin text-[#D85A30]" />
              <span className="text-[14px]">Subiendo fotos...</span>
            </div>
          ) : (
            <>
              <Upload size={28} className="mx-auto mb-2 text-[#D85A30]" />
              <p className="text-[14px] font-medium text-[#222]">Hacé clic para subir fotos</p>
              <p className="text-[12px] text-[#888] mt-1">JPG, PNG, WEBP — múltiples a la vez</p>
            </>
          )}
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFotos} />
        </div>

        {/* Grid de fotos */}
        {fotos.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {fotos.map((url, i) => (
              <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border-2 transition-colors"
                style={{ borderColor: url === fotoPrincipal ? '#D85A30' : '#E2E0DC' }}>
                <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />

                {/* Principal badge */}
                {url === fotoPrincipal && (
                  <div className="absolute top-1.5 left-1.5 bg-[#D85A30] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Star size={8} fill="white" /> Principal
                  </div>
                )}

                {/* Actions on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {url !== fotoPrincipal && (
                    <button type="button" onClick={() => setFotoPrincipal(url)}
                      title="Marcar como principal"
                      className="bg-[#D85A30] text-white text-[11px] font-semibold px-2.5 py-1.5 rounded flex items-center gap-1">
                      <Star size={10} /> Principal
                    </button>
                  )}
                  <button type="button" onClick={() => eliminarFoto(url)}
                    className="bg-red-500 text-white p-1.5 rounded">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {fotos.length === 0 && <p className="text-[13px] text-[#888]">Sin fotos aún. Subí imágenes arriba.</p>}
      </div>

      {/* MULTIMEDIA */}
      <div className={section}>
        <h2 className={sectionTitle}>Multimedia adicional</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={lbl}>Video (YouTube / Vimeo URL)</label>
            <input className={f} value={form.video_url} onChange={e => set('video_url', e.target.value)} placeholder="https://youtube.com/..." />
          </div>
          <div>
            <label className={lbl}>Recorrido virtual (Matterport URL)</label>
            <input className={f} value={form.recorrido_virtual} onChange={e => set('recorrido_virtual', e.target.value)} placeholder="https://my.matterport.com/..." />
          </div>
          <div>
            <label className={lbl}>Plano (URL de imagen)</label>
            <input className={f} value={form.plano_url} onChange={e => set('plano_url', e.target.value)} placeholder="https://..." />
          </div>
        </div>
      </div>

      {/* UBICACIÓN */}
      <div className={section}>
        <h2 className={sectionTitle}>Ubicación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Barrio *</label>
            <select required className={f} value={form.barrio} onChange={e => set('barrio', e.target.value)}>
              <option value="">Seleccionar barrio</option>
              {BARRIOS_CABA.map(b => <option key={b} value={b}>{b}</option>)}
              <option value="GBA Norte">GBA Norte</option>
              <option value="GBA Sur">GBA Sur</option>
              <option value="GBA Oeste">GBA Oeste</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Partido / Municipio</label>
            <input className={f} value={form.partido} onChange={e => set('partido', e.target.value)} placeholder="Ej: Vicente López" />
          </div>
          <div>
            <label className={lbl}>Dirección</label>
            <input className={f} value={form.direccion} onChange={e => set('direccion', e.target.value)} placeholder="Av. Corrientes 1234" />
          </div>
          <div>
            <label className={lbl}>Provincia</label>
            <input className={f} value={form.provincia} onChange={e => set('provincia', e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Latitud</label>
            <input type="number" step="any" className={f} value={form.lat} onChange={e => set('lat', e.target.value)} placeholder="-34.603722" />
          </div>
          <div>
            <label className={lbl}>Longitud</label>
            <input type="number" step="any" className={f} value={form.lng} onChange={e => set('lng', e.target.value)} placeholder="-58.381592" />
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <input type="checkbox" id="privada" checked={form.direccion_privada} onChange={e => set('direccion_privada', e.target.checked)} className="w-4 h-4 accent-[#D85A30]" />
            <label htmlFor="privada" className="text-[14px] cursor-pointer">Ocultar número exacto hasta que el interesado consulte</label>
          </div>
        </div>
      </div>

      {/* WHATSAPP */}
      <div className={section}>
        <h2 className={sectionTitle}>Botón de WhatsApp</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Número de WhatsApp</label>
            <input className={f} value={form.whatsapp_numero} onChange={e => set('whatsapp_numero', e.target.value)} placeholder="5491112345678 (sin +, con código país)" />
            <p className="text-[11px] text-[#888] mt-1">Formato: 549 + código de área + número. Ej: 5491112345678</p>
          </div>
          <div>
            <label className={lbl}>Mensaje predeterminado</label>
            <input className={f} value={form.whatsapp_mensaje} onChange={e => set('whatsapp_mensaje', e.target.value)} placeholder={`Hola, me interesa la propiedad: ${form.titulo || '...'}`} />
          </div>
        </div>
        <div className="mt-4 p-4 bg-[#F5F4F2] rounded-lg">
          <p className="text-[12px] text-[#555] font-medium mb-2">Vista previa del botón:</p>
          <a
            href={`https://wa.me/${form.whatsapp_numero}?text=${encodeURIComponent(form.whatsapp_mensaje || `Hola, me interesa: ${form.titulo}`)}`}
            target="_blank"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold text-[14px] px-5 py-2.5 rounded-md"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Consultar por WhatsApp
          </a>
        </div>
      </div>

      {/* SEO */}
      <div className={section}>
        <h2 className={sectionTitle}>SEO (opcional)</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={lbl}>Meta título (máx 60 caracteres)</label>
            <input className={f} value={form.meta_titulo} onChange={e => set('meta_titulo', e.target.value)} maxLength={60} placeholder={`${form.titulo} | G&P Negocios Inmobiliarios`} />
          </div>
          <div>
            <label className={lbl}>Meta descripción (máx 160 caracteres)</label>
            <textarea rows={2} className={f} value={form.meta_descripcion} onChange={e => set('meta_descripcion', e.target.value)} maxLength={160} />
          </div>
        </div>
      </div>

      {/* PUBLICACIÓN */}
      <div className={section}>
        <h2 className={sectionTitle}>Publicación</h2>
        <div className="flex flex-wrap gap-6">
          {[
            ['publicada', 'Publicar en el sitio', 'La propiedad será visible para todos'],
            ['destacada', 'Destacada', 'Aparece primero en la home y el listado'],
            ['emprendimiento', 'Es un emprendimiento', 'Se muestra en la sección En Pozo'],
          ].map(([key, label, desc]) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={(form as any)[key]} onChange={e => set(key, e.target.checked)} className="w-4 h-4 accent-[#D85A30] mt-0.5" />
              <div>
                <span className="text-[14px] font-medium">{label}</span>
                <p className="text-[12px] text-[#888]">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* BOTONES */}
      <div className="flex gap-3 pb-10">
        <button type="submit" disabled={loading || uploadingFotos}
          className="flex items-center gap-2 bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[15px] px-8 py-3.5 rounded-md transition-colors disabled:opacity-60">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Guardando...</> : <><Save size={16} /> {mode === 'nueva' ? 'Crear propiedad' : 'Guardar cambios'}</>}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-3.5 border border-[#E2E0DC] rounded-md text-[14px] font-medium hover:border-[#111] transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  )
}
