import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const db = getSupabaseAdmin()
  const { data: props } = await db
    .from('propiedades')
    .select('*')
    .eq('publicada', true)
    .eq('estado', 'disponible')
    .order('publicada_en', { ascending: false })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gnp-inmobiliaria.vercel.app'
  const now = new Date().toISOString()

  const TIPO_MAP: Record<string, string> = {
    departamento: 'Departamento', casa: 'Casa', ph: 'PH',
    local: 'Local comercial', oficina: 'Oficina', terreno: 'Terreno',
    galpon: 'Galpón', cochera: 'Cochera', emprendimiento: 'Emprendimiento',
  }
  const OP_MAP: Record<string, string> = {
    venta: 'Venta', alquiler: 'Alquiler', alquiler_temporal: 'Alquiler temporario', pozo: 'Venta',
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<propiedades fecha="${now}" total="${props?.length ?? 0}" fuente="G&amp;P Negocios Inmobiliarios">
${(props ?? []).map(p => `  <propiedad>
    <id>${p.id}</id>
    <titulo><![CDATA[${p.titulo}]]></titulo>
    <tipo>${TIPO_MAP[p.tipo] ?? p.tipo}</tipo>
    <operacion>${OP_MAP[p.operacion] ?? p.operacion}</operacion>
    <precio>${p.precio ?? ''}</precio>
    <moneda>${p.moneda}</moneda>
    <expensas>${p.expensas ?? ''}</expensas>
    <barrio><![CDATA[${p.barrio ?? ''}]]></barrio>
    <direccion><![CDATA[${p.direccion_privada ? p.barrio : (p.direccion ?? '')}]]></direccion>
    <provincia>${p.provincia ?? 'CABA'}</provincia>
    <pais>Argentina</pais>
    <latitud>${p.lat ?? ''}</latitud>
    <longitud>${p.lng ?? ''}</longitud>
    <superficie_total>${p.superficie_total ?? ''}</superficie_total>
    <superficie_cubierta>${p.superficie_cubierta ?? ''}</superficie_cubierta>
    <ambientes>${p.ambientes ?? ''}</ambientes>
    <dormitorios>${p.dormitorios ?? ''}</dormitorios>
    <banos>${p.banos ?? ''}</banos>
    <cochera>${p.cochera ? 'Si' : 'No'}</cochera>
    <antiguedad>${p.antiguedad ?? ''}</antiguedad>
    <descripcion><![CDATA[${p.descripcion ?? ''}]]></descripcion>
    <amenities><![CDATA[${(p.amenities ?? []).join(', ')}]]></amenities>
    <foto_principal>${p.foto_principal ?? ''}</foto_principal>
    <fotos>
      ${(p.fotos ?? []).map((f: string) => `<foto>${f}</foto>`).join('\n      ')}
    </fotos>
    <url>${baseUrl}/propiedades/${p.slug}</url>
    <publicada_en>${p.publicada_en ?? ''}</publicada_en>
    <destacada>${p.destacada ? 'Si' : 'No'}</destacada>
  </propiedad>`).join('\n')}
</propiedades>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    }
  })
}
