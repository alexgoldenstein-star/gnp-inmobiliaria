'use client'
import { useState } from 'react'
import { Phone, MessageCircle, Mail, ChevronDown, StickyNote, X, Save } from 'lucide-react'

const ESTADOS = ['nuevo','visto','contactado','calificado','visita_agendada','propuesta_enviada','negociando','ganado','perdido','spam']
const ESTADO_COLOR: Record<string, string> = {
  nuevo: 'bg-blue-100 text-blue-700',
  visto: 'bg-gray-100 text-gray-600',
  contactado: 'bg-yellow-100 text-yellow-700',
  calificado: 'bg-purple-100 text-purple-700',
  visita_agendada: 'bg-orange-100 text-orange-700',
  propuesta_enviada: 'bg-indigo-100 text-indigo-600',
  negociando: 'bg-pink-100 text-pink-700',
  ganado: 'bg-green-100 text-green-700',
  perdido: 'bg-red-100 text-red-500',
  spam: 'bg-gray-100 text-gray-400',
}
const CANAL_ICON: Record<string, string> = {
  web: '🌐', whatsapp: '💬', meta_ads: '📘', google_ads: '🔍', referido: '🤝', otro: '📋'
}

interface Lead {
  id: string
  nombre: string
  email?: string
  telefono?: string
  mensaje?: string
  canal: string
  estado: string
  prioridad: string
  notas?: string
  creado_en: string
  propiedades?: { titulo: string; slug: string } | null
}

export default function LeadsTable({ leads: initialLeads }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads)
  const [editingNota, setEditingNota] = useState<string | null>(null)
  const [notaTemp, setNotaTemp] = useState('')
  const [filter, setFilter] = useState('todos')

  const updateLead = async (id: string, data: Partial<Lead>) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, ...data } : l))
    }
  }

  const saveNota = async (id: string) => {
    await updateLead(id, { notas: notaTemp })
    setEditingNota(null)
  }

  const filtrados = filter === 'todos' ? leads : leads.filter(l => l.estado === filter)

  return (
    <div className="bg-white rounded-xl border border-[#E2E0DC] overflow-hidden">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 px-5 py-4 border-b border-[#E2E0DC]">
        {['todos', ...ESTADOS.slice(0, 6)].map(e => (
          <button key={e} onClick={() => setFilter(e)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors capitalize ${filter === e ? 'bg-[#111] text-white' : 'bg-[#F5F4F2] text-[#555] hover:bg-[#E2E0DC]'}`}>
            {e === 'todos' ? `Todos (${leads.length})` : e.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F5F4F2] border-b border-[#E2E0DC]">
            <tr>
              {['Contacto', 'Canal', 'Propiedad', 'Mensaje', 'Estado', 'Acciones', 'Notas'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#555] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E0DC]">
            {filtrados.map(lead => (
              <tr key={lead.id} className="hover:bg-[#FAFAFA] transition-colors align-top">
                {/* Contacto */}
                <td className="px-5 py-4">
                  <div className="font-medium text-[14px]">{lead.nombre}</div>
                  <div className="text-[12px] text-[#555] mt-0.5">{lead.telefono}</div>
                  {lead.email && <div className="text-[11px] text-[#888]">{lead.email}</div>}
                  <div className="text-[11px] text-[#999] mt-1">
                    {new Date(lead.creado_en).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>

                {/* Canal */}
                <td className="px-5 py-4 text-[13px] whitespace-nowrap">
                  {CANAL_ICON[lead.canal] ?? '📋'} {lead.canal?.replace('_', ' ')}
                </td>

                {/* Propiedad */}
                <td className="px-5 py-4 text-[13px] max-w-[160px]">
                  {lead.propiedades ? (
                    <a href={`/propiedades/${lead.propiedades.slug}`} target="_blank"
                      className="text-[#D85A30] hover:underline text-[12px] leading-tight">
                      {lead.propiedades.titulo}
                    </a>
                  ) : <span className="text-[#888]">—</span>}
                </td>

                {/* Mensaje */}
                <td className="px-5 py-4 text-[12px] text-[#555] max-w-[180px]">
                  <span className="line-clamp-2">{lead.mensaje ?? '—'}</span>
                </td>

                {/* Estado */}
                <td className="px-5 py-4">
                  <select
                    value={lead.estado}
                    onChange={e => updateLead(lead.id, { estado: e.target.value as any })}
                    className={`text-[12px] font-medium px-2.5 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D85A30] capitalize ${ESTADO_COLOR[lead.estado] ?? 'bg-gray-100'}`}
                  >
                    {ESTADOS.map(e => <option key={e} value={e} className="bg-white text-[#111]">{e.replace('_', ' ')}</option>)}
                  </select>
                </td>

                {/* Acciones rápidas */}
                <td className="px-5 py-4">
                  <div className="flex gap-1.5">
                    {lead.telefono && (
                      <a href={`https://wa.me/${lead.telefono.replace(/\D/g, '')}`} target="_blank"
                        title="WhatsApp"
                        className="w-7 h-7 bg-[#25D366] rounded flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                        <MessageCircle size={13} />
                      </a>
                    )}
                    {lead.telefono && (
                      <a href={`tel:${lead.telefono}`}
                        title="Llamar"
                        className="w-7 h-7 bg-blue-500 rounded flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                        <Phone size={13} />
                      </a>
                    )}
                    {lead.email && (
                      <a href={`mailto:${lead.email}`}
                        title="Email"
                        className="w-7 h-7 bg-[#555] rounded flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                        <Mail size={13} />
                      </a>
                    )}
                  </div>
                </td>

                {/* Notas */}
                <td className="px-5 py-4 max-w-[200px]">
                  {editingNota === lead.id ? (
                    <div className="flex flex-col gap-1.5">
                      <textarea
                        autoFocus rows={3}
                        value={notaTemp}
                        onChange={e => setNotaTemp(e.target.value)}
                        className="border border-[#D85A30] rounded px-2 py-1.5 text-[12px] resize-none focus:outline-none w-full"
                      />
                      <div className="flex gap-1.5">
                        <button onClick={() => saveNota(lead.id)}
                          className="flex items-center gap-1 bg-[#D85A30] text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                          <Save size={10} /> Guardar
                        </button>
                        <button onClick={() => setEditingNota(null)}
                          className="p-1 text-[#888] hover:text-[#111]">
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => { setEditingNota(lead.id); setNotaTemp(lead.notas ?? '') }}
                      className="group cursor-pointer min-h-[32px] rounded px-2 py-1.5 hover:bg-[#F5F4F2] transition-colors"
                    >
                      {lead.notas ? (
                        <p className="text-[12px] text-[#444] line-clamp-2">{lead.notas}</p>
                      ) : (
                        <div className="flex items-center gap-1 text-[#bbb] group-hover:text-[#888] transition-colors">
                          <StickyNote size={12} />
                          <span className="text-[11px]">Agregar nota</span>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrados.length === 0 && (
          <div className="py-16 text-center text-[#555] text-[14px]">No hay leads con este filtro.</div>
        )}
      </div>
    </div>
  )
}
