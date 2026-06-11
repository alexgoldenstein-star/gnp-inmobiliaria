import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generarSlug } from '@/lib/propiedades'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const db = supabaseAdmin()

    const slug = generarSlug(body.titulo, body.barrio ?? 'caba')
    const payload = {
      ...body,
      slug,
      precio: body.precio ? Number(body.precio) : null,
      expensas: body.expensas ? Number(body.expensas) : null,
      superficie_total: body.superficie_total ? Number(body.superficie_total) : null,
      superficie_cubierta: body.superficie_cubierta ? Number(body.superficie_cubierta) : null,
      ambientes: body.ambientes ? Number(body.ambientes) : null,
      dormitorios: body.dormitorios ? Number(body.dormitorios) : null,
      banos: body.banos ? Number(body.banos) : null,
      toilettes: Number(body.toilettes ?? 0),
      cocheras_cantidad: Number(body.cocheras_cantidad ?? 0),
      antiguedad: body.antiguedad !== '' ? Number(body.antiguedad) : null,
      publicada_en: body.publicada ? new Date().toISOString() : null,
    }

    const { data, error } = await db.from('propiedades').insert(payload).select().single()
    if (error) throw error

    return NextResponse.json({ success: true, propiedad: data })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const db = supabaseAdmin()

  const { data, error } = await db
    .from('propiedades')
    .select('*')
    .order('creada_en', { ascending: false })
    .limit(Number(searchParams.get('limit') ?? 50))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ propiedades: data })
}
