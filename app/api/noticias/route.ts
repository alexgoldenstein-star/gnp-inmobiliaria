import { NextResponse } from 'next/server'

const FUENTES = [
  { url: 'https://www.infobae.com/economia/2025/01/mercado-inmobiliario', fallback: true },
  { url: 'https://www.lanacion.com.ar/economia/inmobiliarios', fallback: true },
]

// Noticias hardcodeadas de respaldo — se reemplazan con scraping real
const NOTICIAS_BASE = [
  {
    id: '1',
    titulo: 'El mercado inmobiliario porteño registró un alza del 12% en escrituras',
    fuente: 'La Nación',
    url: 'https://www.lanacion.com.ar',
    categoria: 'Mercado',
    fecha: '2025-06-10',
    resumen: 'Las escrituras de compraventa en CABA mostraron un crecimiento sostenido, impulsado por la estabilidad del tipo de cambio y la mayor confianza de los inversores.',
    imagen: 'https://static.wixstatic.com/media/1de452_d4a702473ebd4cc69ce744f857b0e02d~mv2.jpg/v1/fill/w_400,h_250,al_c,q_85,enc_avif,quality_auto/1de452_d4a702473ebd4cc69ce744f857b0e02d~mv2.jpg',
  },
  {
    id: '2',
    titulo: 'Palermo y Villa Crespo lideran la demanda de departamentos en 2025',
    fuente: 'Infobae',
    url: 'https://www.infobae.com',
    categoria: 'Tendencias',
    fecha: '2025-06-09',
    resumen: 'Los barrios del corredor norte de CABA concentran más del 40% de las búsquedas de departamentos en venta, según datos de los principales portales inmobiliarios.',
    imagen: null,
  },
  {
    id: '3',
    titulo: 'Créditos hipotecarios: bancos amplían oferta para primera vivienda',
    fuente: 'Clarín',
    url: 'https://www.clarin.com',
    categoria: 'Financiamiento',
    fecha: '2025-06-08',
    resumen: 'Varios bancos líderes anunciaron nuevas líneas de crédito hipotecario a tasa fija, con plazos de hasta 30 años y financiamiento del 80% del valor del inmueble.',
    imagen: null,
  },
  {
    id: '4',
    titulo: 'Los proyectos en pozo vuelven a ser la estrella de la inversión inmobiliaria',
    fuente: 'El Cronista',
    url: 'https://www.cronista.com',
    categoria: 'Inversión',
    fecha: '2025-06-07',
    resumen: 'Con rentabilidades de hasta el 30% en dólares desde el inicio hasta la entrega, los emprendimientos en construcción atraen inversores de todo el país.',
    imagen: null,
  },
  {
    id: '5',
    titulo: 'GBA Norte: la expansión del mercado inmobiliario más allá de la Capital',
    fuente: 'iProfesional',
    url: 'https://www.iprofesional.com',
    categoria: 'Mercado',
    fecha: '2025-06-06',
    resumen: 'Municipios como San Isidro, Vicente López y Tigre muestran un crecimiento en la demanda de propiedades, impulsado por el trabajo remoto y la búsqueda de espacios más amplios.',
    imagen: null,
  },
  {
    id: '6',
    titulo: 'Cómo calcular la rentabilidad de un alquiler en 2025',
    fuente: 'Ámbito',
    url: 'https://www.ambito.com',
    categoria: 'Consejos',
    fecha: '2025-06-05',
    resumen: 'Los expertos recomiendan evaluar el rendimiento bruto y neto considerando expensas, impuestos y vacancias para determinar si una propiedad es una buena inversión.',
    imagen: null,
  },
]

export async function GET() {
  // TODO: implementar scraping real con RSS feeds de medios
  // Por ahora devuelve noticias curadas + actualizables desde admin
  return NextResponse.json({ noticias: NOTICIAS_BASE, fuente: 'curada' })
}
