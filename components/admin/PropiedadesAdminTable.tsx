'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, Pencil, Star, Globe, GlobeLock, Trash2 } from 'lucide-react'
import { formatPrecio } from '@/lib/propiedades'

interface Prop {
  id: string; slug: string; titulo: string; tipo: string
  operacion: string; precio?: number; moneda: string
  barrio?: string; estado: string; publicada: boolean
  destacada: boolean; emprendimiento: boolean
  vistas: number; leads_count: number; foto_principal?: string
}

const ESTADO_COLOR: Record<string, string> = {
  disponible: 'bg-green-100 text-green-700',
  reservada: 'bg-yellow-100 text-yellow-700',
  vendida: 'bg-gray-100 text-gray-500',
  alquilada: 'bg-blue-100 text-blue-700',
  pausada: 'bg-red-100 text-red-500',
}

const OPERACION_COLOR: Record<string, string> = {
  venta: 'bg-[#111] text-white',
  alquiler: 'bg-[#D85A30] text-white',
  alquiler_temporal: 'bg-orange-100 text-orange-700',
  pozo: 'bg-blue-600 text-white',
}

export default function PropiedadesAdminTable({ propiedades: initial }: { propiedades: Prop[] }) {
  const [props, setProps] = useState(initial)
  const [filter, setFilter] = useState('todas')

  const toggle = async (id: string, field: 'publicada' | 'destacada', current: boolean) => {
    const res = await fetch(`/api/propiedades/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !current }),
    })
    if (res.ok) {
      setProps(prev => prev.map(p => p.id === id ? { ...p, [field]: !current } : p))
    }
  }

  const updateEstado = async (id: string, estado: string) => {
    await fetch(`/api/propiedades/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })
    setProps(prev => prev.map(p => p.id === id ? { ...p, estado } : p))
  }

  const eliminar = async (id: string, titulo: string) => {
    if (!confirm(`¿Eliminar "${titulo}"? Esta acción no se puede deshacer.`)) return
    const res = await fetch(`/api/propiedades/${id}`, { method: 'DELETE' })
    if (res.ok) setProps(prev => prev.filter(p => p.id !== id))
  }

  const filtradas = filter === 'todas' ? props
    : filter === 'publicadas' ? props.filter(p => p.publicada)
    : filter === 'borradores' ? props.filter(p => !p.publicada)
    : filter === 'destacadas' ? props.filter(p => p.destacada)
    : filter === 'pozo' ? props.filter(p => p.operacion === 'pozo')
    : props

  return (
    <div className="bg-white rounded-xl border border-[#E2E0DC] overflow-hidden">
      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2 px-5 py-4 border-b border-[#E2E0DC]">
        {[
          ['todas', `Todas (${props.length})`],
          ['publicadas', `Publicadas (${props.filter(p=>p.publicada).length})`],
          ['borradores', `Borradores (${props.filter(p=>!p.publicada).length})`],
          ['destacadas', `Destacadas (${props.filter(p=>p.destacada).length})`],
          ['pozo', `En pozo (${props.filter(p=>p.operacion==='pozo').length})`],
        ].map(([val, lbl]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors ${filter === val ? 'bg-[#111] text-white' : 'bg-[#F5F4F2] text-[#555] hover:bg-[#E2E0DC]'}`}>
            {lbl}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F5F4F2] border-b border-[#E2E0DC]">
            <tr>
              {['Propiedad', 'Op.', 'Precio', 'Estado', 'Publicada', 'Destacada', 'Vistas', 'Leads', 'Acciones'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#555] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E0DC]">
            {filtradas.map(p => (
              <tr key={p.id} className="hover:bg-[#FAFAFA] transition-colors">
                {/* Propiedad */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F5F4F2] shrink-0">
                      {p.foto_principal
                        ? <img src={p.foto_principal} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-lg opacity-30">🏠</div>
                      }
                    </div>
                    <div>
                      <div className="text-[13px] font-medium max-w-[200px] truncate">{p.titulo}</div>
                      <div className="text-[11px] text-[#888] capitalize">{p.tipo} · {p.barrio}</div>
                    </div>
                  </div>
                </td>

                {/* Operación */}
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${OPERACION_COLOR[p.operacion] ?? 'bg-gray-100 text-gray-600'}`}>
                    {p.operacion === 'alquiler_temporal' ? 'Temp.' : p.operacion}
                  </span>
                </td>

                {/* Precio */}
                <td className="px-4 py-3 text-[13px] font-medium whitespace-nowrap">{formatPrecio(p.precio, p.moneda)}</td>

                {/* Estado */}
                <td className="px-4 py-3">
                  <select value={p.estado} onChange={e => updateEstado(p.id, e.target.value)}
                    className={`text-[11px] font-medium px-2 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none capitalize ${ESTADO_COLOR[p.estado] ?? 'bg-gray-100'}`}>
                    {['disponible','reservada','vendida','alquilada','pausada'].map(e => (
                      <option key={e} value={e} className="bg-white text-[#111] capitalize">{e}</option>
                    ))}
                  </select>
                </td>

                {/* Publicada toggle */}
                <td className="px-4 py-3">
                  <button onClick={() => toggle(p.id, 'publicada', p.publicada)}
                    title={p.publicada ? 'Despublicar' : 'Publicar'}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${p.publicada ? 'bg-green-100 text-green-600 hover:bg-red-100 hover:text-red-500' : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'}`}>
                    {p.publicada ? <Globe size={14} /> : <GlobeLock size={14} />}
                  </button>
                </td>

                {/* Destacada toggle */}
                <td className="px-4 py-3">
                  <button onClick={() => toggle(p.id, 'destacada', p.destacada)}
                    title={p.destacada ? 'Quitar destacado' : 'Marcar destacada'}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${p.destacada ? 'bg-yellow-100 text-yellow-500' : 'bg-gray-100 text-gray-300 hover:bg-yellow-100 hover:text-yellow-500'}`}>
                    <Star size={14} fill={p.destacada ? 'currentColor' : 'none'} />
                  </button>
                </td>

                {/* Stats */}
                <td className="px-4 py-3 text-[13px] text-[#888]">
                  <span className="flex items-center gap-1"><Eye size={11} /> {p.vistas}</span>
                </td>
                <td className="px-4 py-3 text-[13px] text-[#888]">{p.leads_count}</td>

                {/* Acciones */}
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {p.publicada && (
                      <Link href={`/propiedades/${p.slug}`} target="_blank"
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#F5F4F2] text-[#555] transition-colors" title="Ver en sitio">
                        <Eye size={13} />
                      </Link>
                    )}
                    <Link href={`/admin/propiedades/${p.id}`}
                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#F5F4F2] text-[#555] transition-colors" title="Editar">
                      <Pencil size={13} />
                    </Link>
                    <button onClick={() => eliminar(p.id, p.titulo)}
                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-[#ccc] hover:text-red-400 transition-colors" title="Eliminar">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtradas.length === 0 && (
          <div className="py-16 text-center text-[#555] text-[14px]">
            No hay propiedades con este filtro.{' '}
            <Link href="/admin/nueva" className="text-[#D85A30] hover:underline">Crear una</Link>
          </div>
        )}
      </div>
    </div>
  )
}
