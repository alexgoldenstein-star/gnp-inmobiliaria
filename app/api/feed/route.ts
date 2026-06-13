import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const db = getSupabaseAdmin()
  const { data } = await db
    .from('propiedades')
    .select('id,slug,titulo,tipo,operacion,precio,moneda,expensas,barrio,provincia,lat,lng,superficie_total,superficie_cubierta,ambientes,dormitorios,banos,cochera,descripcion,amenities,foto_principal,fotos,publicada_en,destacada')
    .eq('publicada', true).eq('estado', 'disponible')
    .order('publicada_en', { ascending: false })

  return NextResponse.json({
    fuente: 'G&P Negocios Inmobiliarios',
    total: data?.length ?? 0,
    actualizado: new Date().toISOString(),
    propiedades: data ?? []
  }, {
    headers: { 'Cache-Control': 'public, max-age=3600' }
  })
}
