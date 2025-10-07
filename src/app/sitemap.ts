import { MetadataRoute } from 'next';
import { dataService } from '@/lib/services/dataService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://odm-observatoire-des-marques.netlify.app';

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/marques`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/signaler`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.5,
    // },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Pages dynamiques : marques
  try {
    const slugs = await dataService.getMarquesSlugs();
    const marquePages: MetadataRoute.Sitemap = slugs.map((slug) => ({
      url: `${baseUrl}/marques/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...marquePages];
  } catch (error) {
    console.error('Erreur génération sitemap:', error);
    return staticPages;
  }
}
