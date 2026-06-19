'use client'
import { useState } from 'react'
import { Loader2, CheckCircle, ArrowRight, TrendingUp, Ruler, Building, DollarSign } from 'lucide-react'
import { ZONAS_AGRUPADAS, BARRIOS_CABA } from '@/lib/barrios'

interface Resultado {
  zona: { nombre: string; fot: number; alturaMaxima: number; descripcion: string }
  m2Construibles: number
  alturaEstimadaPisos: number
  valorTerrenoEstimadoUsd: number
}

export default function FactibilidadForm() {
  const [step, setStep] = useState<'form'|'loading'|'resultado'>('form')
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '', barrio: '', superficie_m2: '', frente_m: '' })
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('loading'); setError('')
    // Simular el "análisis" con un pequeño delay para que se sienta real
    await new Promise(r => setTimeout(r, 1800))
    try {
      const res = await fetch('/api/factibilidad', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
        <div className="relative w-16 h-16 mb-6">
          <Loader2 size={64} className="animate-spin text-[#D85A30]" />
        </div>
        <h3 className="font-display font-bold text-[20px] uppercase mb-2">Analizando tu terreno...</h3>
        <p className="text-[14px] text-[#888]">Consultando zonificación y normativa urbana</p>
      </div>
    )
  }

  if (step === 'resultado' && resultado) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle size={24} className="text-green-500" />
          </div>
          <div>
            <h3 className="font-display font-black text-[22px] uppercase leading-tight">¡Análisis completo!</h3>
            <p className="text-[13px] text-[#888]">Resultado estimado para tu terreno</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-[#F5F4F2] rounded-xl p-4">
            <Building size={16} className="text-[#D85A30] mb-2" />
            <div className="font-display font-black text-[26px] leading-none">{resultado.m2Construibles.toLocaleString()}</div>
            <div className="text-[11px] text-[#888] mt-1">m² construibles est.</div>
          </div>
          <div className="bg-[#F5F4F2] rounded-xl p-4">
            <Ruler size={16} className="text-[#D85A30] mb-2" />
            <div className="font-display font-black text-[26px] leading-none">{resultado.alturaEstimadaPisos}</div>
            <div className="text-[11px] text-[#888] mt-1">pisos aprox. permitidos</div>
          </div>
          <div className="bg-[#F5F4F2] rounded-xl p-4 col-span-2">
            <DollarSign size={16} className="text-[#D85A30] mb-2" />
            <div className="font-display font-black text-[26px] leading-none text-[#D85A30]">
              USD {resultado.valorTerrenoEstimadoUsd.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#888] mt-1">Valor estimado del terreno (referencial)</div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
          <div className="text-[12px] font-semibold text-blue-700 mb-1">📋 Zonificación: {resultado.zona.nombre}</div>
          <p className="text-[12px] text-blue-600 leading-relaxed">{resultado.zona.descripcion}</p>
        </div>

        <p className="text-[11px] text-[#aaa] leading-relaxed mb-5">
          * Este es un análisis estimado basado en zonificación de referencia del Código Urbanístico de CABA. No reemplaza un informe de factibilidad profesional ni la consulta oficial ante el GCBA. Un asesor de G&P se va a comunicar para validar los datos exactos de tu parcela.
        </p>

        <a href={`https://wa.me/5491112345678?text=${encodeURIComponent(`Hola! Pedí un análisis de factibilidad para mi terreno en ${form.direccion}, ${form.barrio}. Quiero coordinar para avanzar.`)}`}
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
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <label className={lbl}>Dirección del terreno *</label>
        <input required className={f} value={form.direccion} onChange={e => set('direccion', e.target.value)} placeholder="Ej: Av. Rivadavia 5500" />
      </div>
      <div>
        <label className={lbl}>Barrio *</label>
        <select required className={f} value={form.barrio} onChange={e => set('barrio', e.target.value)}>
          <option value="">Seleccionar</option>
          {BARRIOS_CABA.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div>
        <label className={lbl}>Superficie (m²) *</label>
        <input required type="number" min="50" className={f} value={form.superficie_m2} onChange={e => set('superficie_m2', e.target.value)} placeholder="300" />
      </div>
      <div className="col-span-2">
        <label className={lbl}>Frente (metros, opcional)</label>
        <input type="number" step="0.1" className={f} value={form.frente_m} onChange={e => set('frente_m', e.target.value)} placeholder="8.66" />
      </div>
      <div>
        <label className={lbl}>Nombre completo *</label>
        <input required className={f} value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Tu nombre" />
      </div>
      <div>
        <label className={lbl}>Teléfono *</label>
        <input required type="tel" className={f} value={form.telefono} onChange={e => set('telefono', e.target.value)} placeholder="+54 11..." />
      </div>
      <div className="col-span-2">
        <label className={lbl}>Email</label>
        <input type="email" className={f} value={form.email} onChange={e => set('email', e.target.value)} placeholder="tu@email.com" />
      </div>
      {error && <p className="col-span-2 text-red-500 text-[13px]">{error}</p>}
      <div className="col-span-2">
        <button type="submit"
          className="w-full bg-[#D85A30] hover:bg-[#B84A22] text-white font-bold text-[15px] py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
          <TrendingUp size={18}/> Calcular factibilidad gratis
        </button>
        <p className="text-[11px] text-[#aaa] text-center mt-2">Resultado estimado en segundos · Sin costo · Sin compromiso</p>
      </div>
    </form>
  )
}
