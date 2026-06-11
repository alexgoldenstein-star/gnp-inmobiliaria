'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, LogIn, ChevronDown, User, Building2, Home } from 'lucide-react'

const LINKS = [
  { href: '/propiedades', label: 'Propiedades' },
  { href: '/propiedades?operacion=venta', label: 'Venta' },
  { href: '/propiedades?operacion=alquiler', label: 'Alquiler' },
  { href: '/propiedades?operacion=pozo', label: 'En pozo' },
  { href: '/lotes', label: 'Lotes' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/noticias', label: 'Noticias' },
  { href: '/#nosotros', label: 'Nosotros' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [user, setUser] = useState<{ nombre: string; rol: string } | null>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.user) setUser(d.user) })
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[68px] bg-white/96 border-b border-[#E2E0DC] backdrop-blur-md flex items-center justify-between px-4 md:px-10">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
        <div className="w-9 h-9 bg-[#D85A30] rounded-md flex items-center justify-center font-display font-black text-base text-white tracking-tight">
          G&P
        </div>
        <span className="font-display font-bold text-[16px] uppercase tracking-wide text-[#111] hidden sm:block">
          Negocios Inmobiliarios
        </span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden lg:flex items-center gap-5">
        {LINKS.map(l => (
          <Link key={l.href} href={l.href}
            className="text-[13px] font-medium text-[#555] hover:text-[#111] transition-colors whitespace-nowrap">
            {l.label}
          </Link>
        ))}
      </div>

      {/* Right side actions */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Marketplace — destacado */}
        <Link href="/marketplace"
          className="flex items-center gap-1.5 bg-[#111] hover:bg-[#222] text-white text-[12px] font-semibold px-4 py-2 rounded-md transition-colors border border-[#111]">
          <Building2 size={13} />
          Sumá tu inmobiliaria
        </Link>

        {/* Login / Usuario */}
        {user ? (
          <div className="relative">
            <button onClick={() => setLoginOpen(!loginOpen)}
              className="flex items-center gap-2 border border-[#E2E0DC] text-[13px] font-medium px-3.5 py-2 rounded-md hover:border-[#D85A30] transition-colors">
              <div className="w-5 h-5 bg-[#D85A30] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                {user.nombre.charAt(0)}
              </div>
              {user.nombre.split(' ')[0]}
              <ChevronDown size={13} />
            </button>
            {loginOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-[#E2E0DC] rounded-xl shadow-xl w-48 py-2 z-50">
                <div className="px-4 py-2 border-b border-[#E2E0DC] mb-1">
                  <div className="text-[12px] font-semibold text-[#111]">{user.nombre}</div>
                  <div className="text-[11px] text-[#888] capitalize">{user.rol}</div>
                </div>
                {['admin','empleado','vendedor'].includes(user.rol) && (
                  <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-[13px] text-[#333] hover:bg-[#F5F4F2] transition-colors" onClick={() => setLoginOpen(false)}>
                    <Home size={13} /> Panel admin
                  </Link>
                )}
                <button onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); setUser(null); setLoginOpen(false); window.location.reload() }}
                  className="flex items-center gap-2 px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors w-full text-left">
                  <LogIn size={13} /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <button onClick={() => setLoginOpen(!loginOpen)}
              className="flex items-center gap-2 bg-[#D85A30] hover:bg-[#B84A22] text-white text-[13px] font-semibold px-4 py-2 rounded-md transition-colors">
              <LogIn size={14} /> Ingresar
              <ChevronDown size={12} />
            </button>
            {loginOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-[#E2E0DC] rounded-xl shadow-xl w-56 py-2 z-50">
                <div className="px-4 py-3 border-b border-[#E2E0DC] mb-1">
                  <div className="text-[12px] font-semibold text-[#111] mb-0.5">¿Cómo querés ingresar?</div>
                  <div className="text-[11px] text-[#888]">El sistema identifica tu perfil</div>
                </div>
                <Link href="/login" onClick={() => setLoginOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#F5F4F2] transition-colors no-underline group">
                  <div className="w-8 h-8 bg-[#D85A30]/10 rounded-lg flex items-center justify-center group-hover:bg-[#D85A30]/20 transition-colors">
                    <User size={14} className="text-[#D85A30]" />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#111]">Clientes / Inversores</div>
                    <div className="text-[11px] text-[#888]">Ver mis consultas</div>
                  </div>
                </Link>
                <Link href="/login" onClick={() => setLoginOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#F5F4F2] transition-colors no-underline group">
                  <div className="w-8 h-8 bg-[#111]/10 rounded-lg flex items-center justify-center group-hover:bg-[#111]/20 transition-colors">
                    <Building2 size={14} className="text-[#111]" />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#111]">Inmobiliarias socias</div>
                    <div className="text-[11px] text-[#888]">Panel de publicaciones</div>
                  </div>
                </Link>
                <Link href="/login" onClick={() => setLoginOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#F5F4F2] transition-colors no-underline group">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Home size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#111]">Equipo G&P</div>
                    <div className="text-[11px] text-[#888]">Panel de administración</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile toggle */}
      <div className="lg:hidden flex items-center gap-2">
        <Link href="/login" className="flex items-center gap-1.5 bg-[#D85A30] text-white text-[12px] font-semibold px-3 py-2 rounded-md">
          <LogIn size={13} /> Ingresar
        </Link>
        <button className="p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-[68px] left-0 right-0 bg-white border-b border-[#E2E0DC] px-6 py-4 flex flex-col gap-2 lg:hidden shadow-lg">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} className="text-[14px] font-medium text-[#333] py-2 border-b border-[#F5F4F2]" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/marketplace" className="flex items-center gap-2 bg-[#111] text-white text-[14px] font-semibold px-4 py-2.5 rounded-md mt-2" onClick={() => setOpen(false)}>
            <Building2 size={14} /> Sumá tu inmobiliaria
          </Link>
        </div>
      )}

      {/* Overlay para cerrar el dropdown */}
      {loginOpen && <div className="fixed inset-0 z-40" onClick={() => setLoginOpen(false)} />}
    </nav>
  )
}
