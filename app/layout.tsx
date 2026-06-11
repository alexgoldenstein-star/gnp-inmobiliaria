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
  description: 'Desarrollos propios y los mejores proyectos del mercado en Buenos Aires. Departamentos, casas, PH, locales y oficinas en venta y alquiler.',
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
      <body className={`${inter.variable} ${barlowCondensed.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
