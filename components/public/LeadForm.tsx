'use client'
import { useState } from 'react'
import { Send, Loader2, CheckCircle } from 'lucide-react'

interface LeadFormProps {
  propiedadId?: string
  propiedadTitulo?: string
}

export default function LeadForm({ propiedadId, propiedadTitulo }: LeadFormProps) {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', interes: '', mensaje: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, propiedad_id: propiedadId, canal: 'web' })
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <CheckCircle size={48} className="text-green-500" />
        <h3 className="font-display font-bold text-2xl uppercase">¡Consulta enviada!</h3>
        <p className="text-[#555] text-[15px]">Un asesor de G&P se comunica con vos en menos de 24 horas.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
      {propiedadTitulo && (
        <div className="col-span-2 bg-[#F5F4F2] rounded-lg p-3 text-[13px] text-[#555]">
          Consulta sobre: <strong className="text-[#111]">{propiedadTitulo}</strong>
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-[#222]">Nombre *</label>
        <input
          required
          type="text" placeholder="Juan García"
          value={form.nombre}
          onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
          className="border border-[#E2E0DC] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#D85A30] transition-colors"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-[#222]">Teléfono / WhatsApp *</label>
        <input
          required
          type="tel" placeholder="+54 11 1234-5678"
          value={form.telefono}
          onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
          className="border border-[#E2E0DC] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#D85A30] transition-colors"
        />
      </div>
      <div className="col-span-2 flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-[#222]">Email</label>
        <input
          type="email" placeholder="juan@email.com"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="border border-[#E2E0DC] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#D85A30] transition-colors"
        />
      </div>
      {!propiedadId && (
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-[#222]">¿Qué buscás?</label>
          <select
            value={form.interes}
            onChange={e => setForm(f => ({ ...f, interes: e.target.value }))}
            className="border border-[#E2E0DC] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#D85A30] transition-colors bg-white"
          >
            <option value="">Seleccioná una opción</option>
            <option value="comprar">Quiero comprar una propiedad</option>
            <option value="alquilar">Quiero alquilar</option>
            <option value="vender_propiedad">Quiero vender mi propiedad</option>
            <option value="invertir">Quiero invertir en pozo</option>
            <option value="terreno">Tengo / busco un terreno</option>
            <option value="inmobiliaria_conjunta">Soy inmobiliaria y quiero trabajar en conjunto</option>
            <option value="tasar">Quiero tasar mi propiedad</option>
            <option value="info_general">Otra consulta</option>
          </select>
        </div>
      )}
      <div className="col-span-2 flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-[#222]">Mensaje (opcional)</label>
        <textarea
          rows={3}
          placeholder="Contanos más sobre lo que buscás..."
          value={form.mensaje}
          onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
          className="border border-[#E2E0DC] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#D85A30] transition-colors resize-none"
        />
      </div>
      {status === 'error' && (
        <div className="col-span-2 text-red-500 text-[13px]">Hubo un error. Intentá de nuevo o escribinos por WhatsApp.</div>
      )}
      <div className="col-span-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[14px] py-3.5 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {status === 'loading' ? <><Loader2 size={16} className="animate-spin" /> Enviando...</> : <><Send size={16} /> Enviar consulta</>}
        </button>
      </div>
    </form>
  )
}
