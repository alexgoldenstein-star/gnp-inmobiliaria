import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="text-6xl opacity-20">🏠</div>
      <h1 className="font-display font-black text-[52px] uppercase">404</h1>
      <p className="text-[#555] text-[16px]">La página que buscás no existe.</p>
      <Link href="/" className="bg-[#D85A30] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#B84A22] transition-colors">
        Volver al inicio
      </Link>
    </div>
  )
}
