import Link from 'next/link'
export default function AccesoDenegado() {
  return (
    <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="text-6xl opacity-30">🔒</div>
      <h1 className="font-display font-black text-[52px] uppercase text-white">Acceso denegado</h1>
      <p className="text-white/50 text-[16px]">No tenés permisos para ver esta sección.</p>
      <Link href="/admin" className="bg-[#D85A30] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#B84A22] transition-colors mt-2">
        Volver al panel
      </Link>
    </div>
  )
}
