import type { Metadata } from 'next'
import { Inter, Barlow_Condensed } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-barlow'
})

const SITE_URL = 'https://www.gyp-prop.com.ar'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'G&P Negocios Inmobiliarios | Propiedades en CABA',
    template: '%s | G&P Negocios Inmobiliarios',
  },
  description: 'Las mejores propiedades del mercado en un solo lugar. Departamentos, casas, PH y terrenos en venta y alquiler en CABA y GBA. Acompañamos cada etapa, de la búsqueda al cierre.',
  keywords: ['inmobiliaria CABA', 'propiedades Buenos Aires', 'departamentos en venta', 'alquiler CABA', 'terrenos CABA', 'G&P inmobiliaria', 'GYP propiedades'],
  authors: [{ name: 'G&P Negocios Inmobiliarios' }],
  creator: 'G&P Negocios Inmobiliarios',
  publisher: 'G&P Negocios Inmobiliarios',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: SITE_URL,
    siteName: 'G&P Negocios Inmobiliarios',
    title: 'G&P Negocios Inmobiliarios | Propiedades en CABA',
    description: 'Las mejores propiedades del mercado en CABA y GBA. Departamentos, casas, PH y terrenos.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'G&P Negocios Inmobiliarios' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'G&P Negocios Inmobiliarios',
    description: 'Las mejores propiedades del mercado en CABA y GBA.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: '/favicon.ico',
  },
  verification: {
    // Google Search Console — completar con el código que te da Google
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Google tag — Analytics 4 (G-P308JQ83QH) + Google Ads (AW-18275184545) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-P308JQ83QH" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-P308JQ83QH');
          gtag('config', 'AW-18275184545');
        `}} />
        {/* Schema.org — datos estructurados para Google */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "name": "G&P Negocios Inmobiliarios",
          "url": SITE_URL,
          "logo": `${SITE_URL}/logo-gyp.png`,
          "image": `${SITE_URL}/og-image.jpg`,
          "description": "Inmobiliaria especializada en CABA y GBA. Departamentos, casas, PH, terrenos y proyectos en pozo.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Buenos Aires",
            "addressCountry": "AR"
          },
          "areaServed": ["CABA", "GBA Norte", "GBA Oeste", "GBA Sur"],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": "Spanish"
          }
        })}} />
      </head>
      <body className={`${inter.variable} ${barlowCondensed.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
