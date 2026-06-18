'use client'
import { useState } from 'react'
import { MapPin, Users, TrendingUp, DollarSign } from 'lucide-react'

const ESTADO_COLOR: Record<string,string> = {
  nuevo: 'bg-blue-100 text-blue-700',
  contactado: 'bg-yellow-100 text-yellow-700',
  calificado: 'bg-purple-100 text-purple-700',
  visita_agendada: 'bg-orange-100 text-orange-700',
  ganado: 'bg-green-100 text-green-700',
  perdido: 'bg-red-100 text-red-500',
}

export default function ReferidosPanel({ referidores, leads }: { referidores: any[]; leads: any[] }) {
  const [selectedRef, setSelectedRef] = useState<string>('todos')

  const leadsFiltered = selectedRef === 'todos'
    ? leads
    : leads.filter(l => l.referido_por === selectedRef)

  const totalGanados = leadsFiltered.filter(l => l.estado === 'ganado').length
  const totalReferidores = referidores.length

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-black text-[32px] uppercase tracking-tight">Red del interior</h1>
        <p className="text-[14px] text-[#555] mt-1">Seguimiento de referidos de inmobiliarias del interior del país</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Inmobiliarias activas', value: totalReferidores, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Leads referidos', value: leads.length, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Operaciones cerradas', value: totalGanados, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Conversión', value: leads.length > 0 ? `${Math.round(totalGanados/leads.length*100)}%` : '0%', icon: TrendingUp, color: 'text-[#D85A30]', bg: 'bg-orange-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4 border border-[#E2E0DC]`}>
            <Icon size={18} className={`${color} mb-2`}/>
            <div className={`font-display font-black text-[32px] leading-none ${color}`}>{value}</div>
            <div className="text-[12px] font-medium text-[#555] mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de referidores */}
        <div className="bg-white rounded-xl border border-[#E2E0DC] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E0DC]">
            <h2 className="font-display font-bold text-[16px] uppercase">Inmobiliarias del interior</h2>
          </div>
          <div className="divide-y divide-[#E2E0DC]">
            <button onClick={() => setSelectedRef('todos')}
              className={`w-full flex items-center justify-between px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors text-left ${selectedRef==='todos' ? 'bg-[#FDF3EF]' : ''}`}>
              <span className="font-medium text-[14px]">Todas</span>
              <span className="text-[12px] text-[#888]">{leads.length} leads</span>
            </button>
            {referidores.map(r => {
              const count = leads.filter(l => l.referido_por === r.id).length
              const cerrados = leads.filter(l => l.referido_por === r.id && l.estado === 'ganado').length
              return (
                <button key={r.id} onClick={() => setSelectedRef(r.id)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors text-left ${selectedRef===r.id ? 'bg-[#FDF3EF]' : ''}`}>
                  <div>
                    <div className="font-medium text-[13px]">{r.nombre}</div>
                    <div className="text-[11px] text-[#888] flex items-center gap-1 mt-0.5">
                      <MapPin size={10}/>{r.zona_origen}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-[12px] font-medium">{count} leads</div>
                    {cerrados > 0 && <div className="text-[10px] text-green-600">{cerrados} cerrados</div>}
                  </div>
                </button>
              )
            })}
            {referidores.length === 0 && (
              <div className="px-5 py-8 text-center text-[#888] text-[13px]">
                No hay inmobiliarias del interior activas todavía.
              </div>
            )}
          </div>
        </div>

        {/* Leads del referidor seleccionado */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E0DC] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E0DC] flex items-center justify-between">
            <h2 className="font-display font-bold text-[16px] uppercase">
              Leads {selectedRef !== 'todos' ? `de ${referidores.find(r=>r.id===selectedRef)?.nombre}` : 'de toda la red'}
            </h2>
            <span className="text-[13px] text-[#888]">{leadsFiltered.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F4F2] border-b border-[#E2E0DC]">
                <tr>
                  {['Contacto', 'Propiedad interés', 'Referidor', 'Estado', 'Fecha'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#555] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E0DC]">
                {leadsFiltered.map((l: any) => (
                  <tr key={l.id} className="hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[13px]">{l.nombre}</div>
                      <div className="text-[11px] text-[#888]">{l.telefono}</div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#555] max-w-[140px]">
                      {l.propiedades?.titulo ?? l.interes ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#888]">
                      {l.inmobiliarias?.nombre ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${ESTADO_COLOR[l.estado] ?? 'bg-gray-100'}`}>
                        {l.estado?.replace('_',' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-[#888]">
                      {new Date(l.creado_en).toLocaleDateString('es-AR', {day:'2-digit',month:'2-digit',year:'2-digit'})}
                    </td>
                  </tr>
                ))}
                {leadsFiltered.length === 0 && (
                  <tr><td colSpan={5} className="py-10 text-center text-[#888] text-[13px]">No hay leads todavía.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
