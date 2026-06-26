import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin/', '/panel/', '/api/', '/mi-cuenta/'] }],
    sitemap: 'https://www.gyp-prop.com.ar/sitemap.xml',
  }
}
