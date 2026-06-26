'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, User, Building2, Home, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const ROLES_INFO = {
  admin:    { icon: Home,      label: 'Equipo G&P',         color: 'text-blue-600',   bg: 'bg-blue-50',   desc: 'Panel de administración' },
  empleado: { icon: Home,      label: 'Equipo G&P',         color: 'text-blue-600',   bg: 'bg-blue-50',   desc: 'Panel de administración' },
  vendedor: { icon: Building2, label: 'Inmobiliaria socia', color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Panel de publicaciones' },
  cliente:  { icon: User,      label: 'Cliente',            color: 'text-[#D85A30]',  bg: 'bg-orange-50', desc: 'Portal de consultas' },
}

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login'|'register'>('login')
  const [step, setStep] = useState<'form'|'success'|'pending_approval'>('form')
  const [form, setForm] = useState({ email: '', password: '', confirm_password: '', nombre: '', telefono: '', tipo: 'cliente', empresa: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [detectedRole, setDetectedRole] = useState<string | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setDetectedRole(data.rol)
      setTimeout(() => {
        if (data.rol === 'cliente') router.push('/mi-cuenta')
        else router.push('/admin')
        router.refresh()
      }, 1500)
    } catch { setError('Error de conexión. Intentá de nuevo.') }
    finally { setLoading(false) }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptTerms) { setError('Debés aceptar los términos y condiciones.'); return }
    if (form.password !== form.confirm_password) { setError('Las contraseñas no coinciden.'); return }
    if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre, email: form.email, password: form.password,
          telefono: form.telefono, tipo: form.tipo, empresa: form.empresa,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      // Inmobiliaria necesita aprobación, cliente entra directo
      if (form.tipo === 'vendedor') setStep('pending_approval')
      else setStep('success')
    } catch { setError('Error al registrarse.') }
    finally { setLoading(false) }
  }

  const f = 'w-full border border-[#E2E0DC] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-[#D85A30] transition-colors bg-white'
  const lbl = 'text-[11px] font-semibold uppercase tracking-wide text-[#222] block mb-1.5'

  // ── Pantalla: rol detectado ──────────────────────────────────
  if (detectedRole) {
    const info = ROLES_INFO[detectedRole as keyof typeof ROLES_INFO]
    const Icon = info?.icon ?? User
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 text-center w-full max-w-sm shadow-2xl">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={36} className="text-green-500" />
          </div>
          <h2 className="font-display font-black text-[24px] uppercase mb-3">¡Bienvenido!</h2>
          <div className={`inline-flex items-center gap-2 ${info?.bg} px-3 py-1.5 rounded-full mb-3`}>
            <Icon size={13} className={info?.color} />
            <span className={`text-[12px] font-semibold ${info?.color}`}>{info?.label}</span>
          </div>
          <p className="text-[13px] text-[#888] mb-5">{info?.desc}</p>
          <div className="w-full bg-[#F5F4F2] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#D85A30] h-full rounded-full" style={{ width: '100%', transition: 'width 1.5s ease' }} />
          </div>
          <p className="text-[11px] text-[#aaa] mt-2">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  // ── Pantalla: registro exitoso (cliente) ─────────────────────
  if (step === 'success') return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-10 text-center w-full max-w-sm shadow-2xl">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h2 className="font-display font-black text-[22px] uppercase mb-2">¡Cuenta creada!</h2>
        <p className="text-[14px] text-[#555] mb-6">Ya podés ingresar con tu email y contraseña.</p>
        <button onClick={() => { setStep('form'); setTab('login') }}
          className="w-full bg-[#D85A30] text-white font-semibold py-3 rounded-lg hover:bg-[#B84A22] transition-colors">
          Ingresar ahora
        </button>
      </div>
    </div>
  )

  // ── Pantalla: inmobiliaria pendiente de aprobación ───────────
  if (step === 'pending_approval') return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-10 text-center w-full max-w-sm shadow-2xl">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="font-display font-black text-[22px] uppercase mb-2">Solicitud enviada</h2>
        <p className="text-[14px] text-[#555] mb-2">Tu solicitud fue recibida y está <strong>pendiente de aprobación</strong> por el equipo de G&P.</p>
        <p className="text-[13px] text-[#888] mb-6">Te avisamos por email cuando tu cuenta sea activada. Normalmente en menos de 24 horas.</p>
        <Link href="/"
          className="w-full block text-center bg-[#D85A30] text-white font-semibold py-3 rounded-lg hover:bg-[#B84A22] transition-colors">
          Volver al sitio
        </Link>
      </div>
    </div>
  )

  // ── Modal de términos ────────────────────────────────────────
  if (showTerms) return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#E2E0DC]">
          <h2 className="font-display font-bold text-[20px] uppercase">Términos y Condiciones</h2>
          <button onClick={() => setShowTerms(false)} className="text-[#888] hover:text-[#111] text-[13px] font-medium">Cerrar</button>
        </div>
        <div className="px-8 py-6 overflow-y-auto max-h-[60vh] space-y-5 text-[13px] text-[#444]">
          {[
            ['1. Aceptación', 'Al registrarse en el portal de G&P Negocios Inmobiliarios, el usuario acepta estos términos. Si no está de acuerdo, no podrá usar el servicio.'],
            ['2. Uso del portal', 'El portal permite buscar, publicar y gestionar propiedades en Argentina. G&P actúa como intermediario entre propietarios, inmobiliarias y compradores.'],
            ['3. Registro', 'El usuario debe proveer información veraz. Es responsable de la confidencialidad de su contraseña y de todas las acciones en su cuenta.'],
            ['4. Inmobiliarias socias', 'Las inmobiliarias deben ser aprobadas por G&P. Se comprometen a publicar información veraz, contar con autorización del propietario y mantener actualizada la disponibilidad.'],
            ['5. Comisiones', 'Las condiciones de comisiones se acuerdan individualmente mediante contrato escrito. G&P puede modificarlas con 30 días de aviso.'],
            ['6. Responsabilidad', 'G&P no garantiza la exactitud de información de terceros y no responde por daños derivados de operaciones entre usuarios. Actúa exclusivamente como intermediaria.'],
            ['7. Propiedad intelectual', 'Todo el contenido del portal es propiedad de G&P o sus licenciantes. Queda prohibida su reproducción sin autorización.'],
            ['8. Privacidad', 'El tratamiento de datos se rige por la Política de Privacidad y la Ley 25.326 de la República Argentina.'],
            ['9. Jurisdicción', 'Estos términos se rigen por las leyes argentinas. Cualquier controversia se dirime ante los Tribunales Ordinarios de CABA.'],
          ].map(([t, c]) => (
            <div key={t}>
              <div className="font-semibold text-[14px] text-[#111] mb-1">{t}</div>
              <p className="leading-relaxed">{c}</p>
            </div>
          ))}
        </div>
        <div className="px-8 py-5 border-t border-[#E2E0DC] flex gap-3">
          <button onClick={() => { setAcceptTerms(true); setShowTerms(false) }}
            className="flex-1 bg-[#D85A30] text-white font-semibold py-3 rounded-lg hover:bg-[#B84A22] transition-colors">
            Acepto los términos
          </button>
          <button onClick={() => setShowTerms(false)}
            className="px-5 border border-[#E2E0DC] rounded-lg hover:border-[#111] transition-colors text-[14px] font-medium">
            Cancelar
          </button>
        </div>
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
            {[['login','Ingresar'],['register','Registrarse']].map(([val, label]) => (
              <button key={val} onClick={() => { setTab(val as any); setError('') }}
                className={`flex-1 py-4 text-[14px] font-semibold transition-colors ${tab === val ? 'text-[#D85A30] border-b-2 border-[#D85A30]' : 'text-[#888] hover:text-[#555]'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* ── LOGIN ── */}
            {tab === 'login' && (
              <>
                <p className="text-[13px] text-[#888] text-center mb-6">El sistema detecta tu perfil automáticamente</p>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div>
                    <label className={lbl}>Email</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa]" />
                      <input type="email" required autoFocus value={form.email}
                        onChange={e => set('email', e.target.value)} placeholder="tu@email.com"
                        className={f + ' pl-10'} />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>Contraseña</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa]" />
                      <input type={showPass ? 'text' : 'password'} required value={form.password}
                        onChange={e => set('password', e.target.value)} placeholder="••••••••"
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
                    {loading ? <><Loader2 size={16} className="animate-spin"/>Verificando...</> : <>Ingresar <ArrowRight size={15}/></>}
                  </button>
                </form>
                <p className="text-[12px] text-[#aaa] text-center mt-4">
                  ¿No tenés cuenta?{' '}
                  <button onClick={() => setTab('register')} className="text-[#D85A30] font-medium hover:underline">Registrarse</button>
                </p>
              </>
            )}

            {/* ── REGISTRO ── */}
            {tab === 'register' && (
              <>
                <p className="text-[13px] text-[#888] text-center mb-5">Creá tu cuenta para acceder al portal</p>
                <form onSubmit={handleRegister} className="flex flex-col gap-3">
                  {/* Tipo */}
                  <div>
                    <label className={lbl}>Tipo de cuenta</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[['cliente', '👤', 'Cliente'], ['vendedor', '🏢', 'Inmobiliaria']].map(([val, icon, label]) => (
                        <button key={val} type="button" onClick={() => set('tipo', val)}
                          className={`border-2 rounded-xl p-3 text-center transition-all ${form.tipo === val ? 'border-[#D85A30] bg-[#FDF3EF]' : 'border-[#E2E0DC] hover:border-[#D85A30]/50'}`}>
                          <div className="text-xl mb-1">{icon}</div>
                          <div className="text-[12px] font-semibold text-[#333]">{label}</div>
                          {val === 'vendedor' && <div className="text-[10px] text-[#888] mt-0.5">Requiere aprobación</div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={lbl}>Nombre completo *</label>
                    <input required className={f} value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Juan García" />
                  </div>

                  {form.tipo === 'vendedor' && (
                    <div>
                      <label className={lbl}>Nombre de la inmobiliaria</label>
                      <input className={f} value={form.empresa} onChange={e => set('empresa', e.target.value)} placeholder="Inmobiliaria XYZ" />
                    </div>
                  )}

                  <div>
                    <label className={lbl}>Email *</label>
                    <input required type="email" className={f} value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>

                  <div>
                    <label className={lbl}>Teléfono / WhatsApp</label>
                    <input type="tel" className={f} value={form.telefono} onChange={e => set('telefono', e.target.value)} placeholder="+54 11..." />
                  </div>

                  <div>
                    <label className={lbl}>Contraseña * (mínimo 8 caracteres)</label>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} required minLength={8} className={f + ' pr-10'}
                        value={form.password} onChange={e => set('password', e.target.value)} placeholder="Elegí una contraseña segura" />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#aaa]">
                        {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={lbl}>Confirmar contraseña *</label>
                    <input type="password" required minLength={8} className={f}
                      value={form.confirm_password} onChange={e => set('confirm_password', e.target.value)} placeholder="Repetí tu contraseña" />
                  </div>

                  {/* Términos */}
                  <div className="bg-[#F5F4F2] rounded-xl p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)}
                        className="w-4 h-4 accent-[#D85A30] mt-0.5 shrink-0" />
                      <span className="text-[12px] text-[#555] leading-relaxed">
                        Acepto los{' '}
                        <button type="button" onClick={() => setShowTerms(true)}
                          className="text-[#D85A30] font-semibold hover:underline inline-flex items-center gap-0.5">
                          Términos y Condiciones <ChevronRight size={11}/>
                        </button>
                        {' '}y la{' '}
                        <Link href="/privacidad" target="_blank" className="text-[#D85A30] font-semibold hover:underline">
                          Política de Privacidad
                        </Link>
                        {' '}de G&P Negocios Inmobiliarios.
                      </span>
                    </label>
                    {!acceptTerms && (
                      <button type="button" onClick={() => setShowTerms(true)}
                        className="mt-2 text-[11px] text-[#D85A30] hover:underline flex items-center gap-1">
                        <ChevronRight size={10}/> Ver el contrato completo
                      </button>
                    )}
                  </div>

                  {error && <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-lg px-4 py-3">{error}</div>}

                  <button type="submit" disabled={loading || !acceptTerms}
                    className="w-full bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold text-[15px] py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                    {loading ? <><Loader2 size={16} className="animate-spin"/>Procesando...</>
                     : form.tipo === 'vendedor' ? 'Enviar solicitud' : 'Crear cuenta'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
        <p className="text-center text-[12px] text-white/20 mt-5">G&P Negocios Inmobiliarios · Portal privado</p>
      </div>
    </div>
  )
}
