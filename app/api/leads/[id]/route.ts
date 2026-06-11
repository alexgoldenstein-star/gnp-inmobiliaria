import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface Props { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Props) {
  const { id } = await params
  const body = await req.json()
  const db = supabaseAdmin()

  const { data, error } = await db.from('leads')
    .update({ ...body, actualizado_en: new Date().toISOString() })
    .eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, lead: data })
}
