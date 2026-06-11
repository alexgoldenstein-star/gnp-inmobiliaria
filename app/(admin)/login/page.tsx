'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, Lock, Eye, EyeOff, User, Building2, Home, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const ROLES_INFO = {
  admin:    { icon: Home,      label: 'Equipo G&P',          color: 'text-blue-600',   bg: 'bg-blue-50',    desc: 'Panel de administración completo' },
  empleado: { icon: Home,      label: 'Equipo G&P',          color: 'text-blue-600',   bg: 'bg-blue-50',    desc: 'Panel de administración' },
  vendedor: { icon: Building2, label: 'Inmobiliaria socia',  color: 'text-purple-600', bg: 'bg-purple-50',  desc: 'Panel de publicaciones' },
  cliente:  { icon: User,      label: 'Cliente / Inversor',  color: 'text-[#D85A30]',  bg: 'bg-orange-50',  desc: 'Mis consultas y favoritos' },
}

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login'|'register'>('login')
  const [form, setForm] = useState({ email: '', password: '', nombre: '', telefono: '', tipo: 'cliente', empresa: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [detectedRole, setDetectedRole] = useState<string | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [registered, setRegistered] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setDetectedRole(data.rol)
      await new Promise(r => setTimeout(r, 1200))
      if (data.rol === 'cliente') router.push('/mi-cuenta')
      else router.push('/admin')
      router.refresh()
    } catch { setError('Error de conexión. Intentá de nuevo.') }
    finally { setLoading(false) }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptTerms) { setError('Debés aceptar los términos y condiciones para continuar.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setRegistered(true)
    } catch { setError('Error al registrarse. Intentá de nuevo.') }
    finally { setLoading(false) }
  }

  const f = 'w-full border border-[#E2E0DC] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-[#D85A30] transition-colors'
  const lbl = 'text-[11px] font-semibold uppercase tracking-wide text-[#222] block mb-1.5'

  if (detectedRole) {
    const info = ROLES_INFO[detectedRole as keyof typeof ROLES_INFO]
    const Icon = info?.icon ?? User
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 text-center w-full max-w-sm shadow-2xl">
          <div className={`w-16 h-16 ${info?.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="font-display font-black text-[22px] uppercase mb-1">¡Bienvenido!</h2>
          <div className={`inline-flex items-center gap-2 ${info?.bg} px-3 py-1.5 rounded-full mb-4`}>
            <Icon size={13} className={info?.color} />
            <span className={`text-[12px] font-semibold ${info?.color}`}>{info?.label}</span>
          </div>
          <p className="text-[13px] text-[#888] mb-2">{info?.desc}</p>
          <p className="text-[12px] text-[#aaa]">Redirigiendo...</p>
          <div className="mt-4 w-full bg-[#F5F4F2] rounded-full h-1">
            <div className="bg-[#D85A30] h-1 rounded-full animate-[width_1.2s_ease-in-out]" style={{ width: '100%', transition: 'width 1.2s' }} />
          </div>
        </div>
      </div>
    )
  }

  if (registered) return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-10 text-center w-full max-w-sm shadow-2xl">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h2 className="font-display font-black text-[22px] uppercase mb-2">¡Registro exitoso!</h2>
        <p className="text-[14px] text-[#555] mb-6">Tu cuenta fue creada. Ya podés ingresar con tu email y contraseña.</p>
        <button onClick={() => { setRegistered(false); setTab('login') }}
          className="w-full bg-[#D85A30] text-white font-semibold py-3 rounded-lg hover:bg-[#B84A22] transition-colors">
          Ingresar ahora
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 bg-[#D85A30] rounded-lg flex items-center justify-center font-display font-black text-lg text-white">G&P</div>
          <div>
            <div className="font-display font-bold text-xl uppercase tracking-wide text-white leading-none">Negocios</div>
            <div className="font-display font-bold text-xl uppercase tracking-wide text-white/50 leading-none">Inmobiliarios</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#E2E0DC]">
            {[['login','Ingresar'],['register','Registrarse']].map(([val,lbl]) => (
              <button key={val} onClick={() => { setTab(val as any); setError('') }}
                className={`flex-1 py-4 text-[14px] font-semibold transition-colors ${tab===val ? 'text-[#D85A30] border-b-2 border-[#D85A30]' : 'text-[#888] hover:text-[#555]'}`}>
                {lbl}
              </button>
            ))}
          </div>

          <div className="p-8">
            {tab === 'login' ? (
              <>
                <p className="text-[13px] text-[#888] mb-6 text-center">El sistema detecta tu perfil automáticamente</p>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div>
                    <label className={lbl}>Email</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa]" />
                      <input type="email" required autoFocus value={form.email}
                        onChange={e => setForm(p=>({...p,email:e.target.value}))}
                        placeholder="tu@email.com"
                        className={f + ' pl-10'} />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>Contraseña</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa]" />
                      <input type={showPass?'text':'password'} required value={form.password}
                        onChange={e => setForm(p=>({...p,password:e.target.value}))}
                        placeholder="••••••••"
                        className={f + ' pl-10 pr-10'} />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#555]">
                        {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                      </button>
                    </div>
                  </div>
                  {error && <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-lg px-4 py-3">{error}</div>}
                  <button type="submit" disabled={loading}
                    className="w-full bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[15px] py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-1">
                    {loading ? <><Loader2 size={16} className="animate-spin"/>Verificando perfil...</> : <>Ingresar <ArrowRight size={15}/></>}
                  </button>
                </form>
                <p className="text-[12px] text-[#aaa] text-center mt-4">
                  ¿No tenés cuenta? <button onClick={() => setTab('register')} className="text-[#D85A30] font-medium hover:underline">Registrarse</button>
                </p>
              </>
            ) : (
              <>
                <p className="text-[13px] text-[#888] mb-5 text-center">Creá tu cuenta para acceder al portal</p>
                <form onSubmit={handleRegister} className="flex flex-col gap-3">
                  {/* Tipo de usuario */}
                  <div>
                    <label className={lbl}>Soy...</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        ['cliente', '👤', 'Cliente'],
                        ['vendedor', '🏢', 'Inmobiliaria'],
                        ['inversor', '💼', 'Inversor'],
                      ].map(([val, icon, label]) => (
                        <button key={val} type="button" onClick={() => setForm(p=>({...p,tipo:val}))}
                          className={`border-2 rounded-xl p-3 text-center transition-all ${form.tipo===val ? 'border-[#D85A30] bg-[#FDF3EF]' : 'border-[#E2E0DC] hover:border-[#D85A30]/50'}`}>
                          <div className="text-xl mb-1">{icon}</div>
                          <div className="text-[11px] font-semibold text-[#333]">{label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className={lbl}>Nombre completo *</label>
                      <input required className={f} value={form.nombre} onChange={e => setForm(p=>({...p,nombre:e.target.value}))} placeholder="Juan García" />
                    </div>
                    <div>
                      <label className={lbl}>Email *</label>
                      <input required type="email" className={f} value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} />
                    </div>
                    <div>
                      <label className={lbl}>Teléfono</label>
                      <input type="tel" className={f} value={form.telefono} onChange={e => setForm(p=>({...p,telefono:e.target.value}))} placeholder="+54 11..." />
                    </div>
                    {form.tipo === 'vendedor' && (
                      <div className="col-span-2">
                        <label className={lbl}>Nombre de la inmobiliaria</label>
                        <input className={f} value={form.empresa} onChange={e => setForm(p=>({...p,empresa:e.target.value}))} placeholder="Inmobiliaria XYZ" />
                      </div>
                    )}
                    <div className="col-span-2">
                      <label className={lbl}>Contraseña *</label>
                      <div className="relative">
                        <input type={showPass?'text':'password'} required minLength={8} className={f + ' pr-10'}
                          value={form.password} onChange={e => setForm(p=>({...p,password:e.target.value}))} placeholder="Mínimo 8 caracteres" />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#aaa]">
                          {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Términos y condiciones */}
                  <div className="bg-[#F5F4F2] rounded-xl p-4 mt-1">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)}
                        className="w-4 h-4 accent-[#D85A30] mt-0.5 shrink-0" />
                      <span className="text-[12px] text-[#555] leading-relaxed">
                        Acepto los{' '}
                        <Link href="/terminos" target="_blank" className="text-[#D85A30] hover:underline font-medium">Términos y Condiciones</Link>
                        {' '}y la{' '}
                        <Link href="/privacidad" target="_blank" className="text-[#D85A30] hover:underline font-medium">Política de Privacidad</Link>
                        {' '}de G&P Negocios Inmobiliarios. Entiendo que mis datos serán utilizados para gestionar mi cuenta y comunicarme con asesores.
                      </span>
                    </label>
                  </div>

                  {error && <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-lg px-4 py-3">{error}</div>}

                  <button type="submit" disabled={loading || !acceptTerms}
                    className="w-full bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[15px] py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                    {loading ? <><Loader2 size={16} className="animate-spin"/>Creando cuenta...</> : <>Crear cuenta</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
        <p className="text-center text-[12px] text-white/20 mt-6">G&P Negocios Inmobiliarios · Portal privado</p>
      </div>
    </div>
  )
}
