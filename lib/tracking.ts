// Funciones de tracking — GA4 + Google Ads conversiones + Meta Pixel
// Llamar desde componentes 'use client' en los eventos importantes.

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    fbq?: (...args: any[]) => void
  }
}

const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

function gtag(...args: any[]) {
  if (typeof window !== 'undefined' && window.gtag) window.gtag(...args)
}
function fbq(event: string, params?: object) {
  if (typeof window !== 'undefined' && window.fbq) window.fbq('track', event, params)
}

// Evento genérico GA4
export function trackEvent(name: string, params?: Record<string, any>) {
  gtag('event', name, params)
}

// Conversión de Google Ads — label viene del env var específico
export function trackConversion(envLabel: string | undefined, value = 0) {
  if (!envLabel || !ADS_ID) return
  gtag('event', 'conversion', { send_to: `${ADS_ID}/${envLabel}`, value, currency: 'USD' })
}

// ── EVENTOS ESPECÍFICOS G&P ────────────────────────────────────────────────

/** Lead desde formulario de contacto o consulta por propiedad */
export function trackLead(params?: { propiedad?: string; barrio?: string }) {
  gtag('event', 'generate_lead', { category: 'lead', ...params })
  fbq('Lead', params)
  trackConversion(process.env.NEXT_PUBLIC_GADS_CONV_LEAD)
}

/** Solicitud de factibilidad de terreno */
export function trackFactibilidad(params?: { barrio?: string; superficie?: number; cantidad_terrenos?: number }) {
  gtag('event', 'factibilidad_solicitada', { category: 'terreno', ...params })
  fbq('Lead', { content_category: 'factibilidad', ...params })
  trackConversion(process.env.NEXT_PUBLIC_GADS_CONV_FACTIBILIDAD)
}

/** Click en WhatsApp */
export function trackWhatsApp(origen?: string) {
  gtag('event', 'whatsapp_click', { category: 'contacto', origen })
  fbq('Contact', { method: 'whatsapp', origen })
  trackConversion(process.env.NEXT_PUBLIC_GADS_CONV_WHATSAPP)
}

/** Vista de propiedad */
export function trackViewPropiedad(titulo: string, operacion: string) {
  gtag('event', 'view_item', { item_name: titulo, item_category: operacion })
  fbq('ViewContent', { content_name: titulo, content_type: 'inmueble' })
}

/** Cambio de página (SPA navigation) */
export function trackPageView(url: string) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  if (GA_ID) gtag('config', GA_ID, { page_path: url })
  if (typeof window !== 'undefined' && window.fbq) window.fbq('track', 'PageView')
}
