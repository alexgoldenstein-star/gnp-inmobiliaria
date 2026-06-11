'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2 } from 'lucide-react'
import FotosUploader from '@/components/admin/FotosUploader'
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

  const [loading, setLoading] = useState(false)
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
  })

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const toggleAmenity = (a: string) => setAmenities(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a])


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
        <FotosUploader
          fotos={fotos}
          fotoPrincipal={fotoPrincipal}
          onChange={(nuevasFotos, nuevaPrincipal) => {
            setFotos(nuevasFotos)
            setFotoPrincipal(nuevaPrincipal)
          }}
        />
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
        <button type="submit" disabled={loading}
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
