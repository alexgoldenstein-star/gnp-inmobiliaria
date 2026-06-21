// Motor de cálculo de factibilidad urbanística — basado en el
// Código Urbanístico de CABA, Ley N° 6.099 (CUr), Título 6: Normas de Edificabilidad.
//
// IMPORTANTE: A partir de la Ley 6.099 (vigente desde dic. 2018), CABA dejó de usar
// FOT/FOS. La edificabilidad ahora se define por "Unidades de Edificabilidad" con
// ALTURA MÁXIMA fija, y la superficie construible surge de aplicar esa altura sobre
// el área edificable real de la parcela (definida por la Línea de Frente Interno —
// LFI — y la Línea Interna de Basamento — LIB), no de un coeficiente sobre la
// superficie total del terreno.
//
// Es una ESTIMACIÓN orientativa basada en parámetros típicos de cada Unidad. No
// reemplaza un informe de prefactibilidad profesional (consulta de la plancheta
// catastral real, manzana específica, retiros y servidumbres) ni la consulta oficial
// ante el GCBA (mapa.buenosaires.gob.ar).

export interface UnidadEdificabilidad {
  codigo: string
  nombre: string
  alturaMaxima: number      // metros, plano límite (sin contar sobrerecorrido de retiros)
  pisos: string             // descripción tipo "PB + 10 pisos + 2 retiros"
  pisosNumero: number       // cantidad total de niveles habitables (PB incluida)
  basamentoM: number | null // altura de basamento obligatorio, null = no aplica
  alturaPBMinima: number
  descripcion: string
}

// Las 6 Unidades de Edificabilidad del Título 6.2 del Código Urbanístico (CUr)
export const UNIDADES_EDIFICABILIDAD: UnidadEdificabilidad[] = [
  { codigo: 'CA',     nombre: 'Corredor Alto (C.A.)',                         alturaMaxima: 38.00, pisos: 'PB + 12 pisos + 2 retiros', pisosNumero: 13, basamentoM: 6,    alturaPBMinima: 3.00, descripcion: 'Grandes avenidas — máxima edificabilidad permitida' },
  { codigo: 'CM',     nombre: 'Corredor Medio (C.M.)',                        alturaMaxima: 31.20, pisos: 'PB + 10 pisos + 2 retiros', pisosNumero: 11, basamentoM: 6,    alturaPBMinima: 3.00, descripcion: 'Avenidas y corredores de densidad media-alta' },
  { codigo: 'USAA',   nombre: 'Unidad de Sustentabilidad Alta (U.S.A.A.)',    alturaMaxima: 22.80, pisos: 'PB + 7 pisos + 2 retiros',  pisosNumero: 8,  basamentoM: null, alturaPBMinima: 3.00, descripcion: 'Zonas residenciales de densidad media-alta' },
  { codigo: 'USAM',   nombre: 'Unidad de Sustentabilidad Media (U.S.A.M.)',   alturaMaxima: 17.20, pisos: 'PB + 5 pisos + 2 retiros',  pisosNumero: 6,  basamentoM: null, alturaPBMinima: 3.00, descripcion: 'Zonas residenciales de densidad media' },
  { codigo: 'USAB2',  nombre: 'Unidad de Sustentabilidad Baja 2 (U.S.A.B.2)', alturaMaxima: 11.60, pisos: 'PB + 3 pisos + 1 retiro',   pisosNumero: 4,  basamentoM: null, alturaPBMinima: 2.60, descripcion: 'Zonas residenciales de baja densidad' },
  { codigo: 'USAB1',  nombre: 'Unidad de Sustentabilidad Baja 1 (U.S.A.B.1)', alturaMaxima: 9.00,  pisos: 'PB + 2 pisos',              pisosNumero: 3,  basamentoM: null, alturaPBMinima: 2.60, descripcion: 'Zonas residenciales de muy baja densidad / cascos históricos' },
]

// Mapeo orientativo barrio → Unidad de Edificabilidad predominante.
// IMPORTANTE: dentro de un mismo barrio conviven distintas unidades según la
// calle puntual (corredores sobre avenidas vs. interior de manzanas). Esto es
// SOLO un valor de referencia para la estimación rápida; la unidad real se
// confirma con la plancheta catastral de la parcela (mapa.buenosaires.gob.ar).
const BARRIO_UNIDAD_DEFAULT: Record<string, string> = {
  'Palermo': 'USAM', 'Recoleta': 'CM', 'Belgrano': 'USAM', 'Núñez': 'USAB2',
  'Caballito': 'USAM', 'Villa Crespo': 'USAM', 'Almagro': 'CM', 'Boedo': 'USAM',
  'San Telmo': 'USAB1', 'Monserrat': 'USAB2', 'Puerto Madero': 'CA',
  'Villa Devoto': 'USAB2', 'Saavedra': 'USAB2', 'Flores': 'USAM', 'Floresta': 'USAB2',
  'Balvanera': 'CM', 'Constitución': 'CM', 'Barracas': 'USAM', 'Chacarita': 'USAM',
  'Colegiales': 'USAM', 'Villa Urquiza': 'USAB2', 'Coghlan': 'USAB1',
}

// Incidencia de tierra por m² vendible, según barrio (USD aprox. de referencia, 2025/2026)
const INCIDENCIA_BARRIO: Record<string, number> = {
  'Palermo': 850, 'Recoleta': 900, 'Puerto Madero': 1400, 'Belgrano': 780,
  'Núñez': 650, 'Caballito': 480, 'Villa Crespo': 520, 'Almagro': 460,
  'Boedo': 380, 'San Telmo': 550, 'Villa Devoto': 420, 'Saavedra': 400,
  'Flores': 350, 'Balvanera': 400, 'Barracas': 380, 'Chacarita': 500,
  'Colegiales': 600, 'Villa Urquiza': 430, 'Coghlan': 410,
}
const INCIDENCIA_DEFAULT = 420

export interface ResultadoFactibilidad {
  unidad: UnidadEdificabilidad
  superficieTerreno: number
  bandaEdificableM: number
  areaEdificablePorPiso: number
  m2CubiertosTotal: number
  m2VendibleEstimado: number
  pisosNumero: number
  incidenciaPorM2Usd: number
  valorTerrenoEstimadoUsd: number
}

/**
 * Calcula la edificabilidad de una parcela según el Código Urbanístico (CUr, Ley 6099).
 *
 * Lógica simplificada del modelo real:
 * 1. Se determina la Unidad de Edificabilidad según el barrio (orientativo).
 * 2. La superficie de cada piso surge de aplicar el frente sobre el fondo edificable
 *    (excluyendo el área no edificable detrás de la LFI, estimada como % del fondo).
 * 3. Los últimos niveles son "retiros" (terrazas escalonadas) con menor superficie.
 * 4. El total se pondera por áreas comunes/circulación para obtener m² vendibles.
 */
export function calcularFactibilidad(
  superficieM2: number,
  barrio: string,
  frenteM?: number
): ResultadoFactibilidad {
  const codigoUnidad = BARRIO_UNIDAD_DEFAULT[barrio] ?? 'USAM'
  const unidad = UNIDADES_EDIFICABILIDAD.find(u => u.codigo === codigoUnidad)!

  const frente = frenteM && frenteM > 0 ? frenteM : Math.sqrt(superficieM2 / 3)
  const fondo = superficieM2 / frente

  const factorFondoEdificable = fondo > 25 ? 0.62 : fondo > 15 ? 0.72 : 0.85
  const fondoEdificable = Math.max(fondo * factorFondoEdificable, Math.min(fondo, 16))

  const areaEdificablePorPiso = Math.round(frente * fondoEdificable)

  const pisosConRetiro = unidad.codigo === 'USAB1' ? 0 : unidad.codigo === 'USAB2' ? 1 : 2
  const pisosPlenos = unidad.pisosNumero - pisosConRetiro

  const m2PisosPlenos = areaEdificablePorPiso * pisosPlenos
  const m2PisosRetiro = areaEdificablePorPiso * 0.65 * pisosConRetiro

  const m2CubiertosTotal = Math.round(m2PisosPlenos + m2PisosRetiro)
  const m2VendibleEstimado = Math.round(m2CubiertosTotal * 0.88)

  const incidenciaPorM2Usd = INCIDENCIA_BARRIO[barrio] ?? INCIDENCIA_DEFAULT
  const valorTerrenoEstimadoUsd = Math.round(m2VendibleEstimado * incidenciaPorM2Usd * 0.20)

  return {
    unidad,
    superficieTerreno: superficieM2,
    bandaEdificableM: Math.round(fondoEdificable * 10) / 10,
    areaEdificablePorPiso,
    m2CubiertosTotal,
    m2VendibleEstimado,
    pisosNumero: unidad.pisosNumero,
    incidenciaPorM2Usd,
    valorTerrenoEstimadoUsd,
  }
}

// ============================================================
// CÁLCULO PARA MÚLTIPLES TERRENOS (unificación de parcelas)
// ============================================================
// Cuando un desarrollador unifica varios lotes colindantes, la superficie
// total aumenta y generalmente mejora el frente sobre la calle, lo que
// puede habilitar una mejor banda edificable. El barrio/unidad se toma
// del primer terreno (se asume que son colindantes en la misma zona).

export interface TerrenoInput {
  superficieM2: number
  frenteM?: number
  barrio: string
}

export function calcularFactibilidadConjunta(terrenos: TerrenoInput[]): ResultadoFactibilidad & { cantidadTerrenos: number; superficieIndividual: number[] } {
  if (terrenos.length === 0) throw new Error('Se requiere al menos un terreno')

  const superficieTotal = terrenos.reduce((sum, t) => sum + t.superficieM2, 0)
  // El frente combinado es la suma de los frentes individuales (lotes colindantes en la misma calle)
  const frenteTotal = terrenos.reduce((sum, t) => sum + (t.frenteM ?? Math.sqrt(t.superficieM2 / 3)), 0)
  const barrioPrincipal = terrenos[0].barrio

  const resultado = calcularFactibilidad(superficieTotal, barrioPrincipal, frenteTotal)

  return {
    ...resultado,
    cantidadTerrenos: terrenos.length,
    superficieIndividual: terrenos.map(t => t.superficieM2),
  }
}
