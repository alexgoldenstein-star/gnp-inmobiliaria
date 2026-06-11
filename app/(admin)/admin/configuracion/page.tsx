'use client'
import { useState } from 'react'
import { Save, Loader2, CheckCircle } from 'lucide-react'

export default function ConfiguracionPage() {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState({
    whatsapp: '5491112345678',
    email_contacto: 'info@gnpinmobiliaria.com.ar',
    instagram: '@gpnegociosinmobiliarios',
    linkedin: '',
    facebook: '',
    direccion: 'Buenos Aires, CABA, Argentina',
    matricula: '',
    mensaje_whatsapp_default: 'Hola! Me contacto desde el sitio web de G&P Negocios Inmobiliarios.',
    admin_password_nuevo: '',
  })

  const set = (k: string, v: string) => setConfig(f => ({ ...f, [k]: v }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const f = 'border border-[#E2E0DC] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#D85A30] transition-colors bg-white w-full'
  const lbl = 'text-[11px] font-semibold uppercase tracking-wide text-[#222] block mb-1.5'
  const section = 'bg-white rounded-xl border border-[#E2E0DC] p-6 mb-6'

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-black text-[32px] uppercase tracking-tight">Configuración</h1>
        <p className="text-[14px] text-[#555] mt-1">Ajustes globales del sitio y del panel admin.</p>
      </div>

      <form onSubmit={handleSave}>
        {/* Contacto */}
        <div className={section}>
          <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Datos de contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>WhatsApp (número principal)</label>
              <input className={f} value={config.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="5491112345678" />
              <p className="text-[11px] text-[#888] mt-1">Sin + ni espacios. Se usa en todos los botones del sitio.</p>
            </div>
            <div>
              <label className={lbl}>Email de contacto</label>
              <input type="email" className={f} value={config.email_contacto} onChange={e => set('email_contacto', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className={lbl}>Mensaje predeterminado de WhatsApp</label>
              <input className={f} value={config.mensaje_whatsapp_default} onChange={e => set('mensaje_whatsapp_default', e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Dirección física</label>
              <input className={f} value={config.direccion} onChange={e => set('direccion', e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Matrícula CUCICBA</label>
              <input className={f} value={config.matricula} onChange={e => set('matricula', e.target.value)} placeholder="Nº matrícula" />
            </div>
          </div>
        </div>

        {/* Redes sociales */}
        <div className={section}>
          <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Redes sociales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['instagram', 'Instagram (usuario o URL)', '@gpnegociosinmobiliarios'],
              ['linkedin', 'LinkedIn (URL)', 'https://linkedin.com/company/...'],
              ['facebook', 'Facebook (URL)', 'https://facebook.com/...'],
            ].map(([key, label, placeholder]) => (
              <div key={key}>
                <label className={lbl}>{label}</label>
                <input className={f} value={(config as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
              </div>
            ))}
          </div>
        </div>

        {/* Seguridad */}
        <div className={section}>
          <h2 className="font-display font-bold text-[18px] uppercase mb-5 pb-3 border-b border-[#E2E0DC]">Seguridad</h2>
          <div className="max-w-sm">
            <label className={lbl}>Nueva contraseña de admin</label>
            <input type="password" className={f} value={config.admin_password_nuevo} onChange={e => set('admin_password_nuevo', e.target.value)} placeholder="Dejar en blanco para no cambiar" />
            <p className="text-[11px] text-[#888] mt-1">Si cambiás la contraseña, también actualizala en Vercel → Environment Variables → ADMIN_PASSWORD.</p>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="flex items-center gap-2 bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[15px] px-8 py-3.5 rounded-md transition-colors disabled:opacity-60">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Guardando...</>
           : saved ? <><CheckCircle size={16} /> Guardado!</>
           : <><Save size={16} /> Guardar cambios</>}
        </button>
      </form>
    </div>
  )
}
