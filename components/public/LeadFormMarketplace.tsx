'use client'
import { useState } from 'react'
import { Send, Loader2, CheckCircle } from 'lucide-react'

export default function LeadFormMarketplace() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', nombre_empresa: '', sitio_web: '', plan_interes: 'starter', mensaje: '' })
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/marketplace/solicitud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch { setStatus('error') }
  }

  if (status === 'success') return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <CheckCircle size={48} className="text-green-500" />
      <h3 className="font-display font-bold text-2xl uppercase">¡Solicitud enviada!</h3>
      <p className="text-[#555] text-[15px]">Un representante de G&P se comunica con vos en menos de 24 horas.</p>
    </div>
  )

  const f = 'border border-[#E2E0DC] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#D85A30] transition-colors w-full'
  const lbl = 'text-[11px] font-semibold uppercase tracking-wide text-[#222] block mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      <div>
        <label className={lbl}>Nombre completo *</label>
        <input required className={f} value={form.nombre} onChange={e => setForm(p=>({...p,nombre:e.target.value}))} placeholder="Juan García" />
      </div>
      <div>
        <label className={lbl}>Teléfono / WhatsApp *</label>
        <input required type="tel" className={f} value={form.telefono} onChange={e => setForm(p=>({...p,telefono:e.target.value}))} placeholder="+54 11..." />
      </div>
      <div className="col-span-2">
        <label className={lbl}>Email *</label>
        <input required type="email" className={f} value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} />
      </div>
      <div>
        <label className={lbl}>Nombre de la inmobiliaria</label>
        <input className={f} value={form.nombre_empresa} onChange={e => setForm(p=>({...p,nombre_empresa:e.target.value}))} placeholder="Inmobiliaria XYZ" />
      </div>
      <div>
        <label className={lbl}>Sitio web (opcional)</label>
        <input className={f} value={form.sitio_web} onChange={e => setForm(p=>({...p,sitio_web:e.target.value}))} placeholder="www...." />
      </div>
      <div className="col-span-2">
        <label className={lbl}>Plan de interés</label>
        <select className={f + ' bg-white'} value={form.plan_interes} onChange={e => setForm(p=>({...p,plan_interes:e.target.value}))}>
          <option value="starter">Starter — USD 49/mes (15 propiedades)</option>
          <option value="pro">Pro — USD 99/mes (ilimitadas + destacados)</option>
          <option value="enterprise">Enterprise — a convenir</option>
        </select>
      </div>
      <div className="col-span-2">
        <label className={lbl}>Mensaje (opcional)</label>
        <textarea rows={3} className={f} value={form.mensaje} onChange={e => setForm(p=>({...p,mensaje:e.target.value}))} placeholder="Contanos sobre tu inmobiliaria..." />
      </div>
      {status === 'error' && <p className="col-span-2 text-red-500 text-[13px]">Hubo un error. Intentá de nuevo.</p>}
      <div className="col-span-2">
        <button type="submit" disabled={status==='loading'}
          className="w-full bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[14px] py-3.5 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
          {status==='loading' ? <><Loader2 size={16} className="animate-spin"/>Enviando...</> : <><Send size={16}/>Enviar solicitud</>}
        </button>
      </div>
    </form>
  )
}
