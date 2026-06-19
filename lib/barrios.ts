// Lista única de barrios — usada en TODO el sitio (admin, filtros, home)
// Cualquier cambio acá se refleja en todos lados automáticamente

export const BARRIOS_CABA = [
  'Agronomía', 'Almagro', 'Balvanera', 'Barracas', 'Belgrano', 'Boedo',
  'Caballito', 'Chacarita', 'Coghlan', 'Colegiales', 'Constitución',
  'Flores', 'Floresta', 'La Boca', 'La Paternal', 'Liniers', 'Mataderos',
  'Monserrat', 'Monte Castro', 'Nueva Pompeya', 'Núñez', 'Palermo',
  'Parque Avellaneda', 'Parque Chacabuco', 'Parque Chas', 'Parque Patricios',
  'Paternal', 'Puerto Madero', 'Recoleta', 'Retiro', 'Saavedra',
  'San Cristóbal', 'San Nicolás', 'San Telmo', 'Vélez Sarsfield', 'Versalles',
  'Villa Crespo', 'Villa del Parque', 'Villa Devoto', 'Villa General Mitre',
  'Villa Lugano', 'Villa Luro', 'Villa Ortúzar', 'Villa Pueyrredón',
  'Villa Real', 'Villa Riachuelo', 'Villa Santa Rita', 'Villa Soldati', 'Villa Urquiza',
]

export const ZONAS_GBA_NORTE = [
  'Vicente López', 'San Isidro', 'San Fernando', 'Tigre', 'San Miguel',
  'Malvinas Argentinas', 'José C. Paz', 'Pilar', 'Escobar', 'Tres de Febrero',
]

export const ZONAS_GBA_OESTE = [
  'Hurlingham', 'Ituzaingó', 'Morón', 'Merlo', 'Moreno', 'La Matanza',
  'Marcos Paz', 'General Rodríguez',
]

export const ZONAS_GBA_SUR = [
  'Avellaneda', 'Lanús', 'Lomas de Zamora', 'Quilmes', 'Berazategui',
  'Florencio Varela', 'Almirante Brown', 'Esteban Echeverría', 'Ezeiza',
  'San Vicente', 'Presidente Perón',
]

export const TODAS_LAS_ZONAS = [
  ...BARRIOS_CABA,
  ...ZONAS_GBA_NORTE,
  ...ZONAS_GBA_OESTE,
  ...ZONAS_GBA_SUR,
]

// Para selects agrupados (con optgroup)
export const ZONAS_AGRUPADAS = [
  { grupo: 'CABA', zonas: BARRIOS_CABA },
  { grupo: 'GBA Norte', zonas: ZONAS_GBA_NORTE },
  { grupo: 'GBA Oeste', zonas: ZONAS_GBA_OESTE },
  { grupo: 'GBA Sur', zonas: ZONAS_GBA_SUR },
]
