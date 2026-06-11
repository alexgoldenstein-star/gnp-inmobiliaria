'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
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
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error)
        return
      }
      router.push('/admin')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#D85A30] rounded-lg flex items-center justify-center font-display font-black text-lg text-white">G&P</div>
          <span className="font-display font-bold text-xl uppercase tracking-wide text-white">Panel Admin</span>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-2xl">
          <div className="flex items-center justify-center w-12 h-12 bg-[#F5F4F2] rounded-full mx-auto mb-6">
            <Lock size={20} className="text-[#D85A30]" />
          </div>
          <h1 className="font-display font-bold text-2xl uppercase text-center mb-1">Acceso admin</h1>
          <p className="text-[13px] text-[#555] text-center mb-6">Ingresá la contraseña para continuar</p>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#222]">Contraseña</label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border border-[#E2E0DC] rounded-md px-4 py-3 text-[15px] focus:outline-none focus:border-[#D85A30] transition-colors"
            />
          </div>

          {error && <p className="text-red-500 text-[13px] mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[15px] py-3 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Ingresando...</> : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
