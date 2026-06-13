import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { Building2, Plus, BarChart3, LogOut } from 'lucide-react'

export default async function SociaLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (!['vendedor','admin','empleado'].includes(session.rol)) redirect('/')

  return (
    <div className="flex h-screen bg-[#F5F4F2] overflow-hidden">
      <aside className="w-[200px] bg-[#111] text-white flex flex-col shrink-0">
        <div className="px-5 h-[68px] border-b border-white/10 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#D85A30] rounded flex items-center justify-center">
            <Building2 size={14} className="text-white"/>
          </div>
          <div>
            <div className="font-display font-bold text-[13px] uppercase tracking-wide leading-none">Mi panel</div>
            <div className="text-white/40 text-[10px] mt-0.5 truncate">{session.nombre}</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {[
            { href: '/panel', icon: BarChart3, label: 'Dashboard' },
            { href: '/panel/propiedades', icon: Building2, label: 'Mis propiedades' },
            { href: '/panel/nueva', icon: Plus, label: 'Nueva propiedad' },
          ].map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-white/55 hover:text-white hover:bg-white/10 transition-colors no-underline">
              <Icon size={15}/> {label}
            </Link>
          ))}
        </nav>
        <div className="px-3 pb-5 border-t border-white/10 pt-3">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-[12px] text-white/40 hover:text-white/70 transition-colors no-underline">
            Ver sitio público
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button className="flex items-center gap-2 px-3 py-2 text-[12px] text-white/40 hover:text-red-400 transition-colors w-full text-left">
              <LogOut size={13}/> Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
