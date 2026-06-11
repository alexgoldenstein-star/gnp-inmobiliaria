import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
interface Props { params: Promise<{ id: string }> }
export async function PUT(req: NextRequest, { params }: Props) {
  const { id } = await params
  const body = await req.json()
  const db = getSupabaseAdmin()
  const { error } = await db.from('marketplace_solicitudes')
    .update({ ...body, procesada_en: new Date().toISOString() }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
