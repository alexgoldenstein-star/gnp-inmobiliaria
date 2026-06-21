'use client'
import { useState } from 'react'
import { Loader2, CheckCircle, ArrowRight, TrendingUp, Layers, Building, DollarSign, Plus, X } from 'lucide-react'
import { BARRIOS_CABA } from '@/lib/barrios'

interface Resultado {
  unidad: { codigo: string; nombre: string; alturaMaxima: number; pisos: string; descripcion: string }
  m2CubiertosTotal: number
  m2VendibleEstimado: number
  pisosNumero: number
  valorTerrenoEstimadoUsd: number
  superficieTerreno: number
  cantidadTerrenos?: number
}

interface TerrenoForm {
  direccion: string
  superficie_m2: string
  frente_m: string
}

const TERRENO_VACIO: TerrenoForm = { direccion: '', superficie_m2: '', frente_m: '' }

export default function FactibilidadForm() {
  const [step, setStep] = useState<'form'|'loading'|'resultado'>('form')
  const [multiple, setMultiple] = useState(false)
  const [terrenos, setTerrenos] = useState<TerrenoForm[]>([{ ...TERRENO_VACIO }])
  const [datos, setDatos] = useState({ nombre: '', email: '', telefono: '', barrio: '' })
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [error, setError] = useState('')

  const setDato = (k: string, v: string) => setDatos(p => ({ ...p, [k]: v }))
  const setTerreno = (i: number, k: keyof TerrenoForm, v: string) =>
    setTerrenos(prev => prev.map((t, idx) => idx === i ? { ...t, [k]: v } : t))

  const agregarTerreno = () => setTerrenos(prev => [...prev, { ...TERRENO_VACIO }])
  const quitarTerreno = (i: number) => setTerrenos(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('loading'); setError('')
    await new Promise(r => setTimeout(r, 1800))
    try {
      const res = await fetch('/api/factibilidad', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...datos,
          terrenos: terrenos.map(t => ({
            direccion: t.direccion,
            superficie_m2: Number(t.superficie_m2),
            frente_m: t.frente_m ? Number(t.frente_m) : undefined,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setStep('form'); return }
      setResultado(data.resultado)
      setStep('resultado')
    } catch {
      setError('Error al calcular. Intentá de nuevo.')
      setStep('form')
    }
  }

  if (step === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Loader2 size={64} className="animate-spin text-[#D85A30] mb-6" />
        <h3 className="font-display font-bold text-[20px] uppercase mb-2">Analizando {terrenos.length > 1 ? 'los terrenos' : 'tu terreno'}...</h3>
        <p className="text-[14px] text-[#888]">Consultando unidad de edificabilidad y normativa urbana</p>
      </div>
    )
  }

  if (step === 'resultado' && resultado) {
    const direccionesTexto = terrenos.map(t => t.direccion).join(' + ')
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle size={24} className="text-green-500" />
          </div>
          <div>
            <h3 className="font-display font-black text-[22px] uppercase leading-tight">¡Análisis completo!</h3>
            <p className="text-[13px] text-[#888]">
              {terrenos.length > 1 ? `Resultado para ${terrenos.length} terrenos unificados` : 'Resultado estimado para tu terreno'}
            </p>
          </div>
        </div>

        {terrenos.length > 1 && (
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 mb-4">
            <p className="text-[12px] text-purple-700">
              📐 Superficie unificada: <strong>{resultado.superficieTerreno.toLocaleString()} m²</strong> ({terrenos.length} parcelas)
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-[#F5F4F2] rounded-xl p-4">
            <Building size={16} className="text-[#D85A30] mb-2" />
            <div className="font-display font-black text-[26px] leading-none">{resultado.m2VendibleEstimado.toLocaleString()}</div>
            <div className="text-[11px] text-[#888] mt-1">m² vendibles est.</div>
          </div>
          <div className="bg-[#F5F4F2] rounded-xl p-4">
            <Layers size={16} className="text-[#D85A30] mb-2" />
            <div className="font-display font-black text-[26px] leading-none">{resultado.pisosNumero}</div>
            <div className="text-[11px] text-[#888] mt-1">niveles permitidos</div>
          </div>
          <div className="bg-[#F5F4F2] rounded-xl p-4 col-span-2">
            <DollarSign size={16} className="text-[#D85A30] mb-2" />
            <div className="font-display font-black text-[26px] leading-none text-[#D85A30]">
              USD {resultado.valorTerrenoEstimadoUsd.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#888] mt-1">
              Valor estimado {terrenos.length > 1 ? 'del conjunto' : 'del terreno'} (referencial)
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
          <div className="text-[12px] font-semibold text-blue-700 mb-1">
            📋 {resultado.unidad.nombre} — Altura máx. {resultado.unidad.alturaMaxima}m
          </div>
          <p className="text-[12px] text-blue-600 leading-relaxed mb-1">{resultado.unidad.descripcion}</p>
          <p className="text-[11px] text-blue-500">Morfología: {resultado.unidad.pisos}</p>
        </div>

        <p className="text-[11px] text-[#aaa] leading-relaxed mb-5">
          * Estimación orientativa según el Código Urbanístico de CABA (Ley 6.099, Título 6). No reemplaza un informe de prefactibilidad profesional sobre la parcela específica ni la consulta oficial ante el GCBA. Un asesor de G&P se va a comunicar para confirmar los datos exactos.
        </p>

        <a href={`https://wa.me/5491112345678?text=${encodeURIComponent(`Hola! Pedí un análisis de factibilidad para ${terrenos.length > 1 ? `los terrenos: ${direccionesTexto}` : `mi terreno en ${terrenos[0].direccion}`}, ${datos.barrio}. Quiero coordinar para avanzar.`)}`}
          target="_blank"
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:opacity-90 text-white font-semibold py-3.5 rounded-lg transition-opacity">
          Hablar con un asesor ahora <ArrowRight size={16}/>
        </a>
      </div>
    )
  }

  const f = 'w-full border border-[#E2E0DC] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-[#D85A30] transition-colors bg-white'
  const lbl = 'text-[11px] font-semibold uppercase tracking-wide text-[#222] block mb-1.5'

  return (
    <form onSubmit={handleSubmit}>
      {/* Toggle terreno único / múltiple */}
      <div className="flex gap-2 mb-4 bg-[#F5F4F2] p-1 rounded-lg">
        <button type="button" onClick={() => { setMultiple(false); setTerrenos([terrenos[0]]) }}
          className={`flex-1 py-2 rounded-md text-[12px] font-semibold transition-colors ${!multiple ? 'bg-white shadow-sm text-[#111]' : 'text-[#888]'}`}>
          Un terreno
        </button>
        <button type="button" onClick={() => setMultiple(true)}
          className={`flex-1 py-2 rounded-md text-[12px] font-semibold transition-colors ${multiple ? 'bg-white shadow-sm text-[#111]' : 'text-[#888]'}`}>
          Varios terrenos juntos
        </button>
      </div>

      {multiple && (
        <p className="text-[11px] text-[#888] mb-3 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
          💡 Si tenés terrenos colindantes, cargalos juntos: la unificación de parcelas suele habilitar mejor edificabilidad.
        </p>
      )}

      <div className="space-y-3 mb-3">
        {terrenos.map((t, i) => (
          <div key={i} className="border border-[#E2E0DC] rounded-lg p-3 relative">
            {multiple && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#888]">Terreno {i + 1}</span>
                {terrenos.length > 1 && (
                  <button type="button" onClick={() => quitarTerreno(i)} className="text-[#aaa] hover:text-red-500">
                    <X size={14}/>
                  </button>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <label className={lbl}>Dirección *</label>
                <input required className={f} value={t.direccion} onChange={e => setTerreno(i, 'direccion', e.target.value)} placeholder="Ej: Av. Rivadavia 5500" />
              </div>
              <div>
                <label className={lbl}>Superficie (m²) *</label>
                <input required type="number" min="50" className={f} value={t.superficie_m2} onChange={e => setTerreno(i, 'superficie_m2', e.target.value)} placeholder="300" />
              </div>
              <div>
                <label className={lbl}>Frente (m, opcional)</label>
                <input type="number" step="0.1" className={f} value={t.frente_m} onChange={e => setTerreno(i, 'frente_m', e.target.value)} placeholder="8.66" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {multiple && (
        <button type="button" onClick={agregarTerreno}
          className="w-full mb-4 flex items-center justify-center gap-2 border-2 border-dashed border-[#E2E0DC] hover:border-[#D85A30] text-[#888] hover:text-[#D85A30] text-[13px] font-medium py-2.5 rounded-lg transition-colors">
          <Plus size={14}/> Agregar otro terreno
        </button>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Barrio *</label>
          <select required className={f} value={datos.barrio} onChange={e => setDato('barrio', e.target.value)}>
            <option value="">Seleccionar</option>
            {BARRIOS_CABA.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>Nombre completo *</label>
          <input required className={f} value={datos.nombre} onChange={e => setDato('nombre', e.target.value)} placeholder="Tu nombre" />
        </div>
        <div>
          <label className={lbl}>Teléfono *</label>
          <input required type="tel" className={f} value={datos.telefono} onChange={e => setDato('telefono', e.target.value)} placeholder="+54 11..." />
        </div>
        <div>
          <label className={lbl}>Email</label>
          <input type="email" className={f} value={datos.email} onChange={e => setDato('email', e.target.value)} placeholder="tu@email.com" />
        </div>
      </div>

      {error && <p className="text-red-500 text-[13px] mt-3">{error}</p>}

      <button type="submit"
        className="w-full mt-4 bg-[#D85A30] hover:bg-[#B84A22] text-white font-bold text-[15px] py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
        <TrendingUp size={18}/> Calcular factibilidad gratis
      </button>
      <p className="text-[11px] text-[#aaa] text-center mt-2">Resultado estimado en segundos · Sin costo · Sin compromiso</p>
    </form>
  )
}
