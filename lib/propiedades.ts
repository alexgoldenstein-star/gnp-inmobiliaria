import { getSupabase } from './supabase'
import type { FiltrosPropiedades, Propiedad } from '@/types'

export async function getPropiedadesPublicas(filtros: FiltrosPropiedades = {}) {
  const sb = getSupabase()
  const { operacion, tipo, barrio, precio_min, precio_max, ambientes, cochera, page = 1, limit = 12 } = filtros
  const offset = (page - 1) * limit

  let query = sb
    .from('propiedades')
    .select('*', { count: 'exact' })
    .eq('publicada', true)
    .eq('estado', 'disponible')
    .order('destacada', { ascending: false })
    .order('publicada_en', { ascending: false })
    .range(offset, offset + limit - 1)

  if (operacion) query = query.eq('operacion', operacion)
  if (tipo) query = query.eq('tipo', tipo)
  if (barrio) query = query.ilike('barrio', `%${barrio}%`)
  if (precio_min) query = query.gte('precio', precio_min)
  if (precio_max) query = query.lte('precio', precio_max)
  if (ambientes) query = query.gte('ambientes', ambientes)
  if (cochera !== undefined) query = query.eq('cochera', cochera)

  const { data, error, count } = await query
  if (error) throw error
  return { propiedades: (data ?? []) as Propiedad[], total: count ?? 0 }
}

export async function getPropiedadBySlug(slug: string): Promise<Propiedad | null> {
  const sb = getSupabase()
  const { data, error } = await sb
    .from('propiedades')
    .select('*')
    .eq('slug', slug)
    .eq('publicada', true)
    .single()
  if (error) return null
  sb.rpc('incrementar_vistas', { prop_id: data.id }).then(() => {})
  return data as Propiedad
}

export async function getPropiedadesDestacadas(limit = 6): Promise<Propiedad[]> {
  try {
    const sb = getSupabase()
    const { data } = await sb
      .from('propiedades')
      .select('*')
      .eq('publicada', true)
      .eq('estado', 'disponible')
      .eq('destacada', true)
      .order('publicada_en', { ascending: false })
      .limit(limit)
    return (data ?? []) as Propiedad[]
  } catch {
    return []
  }
}

export function formatPrecio(precio?: number | null, moneda: string = 'USD'): string {
  if (!precio) return 'Consultar'
  const formatter = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })
  const simbolo = moneda === 'USD' ? 'USD' : moneda === 'EUR' ? 'EUR' : '$'
  return `${simbolo} ${formatter.format(precio)}`
}

export function generarSlug(titulo: string, barrio: string): string {
  const base = `${titulo}-${barrio}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  return `${base}-${Date.now().toString(36)}`
}
