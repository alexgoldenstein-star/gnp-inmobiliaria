import Link from 'next/link'
import { Home, Building2, Users, Settings, BarChart3, Plus } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin', icon: BarChart3, label: 'Dashboard' },
  { href: '/admin/propiedades', icon: Building2, label: 'Propiedades' },
  { href: '/admin/leads', icon: Users, label: 'Leads / CRM' },
  { href: '/admin/nueva', icon: Plus, label: 'Nueva prop.' },
  { href: '/admin/configuracion', icon: Settings, label: 'Configuración' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F5F4F2]">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#111] text-white flex flex-col shrink-0">
        <Link href="/" className="flex items-center gap-2.5 px-5 h-[68px] border-b border-white/10">
          <div className="w-8 h-8 bg-[#D85A30] rounded flex items-center justify-center font-display font-black text-sm">G&P</div>
          <span className="font-display font-bold text-[14px] uppercase tracking-wide leading-tight">
            Admin<br /><span className="text-white/50 text-[11px] font-normal normal-case tracking-normal">Panel de control</span>
          </span>
        </Link>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors no-underline">
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 pb-5 border-t border-white/10 pt-4">
          <Link href="/" className="flex items-center gap-2 text-[12px] text-white/40 hover:text-white/70 transition-colors">
            <Home size={13} /> Ver sitio público
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
