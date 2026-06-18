import { NextRequest, NextResponse } from 'next/server'

const PROMPTS: Record<string, Record<string, string>> = {
  instagram_post: {
    aspiracional: 'Escribí un copy aspiracional para Instagram sobre esta propiedad. Usá emojis sutiles, lenguaje premium y lifestyle. Máximo 300 palabras. Incluí precio y ubicación de forma natural.',
    informativo: 'Escribí un post de Instagram informativo con los datos clave de esta propiedad: precio, ambientes, superficie, barrio y características principales. Formato claro con emojis.',
    urgencia: 'Escribí un post de Instagram que genere urgencia para ver esta propiedad. Usá frases como "última oportunidad", "consultá hoy", "quedan pocas unidades". Con emojis y precio destacado.',
    inversor: 'Escribí un post de Instagram orientado a inversores. Destacá el potencial de rentabilidad, la ubicación estratégica y el momento del mercado. Tono profesional con datos.',
  },
  instagram_story: {
    aspiracional: 'Escribí un texto muy corto para historia de Instagram (máx 15 palabras). Impactante, aspiracional. Solo texto principal, sin hashtags.',
    informativo: 'Escribí un texto corto para story (máx 20 palabras) con el dato más relevante: precio y ubicación.',
    urgencia: 'Escribí un CTA urgente para story (máx 10 palabras). Algo como "¡No te lo pierdas!" con el precio.',
    inversor: 'Texto de story para inversor (máx 15 palabras). Destacá rentabilidad o oportunidad única.',
  },
  linkedin: {
    aspiracional: 'Escribí un post de LinkedIn profesional sobre esta propiedad. Tono serio pero atractivo, orientado a profesionales que buscan invertir o mejorar su calidad de vida. 200-350 palabras.',
    informativo: 'Post de LinkedIn con análisis de mercado + datos de esta propiedad. Qué la hace interesante, zona, precio relativo al mercado. 250 palabras.',
    urgencia: 'Post de LinkedIn con oportunidad de inversión urgente. Por qué ahora es el momento. Datos concretos y CTA claro. 200 palabras.',
    inversor: 'Post de LinkedIn para inversores inmobiliarios. ROI estimado, zona en crecimiento, perfil del comprador ideal. Muy profesional. 300 palabras.',
  },
  whatsapp: {
    aspiracional: 'Escribí un mensaje corto de WhatsApp (máx 150 palabras) para compartir esta propiedad. Cálido, directo, con los datos clave. Incluí "Consultá sin compromiso".',
    informativo: 'Mensaje de WhatsApp con los datos clave de la propiedad. Precio, ubicación, características. Máx 100 palabras.',
    urgencia: 'Mensaje de WhatsApp urgente. "¡Oportunidad!" + datos clave + "Respondé HOY". Máx 80 palabras.',
    inversor: 'Mensaje de WhatsApp para potencial inversor. Oportunidad, zona, precio y rentabilidad estimada. Máx 120 palabras.',
  },
}

const HASHTAGS: Record<string, string[]> = {
  instagram_post: ['#inmobiliaria', '#propiedades', '#BuenosAires', '#CABA', '#inversioesinmobiliaria', '#departamentos', '#realestate', '#propiedadesargentina', '#venta', '#alquiler'],
  instagram_story: ['#inmobiliaria', '#CABA', '#propiedades'],
  linkedin: ['#inmobiliaria', '#realestate', '#inversión', '#BuenosAires', '#mercadoinmobiliario', '#propiedades'],
  whatsapp: [],
}

export async function POST(req: NextRequest) {
  try {
    const { propiedad, red, tono } = await req.json()

    const prompt = PROMPTS[red]?.[tono] ?? PROMPTS.instagram_post.aspiracional

    const propInfo = `
Propiedad: ${propiedad.titulo}
Tipo: ${propiedad.tipo}
Operación: ${propiedad.operacion}
Precio: ${propiedad.precio ? `${propiedad.moneda} ${propiedad.precio.toLocaleString()}` : 'A consultar'}
Barrio: ${propiedad.barrio ?? ''}
Ambientes: ${propiedad.ambientes ?? ''}
Superficie: ${propiedad.superficie_cubierta ?? ''}m²
Descripción corta: ${propiedad.descripcion_corta ?? propiedad.descripcion?.substring(0, 200) ?? ''}
Amenities: ${propiedad.amenities?.join(', ') ?? ''}
Inmobiliaria: G&P Negocios Inmobiliarios
    `.trim()

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: 'Sos un experto en marketing inmobiliario argentino. Escribís copies efectivos para redes sociales en español rioplatense (vos, te, etc). Siempre representás a G&P Negocios Inmobiliarios. Respondés SOLO con el texto del copy, sin explicaciones ni encabezados.',
        messages: [{ role: 'user', content: `${prompt}\n\nDatos de la propiedad:\n${propInfo}` }]
      })
    })

    const data = await response.json()
    const contenido = data.content?.[0]?.text ?? 'Error generando contenido'

    // Hashtags base + específicos de barrio
    const hashtagsBase = HASHTAGS[red] ?? []
    const hashtagsExtra = [
      propiedad.barrio ? `#${propiedad.barrio.replace(/\s/g,'')}` : '',
      propiedad.operacion === 'venta' ? '#ventadepartamento' : '#alquilerdepartamento',
      propiedad.tipo === 'departamento' ? '#deptoenventa' : `#${propiedad.tipo}`,
    ].filter(Boolean)

    const hashtags = [...new Set([...hashtagsBase, ...hashtagsExtra])].slice(0, 15)

    return NextResponse.json({ contenido, hashtags })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
