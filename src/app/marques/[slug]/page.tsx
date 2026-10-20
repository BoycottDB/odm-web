import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { dataService } from '@/lib/services/dataService';
import MarquePageClient from './MarquePageClient';
import { nomsDesActeursControverses } from '@/components/marque/chaine';

export const revalidate = 600; // ISR 10 minutes

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const marque = await dataService.getMarqueBySlug(slug);

  if (!marque) {
    return {
      title: 'Marque non trouvée'
    };
  }

  const acteurs = nomsDesActeursControverses(marque);
  const title = `Qui j'enrichis en consommant ${marque.nom} ?`;
  const description = acteurs.length > 0
    ? `En consommant ${marque.nom}, j'enrichis ${new Intl.ListFormat('fr', { type: 'conjunction' }).format(acteurs)}. Découvrez pourquoi ça peut poser problème et comment consommer autrement.`
    : `Découvrez qui s'enrichit quand vous consommez ${marque.nom} et comment consommer autrement.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/marques/${slug}`
    }
  };
}

// Generate static params for top brands (partial ISR)
export async function generateStaticParams() {
  try {
    const slugs = await dataService.getMarquesSlugs();
    // Générer les top N marques en statique (fallback: blocking pour les autres)
    return slugs.slice(0, 50).map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error('Erreur génération slugs:', error);
    return [];
  }
}

export default async function MarquePage({ params }: PageProps) {
  const { slug } = await params;
  const marque = await dataService.getMarqueBySlug(slug);

  if (!marque) {
    notFound();
  }

  return <MarquePageClient marque={marque} slug={slug} />;
}
