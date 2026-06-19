// Motor de cálculo de factibilidad urbanística — basado en el
// Código Urbanístico de CABA (Ley 6.099 y modificatorias).
// Es una ESTIMACIÓN orientativa, no reemplaza un estudio profesional
// ni la consulta oficial de zonificación ante el GCBA.

export interface ZonaUrbanistica {
  codigo: string
  nombre: string
  fot: number          // Factor de Ocupación Total (m² edificables / m² terreno)
  fos: number           // Factor de Ocupación del Suelo (% de planta baja ocupable)
  alturaMaxima: number  // metros
  descripcion: string
}

// Zonificaciones más comunes de CABA (USAA, USAB, Corredores, etc.)
// Valores de referencia del Código Urbanístico vigente
export const ZONAS_URBANISTICAS: ZonaUrbanistica[] = [
  { codigo: 'R2aI',  nombre: 'Residencial R2aI (baja densidad)',          fot: 1.3, fos: 0.6, alturaMaxima: 11,  descripcion: 'Zonas residenciales de baja densidad, típico en barrios como Villa Devoto, Saavedra' },
  { codigo: 'R2aII', nombre: 'Residencial R2aII (densidad media-baja)',   fot: 1.6, fos: 0.6, alturaMaxima: 14,  descripcion: 'Zonas residenciales de densidad media-baja' },
  { codigo: 'R2bI',  nombre: 'Residencial R2bI (densidad media)',         fot: 2.0, fos: 0.6, alturaMaxima: 17,  descripcion: 'Zonas residenciales de densidad media, común en Caballito, Flores' },
  { codigo: 'R2bII', nombre: 'Residencial R2bII (densidad media-alta)',   fot: 2.5, fos: 0.6, alturaMaxima: 22,  descripcion: 'Densidad media-alta, zonas como Almagro, Boedo' },
  { codigo: 'CM',    nombre: 'Corredor de Media Densidad',                fot: 3.2, fos: 0.7, alturaMaxima: 28,  descripcion: 'Avenidas y corredores de media densidad' },
  { codigo: 'CA',    nombre: 'Corredor de Alta Densidad',                 fot: 4.4, fos: 0.7, alturaMaxima: 38,  descripcion: 'Grandes avenidas — Av. Santa Fe, Av. Córdoba, Av. Cabildo' },
  { codigo: 'USAA',  nombre: 'Urbanización Sustentable Alta Densidad',    fot: 5.0, fos: 0.7, alturaMaxima: 45,  descripcion: 'Zonas de mayor densidad permitida — Puerto Madero, Catalinas' },
  { codigo: 'APH',   nombre: 'Área de Protección Histórica',              fot: 1.0, fos: 0.5, alturaMaxima: 9,   descripcion: 'San Telmo, Montserrat — restricciones patrimoniales' },
  { codigo: 'E3',    nombre: 'Equipamiento — Zona mixta',                 fot: 2.8, fos: 0.65, alturaMaxima: 24, descripcion: 'Zonas mixtas residencial/comercial' },
]

// Mapeo aproximado barrio → zonificación predominante (orientativo)
const BARRIO_ZONA_DEFAULT: Record<string, string> = {
  'Palermo': 'R2bII', 'Recoleta': 'CA', 'Belgrano': 'R2bI', 'Núñez': 'R2aII',
  'Caballito': 'R2bI', 'Villa Crespo': 'R2bI', 'Almagro': 'R2bII', 'Boedo': 'R2bII',
  'San Telmo': 'APH', 'Monserrat': 'APH', 'Puerto Madero': 'USAA',
  'Villa Devoto': 'R2aI', 'Saavedra': 'R2aI', 'Flores': 'R2bI', 'Floresta': 'R2aII',
  'Balvanera': 'CM', 'Constitución': 'CM', 'Barracas': 'E3', 'Chacarita': 'R2bI',
  'Colegiales': 'R2bI', 'Villa Urquiza': 'R2aII', 'Coghlan': 'R2aI',
}

export interface ResultadoFactibilidad {
  zona: ZonaUrbanistica
  m2Construibles: number
  alturaEstimadaPisos: number
  incidenciaPorM2Usd: number
  valorTerrenoEstimadoUsd: number
}

// Incidencia de la tierra por m² edificable, según rango de precio del barrio (USD aprox 2025/2026)
const INCIDENCIA_BARRIO: Record<string, number> = {
  'Palermo': 850, 'Recoleta': 900, 'Puerto Madero': 1400, 'Belgrano': 780,
  'Núñez': 650, 'Caballito': 480, 'Villa Crespo': 520, 'Almagro': 460,
  'Boedo': 380, 'San Telmo': 550, 'Villa Devoto': 420, 'Saavedra': 400,
  'Flores': 350, 'Balvanera': 400, 'Barracas': 380, 'Chacarita': 500,
  'Colegiales': 600, 'Villa Urquiza': 430, 'Coghlan': 410,
}
const INCIDENCIA_DEFAULT = 420

export function calcularFactibilidad(
  superficieM2: number,
  barrio: string
): ResultadoFactibilidad {
  const zonaCodigo = BARRIO_ZONA_DEFAULT[barrio] ?? 'R2bI'
  const zona = ZONAS_URBANISTICAS.find(z => z.codigo === zonaCodigo) ?? ZONAS_URBANISTICAS[2]

  const m2Construibles = Math.round(superficieM2 * zona.fot)
  const alturaEstimadaPisos = Math.round(zona.alturaMaxima / 2.8) // ~2.8m por piso

  const incidenciaPorM2Usd = INCIDENCIA_BARRIO[barrio] ?? INCIDENCIA_DEFAULT
  const valorTerrenoEstimadoUsd = Math.round(m2Construibles * incidenciaPorM2Usd * 0.18) // ~18% del valor de venta es incidencia de tierra

  return { zona, m2Construibles, alturaEstimadaPisos, incidenciaPorM2Usd, valorTerrenoEstimadoUsd }
}
