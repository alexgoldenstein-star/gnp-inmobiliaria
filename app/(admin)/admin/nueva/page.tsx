import PropiedadForm from '@/components/admin/PropiedadForm'

export default function NuevaPropiedadPage() {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-black text-[32px] uppercase tracking-tight">Nueva propiedad</h1>
        <p className="text-[14px] text-[#555] mt-1">Completá los datos para publicar una nueva propiedad.</p>
      </div>
      <PropiedadForm mode="nueva" />
    </div>
  )
}
