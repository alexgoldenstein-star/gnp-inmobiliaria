'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/propiedades', label: 'Propiedades' },
  { href: '/propiedades?operacion=venta', label: 'Venta' },
  { href: '/propiedades?operacion=alquiler', label: 'Alquiler' },
  { href: '/propiedades?operacion=pozo', label: 'En pozo' },
  { href: '/#nosotros', label: 'Nosotros' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[68px] bg-white/96 border-b border-[#E2E0DC] backdrop-blur-md flex items-center justify-between px-6 md:px-12">
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-9 h-9 bg-[#D85A30] rounded-md flex items-center justify-center font-display font-black text-base text-white tracking-tight">
          G&P
        </div>
        <span className="font-display font-bold text-[17px] uppercase tracking-wide text-[#111] hidden sm:block">
          Negocios Inmobiliarios
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        {LINKS.map(l => (
          <Link key={l.href} href={l.href}
            className="text-[13px] font-medium text-[#555] hover:text-[#111] transition-colors">
            {l.label}
          </Link>
        ))}
        <Link href="/#contacto"
          className="bg-[#D85A30] text-white text-[13px] font-semibold px-5 py-2.5 rounded-md hover:bg-[#B84A22] transition-colors">
          Contacto
        </Link>
      </div>

      <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute top-[68px] left-0 right-0 bg-white border-b border-[#E2E0DC] px-6 py-4 flex flex-col gap-3 md:hidden shadow-lg">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} className="text-[14px] font-medium text-[#333]" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/#contacto"
            className="bg-[#D85A30] text-white text-[14px] font-semibold px-4 py-2.5 rounded-md text-center"
            onClick={() => setOpen(false)}>
            Contacto
          </Link>
        </div>
      )}
    </nav>
  )
}
