'use client'
import { useState } from 'react'
import { CheckCircle, XCircle, Clock, Building2, Plus, ExternalLink, Pencil } from 'lucide-react'

const ESTADO_COLOR: Record<string,string> = {
  pendiente:  'bg-yellow-100 text-yellow-700',
  aprobada:   'bg-green-100 text-green-700',
  rechazada:  'bg-red-100 text-red-500',
  contactada: 'bg-blue-100 text-blue-700',
}
const PLAN_COLOR: Record<string,string> = {
  free:       'bg-gray-100 text-gray-500',
  starter:    'bg-blue-100 text-blue-700',
  pro:        'bg-purple-100 text-purple-700',
  enterprise: 'bg-[#111] text-white',
}

interface Solicitud {
  id: string; nombre: string; email: string; telefono?: string
  nombre_empresa?: string; plan_interes: string; estado: string
  mensaje?: string; creada_en: string
}
interface Socia {
  id: string; nombre: string; email: string; plan: string
  activa: boolean; comision_pct: number; creada_en: string; logo_url?: string
}

export default function MarketplacePanel({ solicitudes: init, socias: initSocias }: { solicitudes: Solicitud[]; socias: Socia[] }) {
  const [tab, setTab] = useState<'solicitudes'|'socias'>('solicitudes')
  const [solicitudes, setSolicitudes] = useState(init)
  const [socias] = useState(initSocias)

  const updateEstado = async (id: string, estado: string) => {
    await fetch(`/api/marketplace/solicitud/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })
    setSolicitudes(p => p.map(s => s.id === id ? { ...s, estado } : s))
  }

  const pendientes = solicitudes.filter(s => s.estado === 'pendiente').length

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-[32px] uppercase tracking-tight">Marketplace</h1>
          <p className="text-[14px] text-[#555] mt-1">Gestión de inmobiliarias socias y solicitudes de alta</p>
        </div>
        <button className="flex items-center gap-2 bg-[#D85A30] text-white font-semibold text-[14px] px-5 py-2.5 rounded-md hover:bg-[#B84A22] transition-colors">
          <Plus size={16} /> Alta manual
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Socias activas', value: socias.filter(s=>s.activa).length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Plan Pro', value: socias.filter(s=>s.plan==='pro').length, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Solicitudes pendientes', value: pendientes, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Total solicitudes', value: solicitudes.length, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4 border border-[#E2E0DC]`}>
            <div className={`font-display font-black text-[32px] leading-none ${color}`}>{value}</div>
            <div className="text-[12px] font-medium text-[#555] mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-[#F5F4F2] p-1 rounded-lg w-fit">
        {([['solicitudes','Solicitudes'],['socias','Inmobiliarias socias']] as const).map(([val,lbl]) => (
          <button key={val} onClick={() => setTab(val)}
            className={`px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${tab===val ? 'bg-white shadow-sm text-[#111]' : 'text-[#555] hover:text-[#111]'}`}>
            {lbl} {val==='solicitudes' && pendientes > 0 && <span className="ml-1.5 bg-[#D85A30] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendientes}</span>}
          </button>
        ))}
      </div>

      {tab === 'solicitudes' && (
        <div className="bg-white rounded-xl border border-[#E2E0DC] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F5F4F2] border-b border-[#E2E0DC]">
              <tr>
                {['Solicitante', 'Empresa', 'Plan interés', 'Estado', 'Fecha', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#555]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0DC]">
              {solicitudes.map(s => (
                <tr key={s.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-[14px]">{s.nombre}</div>
                    <div className="text-[12px] text-[#888]">{s.email}</div>
                    {s.telefono && <div className="text-[12px] text-[#888]">{s.telefono}</div>}
                  </td>
                  <td className="px-5 py-4 text-[13px]">{s.nombre_empresa ?? '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${PLAN_COLOR[s.plan_interes] ?? 'bg-gray-100'}`}>
                      {s.plan_interes}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select value={s.estado} onChange={e => updateEstado(s.id, e.target.value)}
                      className={`text-[11px] font-medium px-2.5 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none capitalize ${ESTADO_COLOR[s.estado]}`}>
                      {['pendiente','contactada','aprobada','rechazada'].map(e => (
                        <option key={e} value={e} className="bg-white text-[#111] capitalize">{e}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-[#888]">
                    {new Date(s.creada_en).toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'2-digit' })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {s.estado === 'pendiente' && (
                        <>
                          <button onClick={() => updateEstado(s.id, 'aprobada')}
                            className="w-7 h-7 flex items-center justify-center rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Aprobar">
                            <CheckCircle size={14} />
                          </button>
                          <button onClick={() => updateEstado(s.id, 'rechazada')}
                            className="w-7 h-7 flex items-center justify-center rounded bg-red-50 text-red-400 hover:bg-red-100 transition-colors" title="Rechazar">
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                      {s.email && (
                        <a href={`mailto:${s.email}?subject=G%26P%20Marketplace%20-%20Tu%20solicitud&body=Hola%20${s.nombre}%2C%20recibimos%20tu%20solicitud%20para%20unirte%20al%20marketplace%20de%20G%26P.`}
                          className="w-7 h-7 flex items-center justify-center rounded bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors" title="Enviar email">
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {solicitudes.length === 0 && (
                <tr><td colSpan={6} className="py-16 text-center text-[#555] text-[14px]">No hay solicitudes todavía.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'socias' && (
        <div className="bg-white rounded-xl border border-[#E2E0DC] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F5F4F2] border-b border-[#E2E0DC]">
              <tr>
                {['Inmobiliaria', 'Plan', 'Comisión', 'Estado', 'Alta', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#555]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0DC]">
              {socias.map(s => (
                <tr key={s.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {s.logo_url
                        ? <img src={s.logo_url} alt={s.nombre} className="w-8 h-8 rounded object-cover" />
                        : <div className="w-8 h-8 bg-[#F5F4F2] rounded flex items-center justify-center"><Building2 size={14} className="text-[#aaa]" /></div>
                      }
                      <div>
                        <div className="font-medium text-[14px]">{s.nombre}</div>
                        <div className="text-[12px] text-[#888]">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${PLAN_COLOR[s.plan] ?? 'bg-gray-100'}`}>
                      {s.plan}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[14px] font-medium">{s.comision_pct}%</td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${s.activa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-[#888]">
                    {new Date(s.creada_en).toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'2-digit' })}
                  </td>
                  <td className="px-5 py-4">
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#F5F4F2] text-[#555] transition-colors">
                      <Pencil size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {socias.length === 0 && (
                <tr><td colSpan={6} className="py-16 text-center text-[#555] text-[14px]">No hay inmobiliarias socias todavía.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
