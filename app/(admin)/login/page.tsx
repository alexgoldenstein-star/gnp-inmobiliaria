'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Error de conexión. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 bg-[#D85A30] rounded-lg flex items-center justify-center font-display font-black text-lg text-white tracking-tight">
            G&P
          </div>
          <div>
            <div className="font-display font-bold text-xl uppercase tracking-wide text-white leading-none">Negocios</div>
            <div className="font-display font-bold text-xl uppercase tracking-wide text-white/60 leading-none">Inmobiliarios</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl">
          <h1 className="font-display font-black text-[26px] uppercase tracking-tight text-center mb-1">Ingresar</h1>
          <p className="text-[13px] text-[#888] text-center mb-7">Acceso al panel de administración</p>

          {/* Email */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#222]">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa]" />
              <input
                type="email" required autoFocus
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="tu@email.com"
                className="w-full border border-[#E2E0DC] rounded-lg pl-10 pr-4 py-3 text-[14px] focus:outline-none focus:border-[#D85A30] transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5 mb-6">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#222]">Contraseña</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa]" />
              <input
                type={showPass ? 'text' : 'password'} required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full border border-[#E2E0DC] rounded-lg pl-10 pr-10 py-3 text-[14px] focus:outline-none focus:border-[#D85A30] transition-colors"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#555]">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[15px] py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Ingresando...</> : 'Ingresar al panel'}
          </button>
        </form>

        <p className="text-center text-[12px] text-white/30 mt-6">
          G&P Negocios Inmobiliarios · Panel interno
        </p>
      </div>
    </div>
  )
}
