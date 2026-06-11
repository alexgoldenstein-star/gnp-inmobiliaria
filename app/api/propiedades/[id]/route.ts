import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generarSlug } from '@/lib/propiedades'

interface Props { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const body = await req.json()
    const db = supabaseAdmin()

    const payload = {
      ...body,
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
      lat: body.lat ? Number(body.lat) : null,
      lng: body.lng ? Number(body.lng) : null,
      actualizada_en: new Date().toISOString(),
      publicada_en: body.publicada ? new Date().toISOString() : null,
    }
    delete payload.id
    delete payload.creada_en
    delete payload.slug

    const { data, error } = await db.from('propiedades').update(payload).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json({ success: true, propiedad: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params
    const db = supabaseAdmin()
    const { error } = await db.from('propiedades').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
