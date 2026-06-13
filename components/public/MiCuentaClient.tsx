'use client'
import { useState } from 'react'
import Link from 'next/link'
import { LogOut, MessageCircle, Phone, MapPin, ArrowRight, Clock, CheckCircle, Search } from 'lucide-react'
import { formatPrecio } from '@/lib/propiedades'
import type { SessionUser } from '@/lib/auth'

const ESTADO_COLOR: Record<string,string> = {
  nuevo: 'bg-blue-100 text-blue-700',
  visto: 'bg-gray-100 text-gray-500',
  contactado: 'bg-yellow-100 text-yellow-700',
  calificado: 'bg-purple-100 text-purple-700',
  visita_agendada: 'bg-orange-100 text-orange-700',
  ganado: 'bg-green-100 text-green-700',
  perdido: 'bg-red-100 text-red-500',
}
const ESTADO_LABEL: Record<string,string> = {
  nuevo: 'Recibida', visto: 'Vista', contactado: 'En contacto',
  calificado: 'Calificado', visita_agendada: 'Visita agendada',
  ganado: 'Cerrado ✓', perdido: 'No avanzó',
}

interface Lead {
  id: string; estado: string; mensaje?: string; interes?: string
  creado_en: string; canal: string
  propiedades?: { titulo: string; slug: string; foto_principal?: string; barrio?: string; precio?: number; moneda: string; operacion: string } | null
}

export default function MiCuentaClient({
  session, leads, sugeridas
}: {
  session: SessionUser
  leads: Lead[]
  sugeridas: any[]
}) {
  const [tab, setTab] = useState<'consultas'|'sugeridas'>('consultas')

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  const activas = leads.filter(l => !['ganado','perdido'].includes(l.estado))
  const cerradas = leads.filter(l => ['ganado','perdido'].includes(l.estado))

  return (
    <div className="min-h-screen bg-[#F5F4F2]">
      {/* Header */}
      <div className="bg-[#111] text-white px-6 md:px-12 py-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#D85A30] rounded-full flex items-center justify-center font-display font-black text-2xl text-white">
              {session.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30] mb-1">Mi cuenta</div>
              <h1 className="font-display font-black text-[28px] uppercase tracking-tight leading-none">{session.nombre}</h1>
              <div className="text-[13px] text-white/50 mt-1">{session.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://wa.me/5491112345678?text=Hola! Soy cliente del portal G%26P y quiero hacer una consulta."
              target="_blank"
              className="flex items-center gap-2 bg-[#25D366] text-white text-[13px] font-semibold px-4 py-2.5 rounded-md hover:opacity-90 transition-opacity">
              <MessageCircle size={14}/> WhatsApp
            </a>
            <button onClick={logout}
              className="flex items-center gap-2 border border-white/20 text-white/60 hover:text-white text-[13px] px-4 py-2.5 rounded-md transition-colors">
              <LogOut size={14}/> Salir
            </button>
          </div>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="bg-white border-b border-[#E2E0DC] px-6 md:px-12 py-5">
        <div className="max-w-5xl mx-auto flex gap-8">
          {[
            { label: 'Consultas activas', value: activas.length, color: 'text-[#D85A30]' },
            { label: 'Cerradas', value: cerradas.length, color: 'text-green-600' },
            { label: 'Total', value: leads.length, color: 'text-[#111]' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className={`font-display font-black text-[30px] leading-none ${color}`}>{value}</div>
              <div className="text-[12px] text-[#888] mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([['consultas','Mis consultas'],['sugeridas','Propiedades sugeridas']] as const).map(([val,lbl]) => (
            <button key={val} onClick={() => setTab(val)}
              className={`px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors ${tab===val ? 'bg-[#D85A30] text-white' : 'bg-white text-[#555] border border-[#E2E0DC] hover:border-[#D85A30]'}`}>
              {lbl}
            </button>
          ))}
        </div>

        {/* ── CONSULTAS ── */}
        {tab === 'consultas' && (
          <div className="space-y-4">
            {leads.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E2E0DC] p-12 text-center">
                <div className="text-5xl mb-4 opacity-20">📋</div>
                <h3 className="font-display font-bold text-[20px] uppercase mb-2">Sin consultas todavía</h3>
                <p className="text-[14px] text-[#555] mb-6">Cuando consultes por una propiedad, aparecerá acá con su seguimiento.</p>
                <Link href="/propiedades" className="inline-flex items-center gap-2 bg-[#D85A30] text-white font-semibold text-[14px] px-6 py-3 rounded-md hover:bg-[#B84A22] transition-colors">
                  Ver propiedades <ArrowRight size={15}/>
                </Link>
              </div>
            ) : leads.map(lead => (
              <div key={lead.id} className="bg-white rounded-xl border border-[#E2E0DC] overflow-hidden hover:shadow-sm transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  {/* Foto propiedad */}
                  {lead.propiedades && (
                    <div className="md:col-span-1">
                      <Link href={`/propiedades/${lead.propiedades.slug}`}>
                        <div className="h-40 md:h-full bg-[#F5F4F2] relative overflow-hidden">
                          {lead.propiedades.foto_principal
                            ? <img src={lead.propiedades.foto_principal} alt={lead.propiedades.titulo} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
                            : <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🏢</div>
                          }
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Info */}
                  <div className={`p-5 ${lead.propiedades ? 'md:col-span-2' : 'md:col-span-3'} flex flex-col justify-between`}>
                    <div>
                      {lead.propiedades ? (
                        <>
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-[#888] mb-1 capitalize">{lead.propiedades.operacion}</div>
                          <Link href={`/propiedades/${lead.propiedades.slug}`}
                            className="font-display font-bold text-[18px] uppercase text-[#111] hover:text-[#D85A30] transition-colors block mb-1 leading-tight">
                            {lead.propiedades.titulo}
                          </Link>
                          {lead.propiedades.barrio && (
                            <div className="flex items-center gap-1 text-[13px] text-[#888] mb-2">
                              <MapPin size={12}/> {lead.propiedades.barrio}
                            </div>
                          )}
                          {lead.propiedades.precio && (
                            <div className="font-display font-black text-[22px] text-[#D85A30] mb-3">
                              {formatPrecio(lead.propiedades.precio, lead.propiedades.moneda)}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="font-semibold text-[16px] mb-2">Consulta general</div>
                      )}
                      {lead.mensaje && (
                        <p className="text-[13px] text-[#666] bg-[#F5F4F2] rounded-lg px-3 py-2 italic mb-3">
                          "{lead.mensaje}"
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#F0EFED]">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${ESTADO_COLOR[lead.estado] ?? 'bg-gray-100 text-gray-500'}`}>
                          {ESTADO_LABEL[lead.estado] ?? lead.estado}
                        </span>
                        <span className="text-[11px] text-[#aaa] flex items-center gap-1">
                          <Clock size={10}/>
                          {new Date(lead.creado_en).toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'2-digit' })}
                        </span>
                      </div>
                      <a href="https://wa.me/5491112345678" target="_blank"
                        className="flex items-center gap-1.5 text-[12px] font-medium text-[#25D366] hover:underline">
                        <MessageCircle size={13}/> Consultar estado
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SUGERIDAS ── */}
        {tab === 'sugeridas' && (
          <div>
            <p className="text-[14px] text-[#555] mb-5">Propiedades destacadas que podrían interesarte.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {sugeridas.map((p: any) => (
                <Link key={p.id} href={`/propiedades/${p.slug}`}
                  className="bg-white rounded-xl border border-[#E2E0DC] overflow-hidden hover:shadow-md transition-shadow no-underline group">
                  <div className="h-44 bg-[#F5F4F2] relative overflow-hidden">
                    {p.foto_principal
                      ? <img src={p.foto_principal} alt={p.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                      : <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🏢</div>
                    }
                    <div className="absolute top-2 left-2 bg-[#D85A30] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">{p.operacion}</div>
                  </div>
                  <div className="p-4">
                    <div className="font-display font-black text-[18px] text-[#111] mb-1 truncate">{p.titulo}</div>
                    <div className="text-[12px] text-[#888] mb-2 flex items-center gap-1"><MapPin size={11}/>{p.barrio}</div>
                    <div className="font-display font-black text-[20px] text-[#D85A30]">{formatPrecio(p.precio, p.moneda)}</div>
                    <div className="text-[11px] text-[#888] mt-1">{p.ambientes && `${p.ambientes} amb.`} {p.superficie_cubierta && `· ${p.superficie_cubierta} m²`}</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/propiedades" className="inline-flex items-center gap-2 border border-[#E2E0DC] hover:border-[#111] text-[14px] font-medium px-6 py-3 rounded-md transition-colors">
                Ver todas las propiedades <ArrowRight size={14}/>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
