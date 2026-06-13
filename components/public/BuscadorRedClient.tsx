'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Building2, CheckCircle, ExternalLink } from 'lucide-react'
import { formatPrecio } from '@/lib/propiedades'

interface Inmobiliaria {
  id: string; nombre: string; logo_url?: string; descripcion?: string
  barrios_operacion?: string[]; zona_origen?: string; tipo: string
  plan: string; verificada: boolean; sitio_web?: string; instagram?: string; telefono?: string
}

export default function BuscadorRedClient({ inmobiliarias, propiedades }: { inmobiliarias: Inmobiliaria[]; propiedades: any[] }) {
  const [tab, setTab] = useState<'inmobiliarias'|'propiedades'>('inmobiliarias')
  const [search, setSearch] = useState('')
  const [zona, setZona] = useState('')

  const filteredInmob = inmobiliarias.filter(i =>
    (!search || i.nombre.toLowerCase().includes(search.toLowerCase()) ||
      i.zona_origen?.toLowerCase().includes(search.toLowerCase())) &&
    (!zona || i.tipo === zona || i.zona_origen?.toLowerCase().includes(zona.toLowerCase()))
  )

  const filteredProps = propiedades.filter(p =>
    (!search || p.titulo.toLowerCase().includes(search.toLowerCase()) ||
      p.barrio?.toLowerCase().includes(search.toLowerCase()) ||
      p.inmobiliarias?.nombre?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header */}
      <div className="bg-[#111] text-white px-6 md:px-12 py-14">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-[#D85A30]"/>
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#D85A30]">Red de inmobiliarias</span>
          </div>
          <h1 className="font-display font-black uppercase text-[clamp(40px,5vw,66px)] leading-[0.9] tracking-tight mb-4">
            ENCONTRÁ TU<br />
            <span className="text-[#D85A30]">INMOBILIARIA</span>
          </h1>
          <p className="text-[15px] text-white/60 max-w-xl mb-8 font-light">
            Accedé al portfolio completo de la red G&P — inmobiliarias de CABA, GBA y del interior trabajando juntos.
          </p>

          {/* Buscador */}
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[260px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"/>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nombre, zona o barrio..."
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-11 pr-4 py-3.5 text-[14px] text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors"
              />
            </div>
            <select value={zona} onChange={e => setZona(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-3.5 text-[14px] text-white focus:outline-none focus:border-white/50 transition-colors cursor-pointer">
              <option value="">Todas las zonas</option>
              <option value="socia">CABA / GBA</option>
              <option value="interior">Interior del país</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 py-8 max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([
            ['inmobiliarias', `Inmobiliarias (${filteredInmob.length})`],
            ['propiedades', `Propiedades en red (${filteredProps.length})`],
          ] as const).map(([val, lbl]) => (
            <button key={val} onClick={() => setTab(val)}
              className={`px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors ${tab===val ? 'bg-[#D85A30] text-white' : 'bg-white text-[#555] border border-[#E2E0DC] hover:border-[#D85A30]'}`}>
              {lbl}
            </button>
          ))}
        </div>

        {/* ── INMOBILIARIAS ── */}
        {tab === 'inmobiliarias' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInmob.map(i => (
              <div key={i.id} className="bg-white rounded-xl border border-[#E2E0DC] p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {i.logo_url
                      ? <img src={i.logo_url} alt={i.nombre} className="w-12 h-12 rounded-lg object-cover"/>
                      : <div className="w-12 h-12 bg-[#F5F4F2] rounded-lg flex items-center justify-center"><Building2 size={20} className="text-[#aaa]"/></div>
                    }
                    <div>
                      <div className="font-semibold text-[15px] text-[#111] flex items-center gap-1.5">
                        {i.nombre}
                        {i.verificada && <CheckCircle size={13} className="text-[#D85A30]" fill="currentColor"/>}
                      </div>
                      <div className="text-[11px] text-[#888] capitalize mt-0.5">
                        {i.tipo === 'interior' ? `Interior — ${i.zona_origen}` : 'CABA / GBA'}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${i.plan === 'pro' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                    {i.plan}
                  </span>
                </div>

                {i.descripcion && <p className="text-[13px] text-[#666] leading-relaxed mb-3 line-clamp-2">{i.descripcion}</p>}

                {i.barrios_operacion && i.barrios_operacion.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {i.barrios_operacion.slice(0,4).map(b => (
                      <span key={b} className="text-[10px] bg-[#F5F4F2] text-[#666] px-2 py-0.5 rounded-full">{b}</span>
                    ))}
                    {i.barrios_operacion.length > 4 && (
                      <span className="text-[10px] text-[#aaa]">+{i.barrios_operacion.length - 4} más</span>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-[#F0EFED]">
                  {i.telefono && (
                    <a href={`https://wa.me/${i.telefono.replace(/\D/g,'')}`} target="_blank"
                      className="flex-1 text-center text-[12px] font-medium bg-[#25D366] text-white py-2 rounded-lg hover:opacity-90 transition-opacity">
                      WhatsApp
                    </a>
                  )}
                  {i.sitio_web && (
                    <a href={i.sitio_web} target="_blank"
                      className="flex items-center gap-1 text-[12px] font-medium border border-[#E2E0DC] text-[#555] px-3 py-2 rounded-lg hover:border-[#111] transition-colors">
                      <ExternalLink size={11}/> Web
                    </a>
                  )}
                </div>
              </div>
            ))}
            {filteredInmob.length === 0 && (
              <div className="col-span-3 text-center py-16 text-[#555]">
                <div className="text-4xl mb-3 opacity-20">🔍</div>
                <p className="text-[15px]">No hay inmobiliarias con ese filtro.</p>
              </div>
            )}
          </div>
        )}

        {/* ── PROPIEDADES RED ── */}
        {tab === 'propiedades' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProps.map((p: any) => (
              <Link key={p.id} href={`/propiedades/${p.slug}`}
                className="bg-white rounded-xl border border-[#E2E0DC] overflow-hidden hover:shadow-md transition-shadow no-underline group">
                <div className="h-44 bg-[#F5F4F2] relative overflow-hidden">
                  {p.foto_principal
                    ? <img src={p.foto_principal} alt={p.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    : <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🏢</div>
                  }
                  <div className="absolute top-2 left-2 bg-[#111] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">{p.operacion}</div>
                  {p.inmobiliarias && (
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-medium px-2 py-1 rounded-lg text-[#333] flex items-center gap-1">
                      {p.inmobiliarias.logo_url && <img src={p.inmobiliarias.logo_url} alt="" className="w-4 h-4 rounded object-cover"/>}
                      {p.inmobiliarias.nombre}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="font-display font-black text-[18px] text-[#111] leading-tight mb-1 truncate">{p.titulo}</div>
                  <div className="text-[12px] text-[#888] mb-2 flex items-center gap-1"><MapPin size={11}/>{p.barrio}</div>
                  <div className="font-display font-black text-[20px] text-[#D85A30]">{formatPrecio(p.precio, p.moneda)}</div>
                  <div className="text-[11px] text-[#888] mt-1">
                    {p.ambientes && `${p.ambientes} amb.`} {p.superficie_cubierta && `· ${p.superficie_cubierta} m²`}
                  </div>
                </div>
              </Link>
            ))}
            {filteredProps.length === 0 && (
              <div className="col-span-3 text-center py-16 text-[#555]">
                <div className="text-4xl mb-3 opacity-20">🏠</div>
                <p className="text-[15px]">No hay propiedades de la red con ese filtro.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
