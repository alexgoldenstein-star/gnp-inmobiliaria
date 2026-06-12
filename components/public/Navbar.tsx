'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, LogIn, Building2, User, Home, LogOut } from 'lucide-react'

const LINKS = [
  { href: '/propiedades', label: 'Propiedades' },
  { href: '/propiedades?operacion=venta', label: 'Venta' },
  { href: '/propiedades?operacion=alquiler', label: 'Alquiler' },
  { href: '/propiedades?operacion=pozo', label: 'En pozo' },
  { href: '/lotes', label: 'Lotes' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/#nosotros', label: 'Nosotros' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<{ nombre: string; rol: string } | null>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.user) setUser(d.user) }).catch(() => {})
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    window.location.reload()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[68px] bg-white/96 border-b border-[#E2E0DC] backdrop-blur-md flex items-center justify-between px-4 md:px-10">
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

      {/* Right actions */}
      <div className="hidden lg:flex items-center gap-2">
        <Link href="/marketplace"
          className="flex items-center gap-1.5 bg-[#111] hover:bg-[#222] text-white text-[12px] font-semibold px-4 py-2 rounded-md transition-colors">
          <Building2 size={13} /> Sumá tu inmobiliaria
        </Link>

        {user ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 border border-[#E2E0DC] rounded-md px-3 py-2">
              <div className="w-6 h-6 bg-[#D85A30] rounded-full flex items-center justify-center text-white text-[11px] font-bold">
                {user.nombre.charAt(0)}
              </div>
              <span className="text-[13px] font-medium text-[#111]">{user.nombre.split(' ')[0]}</span>
            </div>
            {['admin','empleado','vendedor'].includes(user.rol) && (
              <Link href="/admin" className="text-[13px] font-medium text-[#555] hover:text-[#111] transition-colors flex items-center gap-1">
                <Home size={13}/> Panel
              </Link>
            )}
            <button onClick={logout} className="text-[12px] text-[#888] hover:text-red-500 transition-colors flex items-center gap-1">
              <LogOut size={13}/> Salir
            </button>
          </div>
        ) : (
          <Link href="/login"
            className="flex items-center gap-2 bg-[#D85A30] hover:bg-[#B84A22] text-white text-[13px] font-semibold px-5 py-2 rounded-md transition-colors">
            <LogIn size={14} /> Ingresar
          </Link>
        )}
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex items-center gap-2">
        <Link href="/login" className="flex items-center gap-1.5 bg-[#D85A30] text-white text-[12px] font-semibold px-3 py-2 rounded-md">
          <LogIn size={13}/> Ingresar
        </Link>
        <button className="p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      {open && (
        <div className="absolute top-[68px] left-0 right-0 bg-white border-b border-[#E2E0DC] px-6 py-4 flex flex-col gap-2 lg:hidden shadow-lg z-50">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} className="text-[14px] font-medium text-[#333] py-2 border-b border-[#F5F4F2]" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/marketplace" className="flex items-center gap-2 bg-[#111] text-white text-[14px] font-semibold px-4 py-2.5 rounded-md mt-2" onClick={() => setOpen(false)}>
            <Building2 size={14}/> Sumá tu inmobiliaria
          </Link>
        </div>
      )}
    </nav>
  )
}
