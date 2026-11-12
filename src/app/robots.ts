import { MetadataRoute } from 'next';

// Avant le lancement : exploration permise pour que les moteurs lisent le noindex (next.config.ts) et désindexent
// les pages ; pas de sitemap annoncé. Au lancement, remettre `sitemap: \`${baseUrl}/sitemap.xml\``
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api']
    }
  };
}
