'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, Upload } from 'lucide-react'

const TIPOS = ['departamento','casa','ph','local','oficina','terreno','cochera','galpon','emprendimiento']
const OPERACIONES = ['venta','alquiler','alquiler_temporal','pozo']
const ESTADOS_CONSERVACION = ['a_estrenar','excelente','muy_bueno','bueno','regular','a_reciclar']
const AMENITIES_OPCIONES = ['pileta','sum','gimnasio','laundry','terraza','parrilla','seguridad 24hs','portero','bicicletero','cine','coworking','spa','jacuzzi']
const BARRIOS_CABA = ['Almagro','Balvanera','Barracas','Belgrano','Boedo','Caballito','Chacarita','Coghlan','Colegiales','Constitución','Flores','Floresta','La Boca','La Paternal','Liniers','Mataderos','Monserrat','Monte Castro','Nueva Pompeya','Núñez','Palermo','Parque Avellaneda','Parque Chacabuco','Parque Chas','Parque Patricios','Puerto Madero','Recoleta','Retiro','Saavedra','San Cristóbal','San Nicolás','San Telmo','Vélez Sársfield','Versalles','Villa Crespo','Villa del Parque','Villa Devoto','Villa Gral. Mitre','Villa Lugano','Villa Luro','Villa Ortúzar','Villa Pueyrredón','Villa Real','Villa Riachuelo','Villa Santa Rita','Villa Soldati','Villa Urquiza','Villa del Parque']

export default function NuevaPropiedadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [amenitiesSeleccionados, setAmenities] = useState<string[]>([])
  const [form, setForm] = useState({
    titulo: '', descripcion: '', descripcion_corta: '',
    tipo: 'departamento', operacion: 'venta', estado: 'disponible',
    precio: '', moneda: 'USD', expensas: '', precio_negociable: false,
    superficie_total: '', superficie_cubierta: '',
    ambientes: '', dormitorios: '', banos: '', toilettes: '0',
    cochera: false, cocheras_cantidad: '0',
    piso: '', orientacion: '', antiguedad: '', estado_conservacion: '',
    barrio: '', direccion: '', provincia: 'CABA',
    lat: '', lng: '', direccion_privada: true,
    publicada: false, destacada: false, emprendimiento: false,
  })

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const toggleAmenity = (a: string) => setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/propiedades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amenities: amenitiesSeleccionados })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push('/admin/propiedades')
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = "border border-[#E2E0DC] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#D85A30] transition-colors bg-white w-full"
  const labelClass = "text-[11px] font-semibold uppercase tracking-wide text-[#222] block mb-1.5"

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-black text-[32px] uppercase tracking-tight">Nueva propiedad</h1>
        <p className="text-[14px] text-[#555] mt-1">Completá los datos para publicar una nueva propiedad.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECCIÓN: Información básica */}
        <div className="bg-white rounded-xl border border-[#E2E0DC] p-6">
          <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Información básica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Título *</label>
              <input required className={fieldClass} value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Ej: Departamento 2 amb. a estrenar con cochera" />
            </div>
            <div>
              <label className={labelClass}>Tipo *</label>
              <select required className={fieldClass} value={form.tipo} onChange={e => set('tipo', e.target.value)}>
                {TIPOS.map(t => <option key={t} value={t} className="capitalize">{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Operación *</label>
              <select required className={fieldClass} value={form.operacion} onChange={e => set('operacion', e.target.value)}>
                {OPERACIONES.map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Descripción corta (para cards)</label>
              <input className={fieldClass} value={form.descripcion_corta} onChange={e => set('descripcion_corta', e.target.value)} placeholder="Hasta 140 caracteres" maxLength={140} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Descripción completa</label>
              <textarea rows={5} className={fieldClass} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} placeholder="Describí la propiedad con todos los detalles..." />
            </div>
          </div>
        </div>

        {/* SECCIÓN: Precio */}
        <div className="bg-white rounded-xl border border-[#E2E0DC] p-6">
          <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Precio</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Precio</label>
              <input type="number" className={fieldClass} value={form.precio} onChange={e => set('precio', e.target.value)} placeholder="185000" />
            </div>
            <div>
              <label className={labelClass}>Moneda</label>
              <select className={fieldClass} value={form.moneda} onChange={e => set('moneda', e.target.value)}>
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Expensas (ARS)</label>
              <input type="number" className={fieldClass} value={form.expensas} onChange={e => set('expensas', e.target.value)} placeholder="15000" />
            </div>
            <div className="flex items-center gap-2 md:col-span-4">
              <input type="checkbox" id="neg" checked={form.precio_negociable} onChange={e => set('precio_negociable', e.target.checked)} className="w-4 h-4 accent-[#D85A30]" />
              <label htmlFor="neg" className="text-[14px] text-[#333] cursor-pointer">Precio negociable</label>
            </div>
          </div>
        </div>

        {/* SECCIÓN: Características */}
        <div className="bg-white rounded-xl border border-[#E2E0DC] p-6">
          <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Características</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['superficie_cubierta', 'Superficie cubierta (m²)', '55'],
              ['superficie_total', 'Superficie total (m²)', '65'],
              ['ambientes', 'Ambientes', '2'],
              ['dormitorios', 'Dormitorios', '1'],
              ['banos', 'Baños', '1'],
              ['toilettes', 'Toilettes', '0'],
              ['piso', 'Piso', '4° A'],
              ['antiguedad', 'Antigüedad (años, 0=estrenar)', '0'],
            ].map(([key, label, placeholder]) => (
              <div key={key}>
                <label className={labelClass}>{label}</label>
                <input type={['piso','orientacion'].includes(key) ? 'text' : 'number'} className={fieldClass}
                  value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
              </div>
            ))}
            <div>
              <label className={labelClass}>Estado conservación</label>
              <select className={fieldClass} value={form.estado_conservacion} onChange={e => set('estado_conservacion', e.target.value)}>
                <option value="">Seleccionar</option>
                {ESTADOS_CONSERVACION.map(e => <option key={e} value={e}>{e.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Orientación</label>
              <select className={fieldClass} value={form.orientacion} onChange={e => set('orientacion', e.target.value)}>
                <option value="">Sin especificar</option>
                {['Norte','Sur','Este','Oeste','Noreste','Noroeste','Sureste','Suroeste'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <input type="checkbox" id="cochera" checked={form.cochera} onChange={e => set('cochera', e.target.checked)} className="w-4 h-4 accent-[#D85A30]" />
              <label htmlFor="cochera" className="text-[14px] cursor-pointer">Tiene cochera</label>
            </div>
          </div>
        </div>

        {/* SECCIÓN: Amenities */}
        <div className="bg-white rounded-xl border border-[#E2E0DC] p-6">
          <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_OPCIONES.map(a => (
              <button key={a} type="button" onClick={() => toggleAmenity(a)}
                className={`px-3.5 py-1.5 rounded-full border text-[13px] font-medium transition-colors capitalize ${amenitiesSeleccionados.includes(a) ? 'bg-[#D85A30] border-[#D85A30] text-white' : 'border-[#E2E0DC] text-[#555] hover:border-[#D85A30]'}`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* SECCIÓN: Ubicación */}
        <div className="bg-white rounded-xl border border-[#E2E0DC] p-6">
          <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Ubicación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Barrio *</label>
              <select required className={fieldClass} value={form.barrio} onChange={e => set('barrio', e.target.value)}>
                <option value="">Seleccionar barrio</option>
                {BARRIOS_CABA.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Dirección (calle y número)</label>
              <input className={fieldClass} value={form.direccion} onChange={e => set('direccion', e.target.value)} placeholder="Av. Corrientes 1234" />
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <input type="checkbox" id="privada" checked={form.direccion_privada} onChange={e => set('direccion_privada', e.target.checked)} className="w-4 h-4 accent-[#D85A30]" />
              <label htmlFor="privada" className="text-[14px] cursor-pointer">Ocultar número exacto hasta que el interesado consulte</label>
            </div>
          </div>
        </div>

        {/* SECCIÓN: Publicación */}
        <div className="bg-white rounded-xl border border-[#E2E0DC] p-6">
          <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Publicación</h2>
          <div className="flex gap-6">
            {[
              ['publicada', 'Publicar en el sitio'],
              ['destacada', 'Marcar como destacada'],
              ['emprendimiento', 'Es un emprendimiento / pozo'],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={(form as any)[key]} onChange={e => set(key, e.target.checked)} className="w-4 h-4 accent-[#D85A30]" />
                <span className="text-[14px]">{label}</span>
              </label>
            ))}
          </div>
          <p className="text-[12px] text-[#888] mt-3">Las fotos se podrán subir después de crear la propiedad.</p>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[15px] px-8 py-3.5 rounded-md transition-colors disabled:opacity-60">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Guardando...</> : <><Save size={16} /> Guardar propiedad</>}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-3.5 border border-[#E2E0DC] rounded-md text-[14px] font-medium hover:border-[#111] transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
