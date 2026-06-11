export type Operacion = 'venta' | 'alquiler' | 'alquiler_temporal' | 'pozo'
export type TipoPropiedad = 'departamento' | 'casa' | 'ph' | 'local' | 'oficina' | 'terreno' | 'cochera' | 'galpon' | 'emprendimiento'
export type EstadoPropiedad = 'disponible' | 'reservada' | 'vendida' | 'alquilada' | 'pausada'
export type Moneda = 'USD' | 'ARS' | 'EUR'
export type EstadoLead = 'nuevo' | 'visto' | 'contactado' | 'calificado' | 'visita_agendada' | 'propuesta_enviada' | 'negociando' | 'ganado' | 'perdido' | 'spam'
export type Canal = 'web' | 'whatsapp' | 'meta_ads' | 'google_ads' | 'referido' | 'portal_externo' | 'otro'

export interface Propiedad {
  id: string
  slug: string
  titulo: string
  descripcion?: string
  descripcion_corta?: string
  tipo: TipoPropiedad
  operacion: Operacion
  estado: EstadoPropiedad
  precio?: number
  moneda: Moneda
  expensas?: number
  expensas_moneda: string
  precio_negociable: boolean
  superficie_total?: number
  superficie_cubierta?: number
  ambientes?: number
  dormitorios?: number
  banos?: number
  toilettes: number
  cochera: boolean
  cocheras_cantidad: number
  piso?: string
  orientacion?: string
  antiguedad?: number
  estado_conservacion?: string
  amenities: string[]
  servicios: string[]
  direccion?: string
  barrio?: string
  partido?: string
  provincia: string
  pais: string
  direccion_privada: boolean
  lat?: number
  lng?: number
  fotos: string[]
  foto_principal?: string
  video_url?: string
  recorrido_virtual?: string
  plano_url?: string
  meta_titulo?: string
  meta_descripcion?: string
  publicada: boolean
  destacada: boolean
  emprendimiento: boolean
  vistas: number
  leads_count: number
  inmobiliaria_id?: string
  creada_en: string
  actualizada_en: string
  publicada_en?: string
}

export interface Lead {
  id: string
  propiedad_id?: string
  inmobiliaria_id?: string
  nombre: string
  email?: string
  telefono?: string
  whatsapp?: string
  mensaje?: string
  interes?: string
  presupuesto_min?: number
  presupuesto_max?: number
  moneda_pref: string
  zona_interes?: string[]
  canal: Canal
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  estado: EstadoLead
  prioridad: 'alta' | 'media' | 'baja'
  notas?: string
  asignado_a?: string
  proxima_accion?: string
  proxima_accion_fecha?: string
  referido_por?: string
  comision_referido_pct?: number
  creado_en: string
  actualizado_en: string
  propiedad?: Pick<Propiedad, 'titulo' | 'slug' | 'foto_principal'>
}

export interface Inmobiliaria {
  id: string
  nombre: string
  logo_url?: string
  email: string
  telefono?: string
  plan: string
  comision_pct: number
  activa: boolean
  verificada: boolean
  tipo: 'socia' | 'interior' | 'propia'
  zona_origen?: string
  creada_en: string
}

export interface FiltrosPropiedades {
  operacion?: Operacion
  tipo?: TipoPropiedad
  barrio?: string
  precio_min?: number
  precio_max?: number
  moneda?: Moneda
  ambientes?: number
  dormitorios?: number
  cochera?: boolean
  destacada?: boolean
  page?: number
  limit?: number
}
