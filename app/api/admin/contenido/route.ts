import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function PUT(req: NextRequest) {
  try {
    const { items } = await req.json()
    const db = getSupabaseAdmin()
    for (const item of items) {
      await db.from('landing_content').upsert({ ...item, actualizado_en: new Date().toISOString() }, { onConflict: 'clave' })
    }
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
