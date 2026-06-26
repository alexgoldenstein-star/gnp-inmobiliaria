import type { Metadata } from 'next'
import { Inter, Barlow_Condensed } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-barlow'
})

export const metadata: Metadata = {
  title: 'G&P Negocios Inmobiliarios | Propiedades en CABA',
  description: 'Las mejores propiedades del mercado en un solo lugar. Acompañamos cada etapa, de la búsqueda al cierre.',
  keywords: ['inmobiliaria', 'propiedades', 'departamentos', 'CABA', 'Buenos Aires', 'venta', 'alquiler'],
  openGraph: {
    title: 'G&P Negocios Inmobiliarios',
    description: 'Tu próxima inversión empieza acá.',
    type: 'website',
    locale: 'es_AR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Google tag — Analytics 4 (G-P308JQ83QH) + Google Ads (AW-18275184545) */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-P308JQ83QH"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-P308JQ83QH');
          gtag('config', 'AW-18275184545');
        ` }} />
      </head>
      <body className={`${inter.variable} ${barlowCondensed.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
