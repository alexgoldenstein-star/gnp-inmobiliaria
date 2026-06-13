import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const db = getSupabaseAdmin()
  const { data, error } = await db.from('portfolio_proyectos').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, proyecto: data })
}

export async function GET() {
  const db = getSupabaseAdmin()
  const { data } = await db.from('portfolio_proyectos').select('*').order('anio', { ascending: false })
  return NextResponse.json({ proyectos: data ?? [] })
}
