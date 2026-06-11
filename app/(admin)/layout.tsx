'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BarChart3, Building2, Users, Plus, Settings, Home, LogOut } from 'lucide-react'

const NAV = [
  { href: '/admin',              icon: BarChart3,  label: 'Dashboard' },
  { href: '/admin/propiedades',  icon: Building2,  label: 'Propiedades' },
  { href: '/admin/leads',        icon: Users,      label: 'Leads / CRM' },
  { href: '/admin/nueva',        icon: Plus,       label: 'Nueva propiedad' },
  { href: '/admin/configuracion',icon: Settings,   label: 'Configuración' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex h-screen bg-[#F5F4F2] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#111] text-white flex flex-col shrink-0">
        <div className="flex items-center gap-2.5 px-5 h-[68px] border-b border-white/10">
          <div className="w-8 h-8 bg-[#D85A30] rounded flex items-center justify-center font-display font-black text-sm">G&P</div>
          <div>
            <div className="font-display font-bold text-[14px] uppercase tracking-wide leading-none">Admin</div>
            <div className="text-white/40 text-[11px] mt-0.5">Panel de control</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(({ href, icon: Icon, label }) => {
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

        <div className="px-3 pb-5 border-t border-white/10 pt-3 flex flex-col gap-1">
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] text-white/40 hover:text-white/70 transition-colors no-underline">
            <Home size={14} /> Ver sitio
          </Link>
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] text-white/40 hover:text-red-400 transition-colors w-full text-left">
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
