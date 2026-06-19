'use client'
import { useState } from 'react'
import { Phone, MessageCircle, MapPin, Ruler, DollarSign, Building } from 'lucide-react'

const ESTADO_COLOR: Record<string,string> = {
  pendiente: 'bg-gray-100 text-gray-500',
  calculado: 'bg-blue-100 text-blue-700',
  contactado: 'bg-yellow-100 text-yellow-700',
  en_negociacion: 'bg-purple-100 text-purple-700',
  cerrado: 'bg-green-100 text-green-700',
  descartado: 'bg-red-100 text-red-500',
}
const ESTADOS = ['pendiente','calculado','contactado','en_negociacion','cerrado','descartado']

interface Solicitud {
  id: string; nombre: string; telefono: string; email?: string
  direccion: string; barrio?: string; superficie_m2: number
  zonificacion?: string; m2_construibles?: number
  valor_terreno_estimado_usd?: number; estado: string
  creada_en: string
}

export default function LotesPanel({ solicitudes: init }: { solicitudes: Solicitud[] }) {
  const [solicitudes, setSolicitudes] = useState(init)
  const [filter, setFilter] = useState('todos')

  const updateEstado = async (id: string, estado: string) => {
    await fetch(`/api/admin/factibilidad/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })
    setSolicitudes(p => p.map(s => s.id === id ? { ...s, estado } : s))
  }

  const filtered = filter === 'todos' ? solicitudes : solicitudes.filter(s => s.estado === filter)
  const valorTotal = solicitudes.reduce((sum, s) => sum + (s.valor_terreno_estimado_usd ?? 0), 0)

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-black text-[32px] uppercase tracking-tight">Lotes — Factibilidades</h1>
        <p className="text-[14px] text-[#555] mt-1">Solicitudes de análisis de terrenos recibidas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total solicitudes', value: solicitudes.length, color: 'text-[#111]', bg: 'bg-white' },
          { label: 'Sin contactar', value: solicitudes.filter(s=>s.estado==='calculado').length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'En negociación', value: solicitudes.filter(s=>s.estado==='en_negociacion').length, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Valor potencial', value: `USD ${(valorTotal/1000).toFixed(0)}k`, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4 border border-[#E2E0DC]`}>
            <div className={`font-display font-black text-[28px] leading-none ${color}`}>{value}</div>
            <div className="text-[12px] font-medium text-[#555] mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['todos', ...ESTADOS].map(e => (
          <button key={e} onClick={() => setFilter(e)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors capitalize ${filter===e ? 'bg-[#111] text-white' : 'bg-white text-[#555] border border-[#E2E0DC] hover:border-[#111]'}`}>
            {e.replace('_',' ')}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {filtered.map(s => (
          <div key={s.id} className="bg-white rounded-xl border border-[#E2E0DC] p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-[15px]">{s.nombre}</div>
                <div className="text-[12px] text-[#888] flex items-center gap-1 mt-0.5">
                  <MapPin size={11}/> {s.direccion}, {s.barrio}
                </div>
              </div>
              <select value={s.estado} onChange={e => updateEstado(s.id, e.target.value)}
                className={`text-[11px] font-medium px-2.5 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none capitalize ${ESTADO_COLOR[s.estado]}`}>
                {ESTADOS.map(e => <option key={e} value={e} className="bg-white text-[#111] capitalize">{e.replace('_',' ')}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 p-3 bg-[#F5F4F2] rounded-lg">
              <div>
                <div className="text-[10px] text-[#888] uppercase">Superficie</div>
                <div className="text-[14px] font-semibold">{s.superficie_m2} m²</div>
              </div>
              <div>
                <div className="text-[10px] text-[#888] uppercase">Zonificación</div>
                <div className="text-[12px] font-medium truncate">{s.zonificacion ?? '—'}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#888] uppercase">M² construibles</div>
                <div className="text-[14px] font-semibold">{s.m2_construibles ?? '—'}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#888] uppercase">Valor estimado</div>
                <div className="text-[14px] font-semibold text-[#D85A30]">
                  {s.valor_terreno_estimado_usd ? `USD ${s.valor_terreno_estimado_usd.toLocaleString()}` : '—'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#aaa]">
                {new Date(s.creada_en).toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit' })}
              </span>
              <div className="flex gap-2">
                <a href={`https://wa.me/${s.telefono.replace(/\D/g,'')}`} target="_blank"
                  className="flex items-center gap-1.5 bg-[#25D366] text-white text-[12px] font-medium px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                  <MessageCircle size={12}/> WhatsApp
                </a>
                <a href={`tel:${s.telefono}`}
                  className="flex items-center gap-1.5 bg-blue-500 text-white text-[12px] font-medium px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                  <Phone size={12}/> Llamar
                </a>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#555] text-[14px] bg-white rounded-xl border border-[#E2E0DC]">
            No hay solicitudes con este filtro.
          </div>
        )}
      </div>
    </div>
  )
}
