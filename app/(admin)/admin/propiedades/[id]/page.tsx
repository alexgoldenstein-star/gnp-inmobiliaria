import { supabaseAdmin } from '@/lib/supabase'
import PropiedadForm from '@/components/admin/PropiedadForm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import type { Propiedad } from '@/types'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ id: string }> }

export default async function EditarPropiedadPage({ params }: Props) {
  const { id } = await params
  const db = supabaseAdmin()
  const { data, error } = await db.from('propiedades').select('*').eq('id', id).single()
  if (error || !data) notFound()

  const propiedad = data as Propiedad

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link href="/admin/propiedades" className="flex items-center gap-1.5 text-[13px] text-[#555] hover:text-[#111] transition-colors mb-3 no-underline">
            <ArrowLeft size={14} /> Volver a propiedades
          </Link>
          <h1 className="font-display font-black text-[28px] uppercase tracking-tight leading-tight">{propiedad.titulo}</h1>
          <p className="text-[14px] text-[#555] mt-1 capitalize">{propiedad.tipo} · {propiedad.operacion} · {propiedad.barrio}</p>
        </div>
        {propiedad.publicada && (
          <Link href={`/propiedades/${propiedad.slug}`} target="_blank"
            className="flex items-center gap-2 border border-[#E2E0DC] text-[13px] font-medium px-4 py-2 rounded-md hover:border-[#111] transition-colors no-underline text-[#111]">
            <ExternalLink size={14} /> Ver en sitio
          </Link>
        )}
      </div>
      <PropiedadForm propiedad={propiedad} mode="editar" />
    </div>
  )
}
