import PropiedadForm from '@/components/admin/PropiedadForm'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function NuevaPropiedadSociaPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="font-display font-black text-[28px] uppercase tracking-tight mb-2">Nueva propiedad</h1>
      <p className="text-[14px] text-[#555] mb-8">Las propiedades quedan pendientes de aprobación por G&P antes de publicarse.</p>
      <PropiedadForm mode="nueva" />
    </div>
  )
}
