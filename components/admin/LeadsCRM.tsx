'use client'
import { useState } from 'react'
import { Phone, MessageCircle, Mail, Save, X, StickyNote, Building2, User, Search } from 'lucide-react'

const ESTADOS = ['nuevo','visto','contactado','calificado','visita_agendada','propuesta_enviada','negociando','ganado','perdido']
const ESTADO_COLOR: Record<string,string> = {
  nuevo: 'bg-blue-100 text-blue-700',
  visto: 'bg-gray-100 text-gray-600',
  contactado: 'bg-yellow-100 text-yellow-700',
  calificado: 'bg-purple-100 text-purple-700',
  visita_agendada: 'bg-orange-100 text-orange-700',
  propuesta_enviada: 'bg-indigo-100 text-indigo-700',
  negociando: 'bg-pink-100 text-pink-700',
  ganado: 'bg-green-100 text-green-700',
  perdido: 'bg-red-100 text-red-500',
}
const CANAL_ICON: Record<string,string> = {
  web: '🌐', whatsapp: '💬', meta_ads: '📘', google_ads: '🔍', referido: '🤝', otro: '📋'
}
const INTERES_LABEL: Record<string,string> = {
  comprar: 'Comprar', alquilar: 'Alquilar', invertir: 'Invertir',
  tasar: 'Vender/Tasar', info_general: 'Info general',
  terreno: 'Busca terreno', inmobiliaria_conjunta: 'Trabajar en conjunto',
  vender_propiedad: 'Quiere vender',
}

interface Lead {
  id: string; nombre: string; email?: string; telefono?: string
  mensaje?: string; canal: string; estado: string; interes?: string
  notas?: string; creado_en: string
  propiedades?: { titulo: string; slug: string; operacion: string } | null
}

// Clasificación automática: empresa vs cliente
function esEmpresa(lead: Lead) {
  return ['referido','meta_ads','google_ads'].includes(lead.canal) ||
    ['terreno','inmobiliaria_conjunta'].includes(lead.interes ?? '') ||
    lead.canal === 'referido'
}

export default function LeadsCRM({ leads: initialLeads }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads)
  const [tab, setTab] = useState<'clientes'|'empresas'|'todos'>('todos')
  const [filterEstado, setFilterEstado] = useState('todos')
  const [search, setSearch] = useState('')
  const [editingNota, setEditingNota] = useState<string|null>(null)
  const [notaTemp, setNotaTemp] = useState('')

  const updateLead = async (id: string, data: Partial<Lead>) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) setLeads(prev => prev.map(l => l.id === id ? { ...l, ...data } : l))
  }

  const saveNota = async (id: string) => {
    await updateLead(id, { notas: notaTemp })
    setEditingNota(null)
  }

  const empresas = leads.filter(l => esEmpresa(l))
  const clientes = leads.filter(l => !esEmpresa(l))

  let filtered = tab === 'empresas' ? empresas : tab === 'clientes' ? clientes : leads
  if (filterEstado !== 'todos') filtered = filtered.filter(l => l.estado === filterEstado)
  if (search) filtered = filtered.filter(l =>
    l.nombre.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase()) ||
    l.telefono?.includes(search)
  )

  const counts = {
    todos: leads.length,
    clientes: clientes.length,
    empresas: empresas.length,
    nuevos: leads.filter(l => l.estado === 'nuevo').length,
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-black text-[32px] uppercase tracking-tight">CRM</h1>
        <p className="text-[14px] text-[#555] mt-1">Gestión de consultas y seguimiento comercial</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total leads', value: counts.todos, color: 'text-[#111]', bg: 'bg-white' },
          { label: 'Clientes', value: counts.clientes, color: 'text-[#D85A30]', bg: 'bg-orange-50' },
          { label: 'Empresas / Red', value: counts.empresas, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Sin atender', value: counts.nuevos, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4 border border-[#E2E0DC]`}>
            <div className={`font-display font-black text-[34px] leading-none ${color}`}>{value}</div>
            <div className="text-[12px] font-medium text-[#555] mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs principales */}
      <div className="flex gap-2 mb-4">
        {([
          ['todos', `Todos (${counts.todos})`, '📋'],
          ['clientes', `Clientes (${counts.clientes})`, '👤'],
          ['empresas', `Empresas / Red (${counts.empresas})`, '🏢'],
        ] as const).map(([val, lbl, icon]) => (
          <button key={val} onClick={() => setTab(val as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-colors border
              ${tab === val ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-[#555] border-[#E2E0DC] hover:border-[#111]'}`}>
            <span>{icon}</span> {lbl}
          </button>
        ))}
      </div>

      {/* Filtros secundarios */}
      <div className="flex flex-wrap gap-2 items-center mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o teléfono..."
            className="border border-[#E2E0DC] rounded-lg pl-8 pr-4 py-2 text-[13px] focus:outline-none focus:border-[#D85A30] w-64"
          />
        </div>
        <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)}
          className="border border-[#E2E0DC] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#D85A30] bg-white capitalize">
          <option value="todos">Todos los estados</option>
          {ESTADOS.map(e => <option key={e} value={e}>{e.replace('_',' ')}</option>)}
        </select>
        {(search || filterEstado !== 'todos') && (
          <button onClick={() => { setSearch(''); setFilterEstado('todos') }}
            className="text-[12px] text-[#D85A30] hover:underline flex items-center gap-1">
            <X size={12} /> Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[#E2E0DC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F4F2] border-b border-[#E2E0DC]">
              <tr>
                {['Contacto', 'Tipo', 'Interés', 'Propiedad', 'Estado', 'Acciones', 'Notas'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#555] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0DC]">
              {filtered.map(lead => (
                <tr key={lead.id} className="hover:bg-[#FAFAFA] transition-colors align-top">
                  <td className="px-4 py-4">
                    <div className="font-medium text-[14px]">{lead.nombre}</div>
                    <div className="text-[12px] text-[#888]">{lead.telefono}</div>
                    {lead.email && <div className="text-[11px] text-[#aaa]">{lead.email}</div>}
                    <div className="text-[10px] text-[#bbb] mt-1">
                      {new Date(lead.creado_en).toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'2-digit' })}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {esEmpresa(lead)
                      ? <span className="flex items-center gap-1 text-[12px] font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full w-fit"><Building2 size={11}/> Empresa</span>
                      : <span className="flex items-center gap-1 text-[12px] font-medium text-[#D85A30] bg-orange-50 px-2 py-1 rounded-full w-fit"><User size={11}/> Cliente</span>
                    }
                    <div className="text-[11px] text-[#aaa] mt-1">{CANAL_ICON[lead.canal] ?? '📋'} {lead.canal?.replace('_',' ')}</div>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-[#555] whitespace-nowrap">
                    {INTERES_LABEL[lead.interes ?? ''] ?? lead.interes ?? '—'}
                  </td>
                  <td className="px-4 py-4 text-[12px] text-[#555] max-w-[160px]">
                    {lead.propiedades
                      ? <a href={`/propiedades/${lead.propiedades.slug}`} target="_blank" className="text-[#D85A30] hover:underline line-clamp-2">{lead.propiedades.titulo}</a>
                      : <span className="text-[#ccc]">—</span>
                    }
                  </td>
                  <td className="px-4 py-4">
                    <select value={lead.estado} onChange={e => updateLead(lead.id, { estado: e.target.value as any })}
                      className={`text-[11px] font-medium px-2.5 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none capitalize ${ESTADO_COLOR[lead.estado] ?? 'bg-gray-100'}`}>
                      {ESTADOS.map(e => <option key={e} value={e} className="bg-white text-[#111] capitalize">{e.replace('_',' ')}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1.5">
                      {lead.telefono && (
                        <a href={`https://wa.me/${lead.telefono.replace(/\D/g,'')}`} target="_blank"
                          className="w-7 h-7 bg-[#25D366] rounded flex items-center justify-center text-white hover:opacity-80">
                          <MessageCircle size={13}/>
                        </a>
                      )}
                      {lead.telefono && (
                        <a href={`tel:${lead.telefono}`}
                          className="w-7 h-7 bg-blue-500 rounded flex items-center justify-center text-white hover:opacity-80">
                          <Phone size={13}/>
                        </a>
                      )}
                      {lead.email && (
                        <a href={`mailto:${lead.email}`}
                          className="w-7 h-7 bg-[#555] rounded flex items-center justify-center text-white hover:opacity-80">
                          <Mail size={13}/>
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 max-w-[200px]">
                    {editingNota === lead.id ? (
                      <div className="flex flex-col gap-1.5">
                        <textarea autoFocus rows={3} value={notaTemp} onChange={e => setNotaTemp(e.target.value)}
                          className="border border-[#D85A30] rounded px-2 py-1.5 text-[12px] resize-none focus:outline-none w-full" />
                        <div className="flex gap-1.5">
                          <button onClick={() => saveNota(lead.id)} className="flex items-center gap-1 bg-[#D85A30] text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                            <Save size={10}/> Guardar
                          </button>
                          <button onClick={() => setEditingNota(null)} className="p-1 text-[#888]"><X size={13}/></button>
                        </div>
                      </div>
                    ) : (
                      <div onClick={() => { setEditingNota(lead.id); setNotaTemp(lead.notas ?? '') }}
                        className="cursor-pointer min-h-[32px] rounded px-2 py-1.5 hover:bg-[#F5F4F2] group">
                        {lead.notas
                          ? <p className="text-[12px] text-[#444] line-clamp-2">{lead.notas}</p>
                          : <div className="flex items-center gap-1 text-[#ccc] group-hover:text-[#888]"><StickyNote size={12}/><span className="text-[11px]">Nota</span></div>
                        }
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-[#555] text-[14px]">No hay leads con este filtro.</div>
          )}
        </div>
      </div>
    </div>
  )
}
