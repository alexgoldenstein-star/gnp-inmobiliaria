'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { BarChart3, Building2, Users, Plus, Settings, Home, LogOut, UserCog, Store, Layout, Sparkles, Network, Trees } from 'lucide-react'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/admin',               icon: BarChart3,  label: 'Dashboard',       roles: ['admin','empleado','vendedor'] },
  { href: '/admin/propiedades',   icon: Building2,  label: 'Propiedades',     roles: ['admin','empleado','vendedor'] },
  { href: '/admin/leads',         icon: Users,      label: 'Leads / CRM',     roles: ['admin','empleado'] },
  { href: '/admin/nueva',         icon: Plus,       label: 'Nueva propiedad', roles: ['admin','empleado','vendedor'] },
  { href: '/admin/usuarios',      icon: UserCog,    label: 'Usuarios',        roles: ['admin'] },
  { href: '/admin/marketplace',    icon: Store,      label: 'Marketplace',     roles: ['admin'] },
  { href: '/admin/contenido',      icon: Layout,     label: 'Editor landing',  roles: ['admin'] },
  { href: '/admin/contenido-rrss', icon: Sparkles,   label: 'Contenido RRSS',  roles: ['admin','empleado'] },
  { href: '/admin/referidos',      icon: Network,    label: 'Red interior',    roles: ['admin'] },
  { href: '/admin/lotes',          icon: Trees,      label: 'Lotes',           roles: ['admin','empleado'] },
  { href: '/admin/configuracion', icon: Settings,   label: 'Configuración',   roles: ['admin'] },
]

const ROL_COLOR: Record<string,string> = {
  admin: 'bg-red-500', empleado: 'bg-blue-500', vendedor: 'bg-purple-500', cliente: 'bg-gray-500'
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ nombre: string; rol: string } | null>(null)

  useEffect(() => {
    // Leer el usuario de la cookie (solo nombre y rol para mostrar)
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.user) setUser(d.user) })
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const visibleNav = user ? NAV.filter(n => n.roles.includes(user.rol)) : NAV

  return (
    <div className="flex h-screen bg-[#F5F4F2] overflow-hidden">
      <aside className="w-[220px] bg-[#111] text-white flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-[68px] border-b border-white/10">
          <Image src="/logo-gyp.png" alt="G&P" width={32} height={32} className="rounded" />
          <div>
            <div className="font-display font-bold text-[14px] uppercase tracking-wide leading-none">Admin</div>
            <div className="text-white/40 text-[11px] mt-0.5">Panel de control</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {visibleNav.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors no-underline
                  ${active ? 'bg-white/15 text-white' : 'text-white/55 hover:text-white hover:bg-white/10'}`}>
                <Icon size={15} /> {label}
              </Link>
            )
          })}
        </nav>

        {/* User info + logout */}
        <div className="px-4 pb-5 border-t border-white/10 pt-4">
          {user && (
            <div className="flex items-center gap-2.5 mb-3 px-1">
              <div className={`w-7 h-7 rounded-full ${ROL_COLOR[user.rol] ?? 'bg-gray-500'} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                {user.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <div className="text-[12px] font-medium text-white/80 truncate">{user.nombre}</div>
                <div className="text-[10px] text-white/40 capitalize">{user.rol}</div>
              </div>
            </div>
          )}
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] text-white/40 hover:text-white/70 transition-colors no-underline">
            <Home size={13} /> Ver sitio
          </Link>
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] text-white/40 hover:text-red-400 transition-colors w-full text-left">
            <LogOut size={13} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
